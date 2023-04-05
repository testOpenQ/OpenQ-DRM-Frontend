import type { NextApiRequest, NextApiResponse } from "next";
import {
  OpenAIApi,
  Configuration,
  ChatCompletionResponseMessage,
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionRequestMessage,
} from "openai";
import { MAX_TOKENS, countTokens, instructions } from "~/server/gpt";

type Data = {
  summary?: ChatCompletionResponseMessage | string;
  error?: string;
};

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const body = JSON.parse(req.body);
    if (!body.commits || !body.commits.length || !Array.isArray(body.commits)) {
      res.status(400).json({ error: "No valid commits array provided." });
      return;
    }

    const commitsText = body.commits
      .map((commit: any) => {
        let message = commit.message
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
      res
        .status(400)
        .json({
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
      max_tokens: 512,
      temperature: 0.8,
    });

    const summary = completion.data.choices[0]?.message?.content;

    if (!summary) {
      throw new Error("An unexpected error occured. No message.");
    }

    res.status(200).json({ summary });
  } catch (e: any) {
    console.log(e.response.data);
    res.status(200).json({
      error:
        e.response.data.error.message ||
        e.response.message ||
        e.message ||
        "An unexpected error occured. Unable to generate summary.",
    });
  }
};
