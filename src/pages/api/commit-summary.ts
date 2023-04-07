import type { NextApiRequest, NextApiResponse } from "next";
import {
  OpenAIApi,
  Configuration,
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
  type ChatCompletionResponseMessage,
} from "openai";
import { MAX_TOKENS, countTokens, instructions } from "~/server/gpt";

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

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export default async function CommitSummary(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const body = req.body as ValidBody;

    if (!isValidBody(body)) {
      res.status(400).json({ error: "No valid commits array provided." });
      return;
    }

    const commitsText = body.commits
      .map((commit: ValidCommit) => {
        const message = commit.message
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
      .filter((m: string) => m)
      .join("\n");

    const tokenCount = countTokens(commitsText);

    if (tokenCount > MAX_TOKENS) {
      res.status(400).json({
        error: `Too many tokens (${tokenCount}). Please provide fewer commits.`,
      });
      return;
    }

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: instructions,
      },
      {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: commitsText,
      },
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 384,
      temperature: 0.3,
    });

    const summary = completion.data.choices[0]?.message?.content;

    if (!summary) {
      throw new Error("An unexpected error occured. No message.");
    }

    res.status(200).json({ summary });
  } catch (error: unknown) {
    res.status(500).json({ error });
  }
}
