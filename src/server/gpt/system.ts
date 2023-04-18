import fs from "fs";
import path from "path";

export function emailFinder() {
  const promptPath = path.join(process.cwd(), "src/server/gpt/emailFinder.txt");
  const prompt = fs.readFileSync(promptPath, "utf8");

  return prompt;
}
