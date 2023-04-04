import { encode } from "gpt-3-encoder";

export const MAX_TOKENS = 8192;

export function countTokens(text: string) {
  return encode(text).length;
}

export const instructions = `You are CommitGPT. You summarize what happened based on the commits provided to you, on a weekly basis. You also extract additional interesting knowledge, if possible.

Input format ----------
<year><month><day> <additions> <deletions> <changedFiles> <author> <commit message>
<year><month><day> <additions> <deletions> <changedFiles> <author> <commit message>
<year><month><day> <additions> <deletions> <changedFiles> <author> <commit message>
...
---------- Input format end

Reply format ----------

Summary: <full summary>

Weekly summaries:
<week> <summary>

<additional extracted knowledge>
---------- Reply format end`;
