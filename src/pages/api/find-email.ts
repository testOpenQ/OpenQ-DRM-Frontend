import type { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
} from "openai";
import { gpt } from "~/server/gpt";
import { JSDOM } from "jsdom";
import { htmlToText } from "html-to-text";

interface ExtractedInfo {
  title: string;
  description: string;
  emails: { [topic: string]: string[] };
  urls: { [topic: string]: { label: string; url: string }[] };
}

function findTopic(element: Element): string {
  const heading = element.closest("h1, h2, h3, h4, h5, h6");
  if (heading) {
    return heading.textContent?.trim() || "";
  }
  return "Other";
}

function extractUrlsAndEmails(html: string): ExtractedInfo {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const extractedInfo: ExtractedInfo = {
    title: doc.title,
    description:
      doc.querySelector('meta[name="description"]')?.getAttribute("content") ||
      "",
    emails: {},
    urls: {},
  };

  const bodyText = htmlToText(html);

  // Extract all links
  const links = bodyText.match(/(https?:\/\/[^\s]+)/g);
  const emails = bodyText.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g
  );

  links.forEach((link) => {
    const href = link.href;
    const label = link.textContent?.trim() || href;

    // Determine if the link is an email or URL
    if (href.startsWith("mailto:")) {
      const email = href.replace("mailto:", "");
      const topic = findTopic(link);

      // Add the email to the extractedInfo object
      if (!extractedInfo.emails[topic]) {
        extractedInfo.emails[topic] = [];
      }

      extractedInfo.emails[topic]!.push(email);
    } else if (href.startsWith("http://") || href.startsWith("https://")) {
      if (/github\.com/.test(href)) {
        return;
      }
      if (/twitter\.com/.test(href)) {
        return;
      }

      if (/\.(png|jpg|jpeg|gif)$/i.test(href)) {
        return;
      }

      const topic = findTopic(link);

      // Add the URL to the extractedInfo object
      if (!extractedInfo.urls[topic]) {
        extractedInfo.urls[topic] = [];
      }

      extractedInfo.urls[topic]!.push({ label, url: href });
    }
  });

  return extractedInfo;
}

type ValidBody = {
  username: string;
  website?: string;
  twitter?: string;
  bio?: string;
  readme?: string;
};

function isCommands(input: string) {
  return input.startsWith("<click:");
}

function isEmail(input: string) {
  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return EMAIL_REGEX.test(input);
}

function formatExtractedInfo(extractedInfo: ExtractedInfo) {
  const emailsText = Object.entries(extractedInfo.emails)
    .map(([topic, emails]) => {
      return `${topic}: ${emails.join("\n")}`;
    })
    .join("\n");

  const urlTexts = Object.entries(extractedInfo.urls)
    .map(([topic, urls]) => {
      return `${topic}: ${urls
        .map((url) => `${url.label}: ${url.url}`)
        .join("\n")}`;
    })
    .join("\n");

  return `${extractedInfo.title}
${extractedInfo.description}

${emailsText}

${urlTexts}`;
}

function extractUrlsFromClickCommands(input: string) {
  const urls = [];
  let match;
  let matches = input.matchAll(/<click:(.*?)>/g);

  for (match of matches) {
    urls.push(match[1] as string);
  }

  return urls;
}

const systemInstructions = `You discover a GitHub user's email address online.
You receive a GitHub username and then email addresses and URLs (with labels, ordered by topic).
You can click on a link to gather more links, and potential email addresses.
If you can't find any obvious email addresses, you can also pick one from a project/company, but try a few websites first.
If you found an email address, you assign a confidence score between 0 and 1.
1 means you are sure that this is an email address over which you can contact the developer.
If you are provided with empty content, you pick another link.
After clicking 10 links and not finding an email address, you give up and return a final "surrender"-statement.
Input:
<github user>

or

<links/email addresses>

Output:
<the email address> <confidence score>

or

<click:url>
...`;

async function searchEmail(context: ChatCompletionRequestMessage[]): Promise<{
  candidates: string[];
  context: ChatCompletionRequestMessage[];
}> {
  try {
    const completion = await gpt.createChatCompletion({
      model: "gpt-4",
      messages: context,
      max_tokens: 150,
      temperature: 0,
    });

    const response = completion.data.choices[0]?.message?.content;

    if (!response) {
      throw new Error("An unexpected error occured. AI is unresponsive.");
    } else {
      context.push({
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
        content: response,
      });

      if (isEmail(response)) {
        console.log(response);
        const [email, confidence] = response.split(" ");
        console.log(email, confidence);

        return {
          candidates: [email],
          confidences: [confidence],
          context,
        };
      } else if (isCommands(response)) {
        const urls = extractUrlsFromClickCommands(response);
        if (urls.length === 0) {
          throw new Error(
            "An unexpected error occured. AI returns invalid urls."
          );
        }
        const textContents = await Promise.all(
          urls.map((url) => {
            return fetch(url)
              .then((res) => res.text())
              .then(extractUrlsAndEmails)
              .then(formatExtractedInfo);
          })
        );

        context.push({
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: textContents.join("\n"),
        });
        return searchEmail(context);
      } else {
        return {
          candidates: [],
          context,
        };
      }
    }
  } catch (error: any) {
    console.error(error, error.response);
    return {
      candidates: [],
      context,
    };
  }
}

export default async function FindEmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, website, twitter, bio, readme } = req.body as ValidBody;

  if (!username) {
    throw new Error("No username provided.");
  }

  if (!website && !twitter) {
    throw new Error("No website or Twitter provided.");
  }

  if (!website) {
    // TODO: Look up website from Twitter
  }

  if (!website) {
    throw new Error("No website found on twitter. Ending search.");
  }

  const absoluteWebsiteUrl = website.startsWith("http")
    ? website
    : `https://${website}`;

  const html = await fetch(absoluteWebsiteUrl).then((res) => res.text());

  if (!html) {
    throw new Error("No data found at website. Ending search.");
  }

  const dataText = formatExtractedInfo(extractUrlsAndEmails(htmlToText(html)));
  console.log(dataText);

  process.exit();

  const initialContext: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: systemInstructions,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: username,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: dataText,
    },
  ];

  const result = await searchEmail(initialContext);

  res.status(200).json(result);
}
