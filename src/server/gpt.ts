import { encode } from "gpt-3-encoder";
import { Configuration, OpenAIApi } from "openai";

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

export const instructions = `You are CommitGPT, summarizing commit messages for project managers. You give a brief general summary, followed by a one- to two-sentence overview of each developer's recent work, excluding bots like dependabot.

Input format:
<developer> <msg>
...
`;
