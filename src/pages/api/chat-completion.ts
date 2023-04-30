import type { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
} from "openai";
import { countContextTokens, countTokens, gpt } from "~/server/gpt";

export type ChatCompletionRequestBody = {
  context: ChatCompletionRequestMessage[];
  maxResponseTokens?: number;
  temperature?: number;
};

export type ChatCompletionResponseBody = {
  error?: string;
  response?: string;
  newChatContext: ChatCompletionRequestMessage[];
  consumedTokens: {
    input: number;
    output: number;
  };
};

export function isChatCompletionRequestMessage(
  message: unknown
): message is ChatCompletionRequestMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "role" in message &&
    "content" in message &&
    typeof message.role === "string" &&
    typeof message.content === "string"
  );
}

export function isChatCompletionRequestBody(
  body: unknown
): body is ChatCompletionRequestBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "context" in body &&
    "maxResponseTokens" in body &&
    "temperature" in body &&
    Array.isArray(body.context) &&
    body.context.every((message) => isChatCompletionRequestMessage(message)) &&
    (typeof body.maxResponseTokens === "undefined" ||
      typeof body.maxResponseTokens === "number") &&
    (typeof body.temperature === "undefined" ||
      typeof body.temperature === "number")
  );
}

function getError(e: unknown) {
  let error: string | undefined;

  if (e instanceof Error) {
    error = e.message;
  } else if (e instanceof Response) {
    error = e.statusText;
  } else if (e instanceof Object) {
    if ("message" in e && typeof e.message === "string") {
      error = e.message;
    } else {
      error = JSON.stringify(e);
    }
  } else if (typeof e === "string") {
    error = e;
  } else {
    error = "An unknown error occured.";
  }

  return error;
}

export default async function ChatCompletion(
  req: NextApiRequest,
  res: NextApiResponse<ChatCompletionResponseBody>
) {
  if (req.method !== "POST") {
    throw new Error("Invalid request method.");
  }

  if (!isChatCompletionRequestBody(req.body)) {
    throw new Error("Invalid request body.");
  }

  const { context, maxResponseTokens, temperature } = req.body;

  let response: string | undefined;
  let error: string | undefined;
  const consumedTokens = {
    input: 0,
    output: 0,
  };

  try {
    const completion = await gpt.createChatCompletion({
      model: "gpt-4",
      messages: context,
      max_tokens: maxResponseTokens || 256,
      temperature: temperature || 0.7,
    });

    response = completion.data.choices[0]?.message?.content;

    if (!response) {
      throw new Error(
        "An unexpected error occured. AI response didn't contain a message."
      );
    }

    consumedTokens.input = countContextTokens(context);

    context.push({
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: response,
    });

    consumedTokens.output = countTokens(response);
  } catch (e: unknown) {
    error = getError(e);
  }

  res.status(200).json({
    error,
    response,
    newChatContext: context,
    consumedTokens,
  });
}
