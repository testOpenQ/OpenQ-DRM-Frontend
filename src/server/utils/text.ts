import turndown from "turndown";
import markdownToTxt from "markdown-to-txt";
import { countTokens } from "../gpt";

export function htmlToMarkdown(html: string) {
  const turndownService = new turndown();

  return turndownService.turndown(html);
}

export function markdownToText(markdown: string | undefined) {
  if (!markdown) {
    return "";
  }

  return markdownToTxt(markdown, { mangle: false });
}

export function htmlToText(html: string) {
  const markdown = htmlToMarkdown(html);

  return markdownToText(markdown);
}

export type TextSnippet = {
  match: string;
  context: string;
  tokenCount: number;
};

export function extractTextSnippet(
  text: string,
  pattern: RegExp,
  maxWords = 30
) {
  const matches = text.match(new RegExp(pattern.source, "g"));
  const snippets: TextSnippet[] = [];

  if (matches) {
    for (const match of matches) {
      const matchIndex = text.indexOf(match);
      const textBeforeEmail = text.slice(0, matchIndex).trim();
      const textAfterEmail = text.slice(matchIndex + match.length).trim();
      const wordsBeforeEmail = textBeforeEmail.split(" ");
      const wordsAfterEmail = textAfterEmail.split(" ");

      let wordsBefore = Math.min(
        wordsBeforeEmail.length,
        Math.floor((maxWords - 1) / 2)
      );
      let wordsAfter = Math.min(
        wordsAfterEmail.length,
        Math.ceil((maxWords - 1) / 2)
      );

      if (wordsBefore < 14) {
        wordsAfter = Math.min(
          wordsAfter + (14 - wordsBefore),
          wordsAfterEmail.length
        );
      } else if (wordsAfter < 14) {
        wordsBefore = Math.min(
          wordsBefore + (14 - wordsAfter),
          wordsBeforeEmail.length
        );
      }

      const trimmedLine = wordsBeforeEmail
        .slice(-wordsBefore)
        .concat(match, wordsAfterEmail.slice(0, wordsAfter))
        .join(" ")
        .replace(/[\s\n\r]+/g, " ")
        .trim();

      const tokenCount = countTokens(trimmedLine);

      snippets.push({
        match,
        context: trimmedLine,
        tokenCount,
      });
    }
  }

  return snippets;
}

export function extractEmailTextSnippets(
  text: string,
  filter: (snippet: TextSnippet) => boolean = () => true,
  maxLineLength = 30
) {
  const EMAIL_PATTERN = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g;

  const snippets = extractTextSnippet(text, EMAIL_PATTERN, maxLineLength);
  return snippets.filter(filter);
}

export function extractUrlTextSnippets(
  text: string,
  filter: (snippet: TextSnippet) => boolean = () => true,
  maxLineLength = 30
) {
  const URL_PATTERN =
    /https?:\/\/([^:\/\s]+)(:\d+)?(((\/\w+)*\/)([\w\-\.]+[^#?\s]+)([^\s#]*)?)?/g;

  const snippets = extractTextSnippet(text, URL_PATTERN, maxLineLength);
  return snippets.filter(filter);
}
