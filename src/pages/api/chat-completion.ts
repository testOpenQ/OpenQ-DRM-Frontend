import type { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
} from "openai";
import { countContextTokens, gpt } from "~/server/gpt";

export type ChatCompletionRequestBody = {
  context: ChatCompletionRequestMessage[];
  maxResponseTokens?: number;
  temperature?: number;
};

export type ChatCompletionResponseBody = {
  response: string;
  newContext: ChatCompletionRequestMessage[];
  consumedTokens: number;
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

  const completion = await gpt.createChatCompletion({
    model: "gpt-4",
    messages: context,
    max_tokens: maxResponseTokens || 256,
    temperature: temperature || 0.7,
  });

  const response = completion.data.choices[0]?.message?.content;

  if (!response) {
    throw new Error("An unexpected error occured. AI is unresponsive.");
  }

  context.push({
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: response,
  });

  const consumedTokens = countContextTokens(context);

  res.status(200).json({
    response,
    newContext: context,
    consumedTokens,
  });
}
