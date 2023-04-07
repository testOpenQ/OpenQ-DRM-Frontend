import type { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
  type ChatCompletionResponseMessage,
} from "openai";
import { gpt, MAX_TOKENS, countTokens } from "~/server/gpt";

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

function prepareCommits(commits: ValidCommit[]) {
  return commits
    .map((commit) => {
      const message = commit.message
        .replace(/https?:\/\//g, "")
        .replace(/\r/g, " ")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .replace(/[^\w\s]/gi, "")
        .trim();

      if (
        message.startsWith("Merge branch") ||
        message.startsWith("Merge pull request")
      ) {
        return "";
      }

      return `${commit.author.user.login} ${message}`;
    })
    .filter((m) => m);
}

const commitSummaryInstruction =
  "You are CommitGPT: You summarize commit messages.";
const summarySummaryInstruction =
  "You are TechCommunicatorGPT: You summarize a technical text for project managers.";

function chunkCommits(commits: string[]) {
  const chunks: string[][] = [];

  const promptTokenCount = countTokens(commits.join("\n"));
  const instructionTokenCount = countTokens(commitSummaryInstruction);
  const totalTokenCount = promptTokenCount + instructionTokenCount;

  if (totalTokenCount > MAX_TOKENS) {
    const numberOfChunks = Math.ceil(
      promptTokenCount / (MAX_TOKENS - instructionTokenCount)
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

  const sanitizedCommits = prepareCommits(body.commits);
  const chunks = chunkCommits(sanitizedCommits);
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
        model: "gpt-4",
        messages,
        max_tokens: 256,
        temperature: 0.5,
      });

      const summary = completion.data.choices[0]?.message?.content;

      if (!summary) {
        res
          .status(500)
          .json({
            error:
              "An unexpected error occured. Commit summary has no content.",
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

  if (summaries.length === 1) {
    res.status(200).json({ summary: summaries[0] });
  } else {
    const messages: ChatCompletionRequestMessage[] = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: summarySummaryInstruction,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: summaries.join("\n"),
      },
    ];

    console.log(summaries.join("\n"));

    try {
      const completion = await gpt.createChatCompletion({
        model: "gpt-4",
        messages,
        max_tokens: 384,
        temperature: 0.5,
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
}
