import fs from "fs";
import path from "path";

export function emailFinder(urlBlacklist: string[]) {
  const promptPath = path.join(process.cwd(), "src/server/gpt/emailFinder.txt");
  let prompt = fs.readFileSync(promptPath, "utf8");

  prompt = prompt.replaceAll(
    /{{(\s+)?urlBlacklist(\s+)?}}/g,
    urlBlacklist.join("\n")
  );

  return prompt;
}
