import fs from "fs";
import path from "path";

export function emailFinder() {
  const promptPath = path.join(__dirname, "emailFinder.txt");
  const prompt = fs.readFileSync(promptPath, "utf8");

  console.log(prompt);

  return prompt;
}
