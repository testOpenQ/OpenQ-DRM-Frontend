import { encode } from "gpt-3-encoder";

export const MAX_TOKENS = 8192;

export function countTokens(text: string) {
  return encode(text).length;
}

export const instructions = `You are CommitGPT, summarizing commit messages for project managers. You give a brief general summary, followed by a one- to two-sentence overview of each developer's recent work, excluding bots like dependabot.

Input format:
<developer> <msg>
...
`;
