import { encode } from "gpt-3-encoder";

export const MAX_TOKENS = 8192;

export function countTokens(text: string) {
  return encode(text).length;
}

export const instructions = `You are CommitGPT. Summarize weekly commits and extract interesting knowledge.

Input format:
<date> <add> <del> <chgfs> <auth> <msg>
...

Output format:
Summary: <summary>
Weekly summaries:
<week> <summary>
<knowledge>`;
