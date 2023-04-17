import turndown from "turndown";
import markdownToTxt from "markdown-to-txt";

export function htmlToMarkdown(html: string) {
  const turndownService = new turndown();

  return turndownService.turndown(html);
}

export function markdownToText(markdown: string | undefined) {
  if (!markdown) {
    return "";
  }

  return markdownToTxt(markdown);
}

export function htmlToText(html: string) {
  const markdown = htmlToMarkdown(html);

  return markdownToText(markdown);
}

export function extractTextSnippet(
  text: string,
  pattern: RegExp,
  maxWords = 30
) {
  const emailMatches = text.match(new RegExp(pattern.source, "g"));
  const emailLines = [];

  if (emailMatches) {
    for (const email of emailMatches) {
      const emailIndex = text.indexOf(email);
      const textBeforeEmail = text.slice(0, emailIndex).trim();
      const textAfterEmail = text.slice(emailIndex + email.length).trim();
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
        .concat(email, wordsAfterEmail.slice(0, wordsAfter))
        .join(" ");

      emailLines.push(trimmedLine);
    }
  }

  return emailLines;
}

export function extractEmailTextSnippets(
  text: string,
  filter: (line: string) => boolean = () => true,
  maxLineLength = 30
) {
  // https://www.regextester.com/19
  const EMAIL_PATTERN =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;

  const snippets = extractTextSnippet(text, EMAIL_PATTERN, maxLineLength);
  return snippets.filter(filter);
}

export function extractUrlTextSnippets(
  text: string,
  filter: (line: string) => boolean = () => true,
  maxLineLength = 30
) {
  // https://www.regextester.com/19
  const URL_PATTERN =
    /(?:(?:https?):\/\/|www\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/g;

  const snippets = extractTextSnippet(text, URL_PATTERN, maxLineLength);
  return snippets.filter(filter);
}
