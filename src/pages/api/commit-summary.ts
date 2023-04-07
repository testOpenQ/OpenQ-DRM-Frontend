import type { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
  type ChatCompletionResponseMessage,
} from "openai";
import { gpt, MAX_TOKENS_GPT3_5, countTokens } from "~/server/gpt";

type Data = {
  summary?: ChatCompletionResponseMessage | string;
  error?: unknown;
};

type ValidCommit = {
  message: string;
  author: {
    user: {
      login: string;
    };
  };
};

type ValidBody = {
  commits: ValidCommit[];
};

function isValidCommit(commit: unknown): commit is ValidCommit {
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

function isValidBody(body: unknown): body is ValidBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "commits" in body &&
    typeof body.commits === "object" &&
    Array.isArray(body.commits) &&
    body.commits.every(isValidCommit)
  );
}

function sanitizeCommits(commits: ValidCommit[]) {
  return commits
    .map((commit) => {
      return {
        ...commit,
        message: commit.message
          .replace(/https?:\/\//g, "")
          .replace(/\r/g, " ")
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .replace(/[^\w\s]/gi, "")
          .trim(),
      };
    })
    .filter((commit) => commit.message !== "");
}

function filterCommits(commits: ValidCommit[]) {
  return commits.filter((commit) => {
    return (
      !commit.message.startsWith("Merge branch") &&
      !commit.message.startsWith("Merge pull request")
    );
  });
}

function prepareCommits(commits: ValidCommit[], renderAuthor: boolean) {
  return commits.map((commit) => {
    return renderAuthor
      ? `${commit.author.user.login} ${commit.message}`
      : `${commit.message}`;
  });
}

const degender = `You infer a developer's gender from the username and use only he or she. If the username doesn't indicate the gender, you use "he" or the username.`;
function degenderSolo(name: string) {
  return `You infer ${name}'s gender from the username. If "${name}" doesn't indicate the gender, you use "he" or "${name}".`;
}
const commitSummaryInstruction = `You are ChangeLogGPT: You summarize commit messages into a changelog for each developer. ${degender}`;

function teamReportInstruction(authorNames: string[]) {
  return `You are ChangeReportGPT: You summarize the changelog of a git repository for the project manager. You give a very brief, well formulated, general summary, followed by one or two short sentences about each developer's recent work. You start with the words: "The team has been working on" and then, for the developers ${authorNames.join(
    ", "
  )}: "<Name> ...". ${degender}`;
}

function soloDevReportInstruction(name: string) {
  return `You are ChangeReportGPT: You write a very brief and vell formulated summary for a project manager, about developer ${name}'s recent work. ${degenderSolo(
    name
  )} Start with: "${name} ..."`;
}

function chunkCommits(commits: string[]) {
  const chunks: string[][] = [];

  const promptTokenCount = countTokens(commits.join("\n"));
  const instructionTokenCount = countTokens(commitSummaryInstruction);
  const totalTokenCount = promptTokenCount + instructionTokenCount;

  if (totalTokenCount > MAX_TOKENS_GPT3_5) {
    const numberOfChunks = Math.ceil(
      promptTokenCount / (MAX_TOKENS_GPT3_5 - instructionTokenCount)
    );
    const chunkSize = Math.ceil(commits.length / numberOfChunks);

    for (let i = 0; i < commits.length; i += chunkSize) {
      chunks.push(commits.slice(i, i + chunkSize));
    }
  } else {
    chunks.push(commits);
  }

  return chunks;
}

export default async function CommitSummary(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = req.body as ValidBody;

  if (!isValidBody(body)) {
    res.status(400).json({ error: "No valid commits array provided." });
    return;
  }

  const sanitizedCommits = sanitizeCommits(body.commits);
  const filteredCommits = filterCommits(sanitizedCommits);
  const authorNames = filteredCommits
    .map((commit) => commit.author.user.login)
    .filter((name, index, array) => array.indexOf(name) === index);
  const preparedCommits = prepareCommits(
    filteredCommits,
    authorNames.length > 1
  );
  const chunks = chunkCommits(preparedCommits);
  const summaries: string[] = [];

  for (const chunk of chunks) {
    const messages: ChatCompletionRequestMessage[] = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: commitSummaryInstruction,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: chunk.join("\n"),
      },
    ];

    try {
      const completion = await gpt.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 256,
        temperature: 0.3,
      });

      const summary = completion.data.choices[0]?.message?.content;

      if (!summary) {
        res.status(500).json({
          error: "An unexpected error occured. Commit summary has no content.",
        });
        return;
      }

      summaries.push(summary);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response
      ) {
        console.error(error.response.data);
      }

      res
        .status(500)
        .json({ error: "An unexpected error occured. Commit summary failed." });
      return;
    }
  }

  if (summaries.length !== chunks.length) {
    throw new Error(
      `An unexpected error occured. Expected ${chunks.length} summaries, got ${summaries.length}.`
    );
  }

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content:
        authorNames.length === 1
          ? soloDevReportInstruction(authorNames[0] as string)
          : teamReportInstruction(authorNames),
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: summaries.join("\n"),
    },
  ];

  try {
    const completion = await gpt.createChatCompletion({
      model: "gpt-4",
      messages,
      max_tokens: 384,
      temperature: 0.6,
    });

    const summary = completion.data.choices[0]?.message?.content;

    if (!summary) {
      throw new Error("An unexpected error occured. No final summary.");
    } else {
      res.status(200).json({ summary });
      return;
    }
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "data" in error.response &&
      typeof error.response.data === "string"
    ) {
      console.error(error.response.data);
    }

    res
      .status(500)
      .json({ error: "An unexpected error occured. Final summary failed." });
    return;
  }
}
