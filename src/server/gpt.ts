import { encode } from "gpt-3-encoder";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { ChatCompletionResponseBody } from "~/pages/api/chat-completion";

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

export async function completeChat(
  context: ChatCompletionRequestMessage[],
  maxResponseTokens: number,
  temperature: number
): Promise<ChatCompletionResponseBody> {
  const res = await fetch("/api/chat-completion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      context,
      maxResponseTokens,
      temperature,
    }),
  });

  return await res.json();
}
