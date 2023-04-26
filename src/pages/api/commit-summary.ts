import type { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
} from "openai";
import { MAX_TOKENS_GPT4, completeChat, countTokens } from "~/server/gpt";

type ResponseData = {
  totalConsumedTokens: {
    input: number;
    output: number;
  };
  report?: string;
  error?: unknown;
};

type Commit = {
  message: string;
  author: {
    user: {
      login: string;
    };
  };
};

type RequestBody = {
  commits: Commit[];
};

// In the instructions it mentions 300 WORDS. That's a "linguistic" instruction for the GPT and different from tokens.
// The "max_tokens" parameter in the OpenAI API is not supposed be used to limit the GPTs output "linguistically".
// It would produce cut-off results, if, let's say, you limit the output to 100 (~85 words) tokens and then say "Write 10.000 words essay about AI."
// (It won't reply with "I can't do that because you configured me wrong.")
const MAX_REPORT_TOKEN_LENGTH = 300;

const reportInstruction = `You are ChangeReportGPT: Summarize git commit messages for a project manager, starting with "The team has been working on...". Infer a developer's gender from the username and use "he" or "she" accordingly. If uncertain, use the username. Keep the report concise and relevant, excluding inactive developers and avoiding redundancy. Limit your report to 300 words.`;
const combineInstruction = `Combine the separate reports provided by the user into a single version, ensuring that the final report is not significantly longer than the longest individual report.`;
const reportInstructionTokenCount = countTokens(reportInstruction);
const combineInstructionTokenCount = countTokens(combineInstruction);

function isCommit(commit: unknown): commit is Commit {
  return (
    typeof commit === "object" &&
    commit !== null &&
    "message" in commit &&
    "author" in commit &&
    typeof commit.message === "string" &&
    typeof commit.author === "object" &&
    commit.author !== null &&
    "user" in commit.author &&
    typeof commit.author.user === "object" &&
    commit.author.user !== null &&
    "login" in commit.author.user &&
    typeof commit.author.user.login === "string"
  );
}

function isRequestBody(body: unknown): body is RequestBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "commits" in body &&
    typeof body.commits === "object" &&
    Array.isArray(body.commits) &&
    body.commits.every(isCommit)
  );
}

function sanitizeCommits(commits: Commit[]) {
  const URL_REGEX = /https?:\/\/[^\s]+/g;
  return commits
    .map((commit) => {
      let message = commit.message
        .split("\n")[0]!
        .replaceAll(URL_REGEX, "")
        .replace(/\s+/g, " ")
        .trim();

      // https://git-scm.com/docs/git-commit#_discussion
      // a proper commit message is usually not longer than 50 characters
      // we give it 80
      if (message.length > 80) {
        message = message.slice(0, 80) + "...";
      }

      return { ...commit, message };
    })
    .filter((commit) => commit.message !== "");
}

enum CommitFilter {
  NoMerge = "NoMerge",
  NoDependaBot = "NoDependaBot",
}

function filterCommits(commits: Commit[], filters: CommitFilter[] = []) {
  if (filters.includes(CommitFilter.NoMerge)) {
    commits = commits.filter((commit) => {
      return (
        // should probably be separate filters
        !commit.message.startsWith("Merge branch") &&
        !commit.message.startsWith("Merge pull request") &&
        !commit.message.startsWith("Merge remote") &&
        !commit.message.startsWith("Merge tag")
      );
    });
  }

  if (filters.includes(CommitFilter.NoDependaBot)) {
    commits = commits.filter((commit) => {
      return !commit.author.user.login.startsWith("dependabot");
    });
  }

  return commits;
}

function chunkCommits(commits: Commit[], chunkSize: number) {
  const chunks: Commit[][] = [];

  for (let i = 0; i < commits.length; i += chunkSize) {
    chunks.push(commits.slice(i, i + chunkSize));
  }

  return chunks;
}

function populateContextWithCommits(
  context: ChatCompletionRequestMessage[],
  commits: Commit[]
) {
  if (commits.length === 0) {
    return context;
  }

  let currentAuthor: string | undefined = undefined;

  for (const commit of commits) {
    if (commit.author.user.login !== currentAuthor) {
      context.push({
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: `${commit.author.user.login}:`,
      });
      currentAuthor = commit.author.user.login;
    }

    context.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: commit.message,
    });
  }

  return context;
}

async function generateReport(commits: Commit[]) {
  if (commits.length === 0) {
    throw new Error("No commits to generate a summary from.");
  }

  const tokensAvailableForCommits =
    MAX_TOKENS_GPT4 - reportInstructionTokenCount;

  const tokenCounts = commits.map((commit) => countTokens(commit.message));
  const averageCommitMessageTokenCount = Math.ceil(
    tokenCounts.reduce((a, b) => a + b, 0) / tokenCounts.length
  );

  const maxCommitsPerReport = Math.floor(
    tokensAvailableForCommits / averageCommitMessageTokenCount
  );

  const chunkedCommits = chunkCommits(commits, maxCommitsPerReport);
  const numberOfReports = chunkedCommits.length;

  if (
    numberOfReports * MAX_REPORT_TOKEN_LENGTH >
    MAX_TOKENS_GPT4 - combineInstructionTokenCount
  ) {
    throw new Error(`Too many commits to generate a summary from.`);
  }

  const reports: string[] = [];
  const errors: string[] = [];
  const totalConsumedTokens = {
    input: 0,
    output: 0,
  };

  const reportCompletions = await Promise.all(
    chunkedCommits.map((chunk) => {
      const context: ChatCompletionRequestMessage[] = [];
      context.push({
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: reportInstruction,
      });
      populateContextWithCommits(context, chunk);

      return completeChat(context);
    })
  );

  for (const completion of reportCompletions) {
    if (completion.response) {
      reports.push(completion.response);
    }

    if (completion.error) {
      errors.push(completion.error);
    }

    totalConsumedTokens.input += completion.consumedTokens.input;
    totalConsumedTokens.output += completion.consumedTokens.output;
  }

  let finalReport: string | undefined = undefined;

  if (reports.length === 1) {
    finalReport = reports.pop() as string;
  } else {
    const context: ChatCompletionRequestMessage[] = [];

    context.push({
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: combineInstruction,
    });

    for (const report of reports) {
      context.push({
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: report,
      });
    }

    const completion = await completeChat(context, MAX_REPORT_TOKEN_LENGTH, 0);

    if (completion.response) {
      finalReport = completion.response;
    }

    if (completion.error) {
      errors.push(completion.error);
    }

    totalConsumedTokens.input += completion.consumedTokens.input;
    totalConsumedTokens.output += completion.consumedTokens.output;
  }

  return {
    report: finalReport,
    errors,
    totalConsumedTokens,
  };
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};

export default async function CommitSummary(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const body = req.body as RequestBody;

  if (!isRequestBody(body)) {
    res.status(400).json({
      error: "Invalid request body.",
      totalConsumedTokens: {
        input: 0,
        output: 0,
      },
    });
    return;
  }

  const sanitizedCommits = sanitizeCommits(body.commits);
  const filteredCommits = filterCommits(sanitizedCommits, [
    CommitFilter.NoMerge,
    CommitFilter.NoDependaBot,
  ]);

  const { report, errors, totalConsumedTokens } = await generateReport(
    filteredCommits
  );

  if (report) {
    res.status(200).json({ report, totalConsumedTokens });
  } else {
    console.error(errors);
    res
      .status(500)
      .json({ error: "An unexpected error occured.", totalConsumedTokens });
  }
}
