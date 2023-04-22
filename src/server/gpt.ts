import { encode } from "gpt-3-encoder";
import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai";
import type { ChatCompletionResponseBody } from "~/pages/api/chat-completion";

export const gpt = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export const MAX_TOKENS_GPT4 = 8192 * 0.7;
export const MAX_TOKENS_GPT3_5 = 4096 * 0.7;

export function countTokens(text: string) {
  return encode(text).length;
}

export function countContextTokens(context: ChatCompletionRequestMessage[]) {
  return context.reduce(
    (acc, message) => acc + countTokens(message.content),
    0
  );
}

export async function completeChat(
  context: ChatCompletionRequestMessage[],
  maxResponseTokens: number = 64,
  temperature: number = 0
): Promise<ChatCompletionResponseBody> {
  const res = await fetch(
    `${process.env.BASE_URL as string}/api/chat-completion`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context,
        maxResponseTokens,
        temperature,
      }),
    }
  );

  return (await res.json()) as ChatCompletionResponseBody;
}
