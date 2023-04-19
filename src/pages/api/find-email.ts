import type { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
} from "openai";
import { fetchTwitterAccountWebsites } from "~/server/utils/twitter";
import { emailFinder } from "~/server/gpt/system";
import {
  TextSnippet,
  extractEmailTextSnippets,
  extractUrlTextSnippets,
  htmlToMarkdown,
  markdownToText,
} from "~/server/utils/text";
import {
  MAX_TOKENS_GPT4,
  completeChat,
  countContextTokens,
} from "~/server/gpt";
import HTMLPage from "~/server/utils/htmlPage";

const EMAIL_SEARCH_GPT_TOKEN_LIMIT = 25000;

export type FindEmailResponse = {
  candidates: FoundEmail[];
  clickedUrls: string[];
  totalConsumedTokens: {
    input: number;
    output: number;
  };
  chatContexts: ChatCompletionRequestMessage[][];
  error?: string;
};

type GithubUserWithReadme = {
  login: string;
  name: string;
  bio?: string;
  location?: string;
  twitter_username?: string;
  blog?: string;
  readme?: string;
};

type WebsiteData = {
  url: string;
  title: string;
  description: string;
  urlTextSnippets: TextSnippet[];
  emailTextSnippets: TextSnippet[];
};

type FoundEmail = {
  email: string;
  confidence: "high" | "medium";
  reason?: string;
};

function getClickedUrl(input: string): string | null {
  if (input.startsWith("url:")) {
    return input.substring(4).replace(/https?:\/\//, "");
  } else {
    return null;
  }
}

function getFoundEmail(input: string): FoundEmail | null {
  if (input.startsWith("email:")) {
    input = input.substring(6);
    let [email, confidence, reason] = input.split("|").map((s) => s.trim());

    if (
      !email ||
      !reason ||
      !confidence ||
      !["high", "medium"].includes(confidence.toLowerCase())
    ) {
      return null;
    }

    return {
      email,
      confidence: confidence.toLowerCase() as "high" | "medium",
      reason,
    };
  } else {
    return null;
  }
}

function extractCandidatesFromResponse(response: string): FoundEmail[] {
  const candidates: FoundEmail[] = [];

  response.split("\n").forEach((line) => {
    const candidate = getFoundEmail(line);
    if (candidate) {
      candidates.push(candidate);
    }
  });

  return candidates;
}

function extractUrlsFromResponse(response: string) {
  const urls: string[] = [];

  response.split("\n").forEach((line) => {
    const url = getClickedUrl(line);
    if (url) {
      urls.push(url);
    }
  });

  return urls;
}

async function fetchWebsiteData(url: string): Promise<WebsiteData | null> {
  try {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setTimeout(() => {
      abortController.abort();
    }, 5000);

    console.log(`Fetching website data for ${url}`);
    const emailTextSnippets: TextSnippet[] = [];
    const urlTextSnippets: TextSnippet[] = [];

    const clickedPage = await fetch("https://" + url, { signal })
      .then((res) => {
        console.log(
          `Fetched website data for ${url}: ${res.status} ${res.statusText}`
        );
        return res;
      })
      .then((res) => res.text())
      .then((html) => new HTMLPage(html, url));

    const bodyText = htmlToMarkdown(clickedPage.getBody());
    emailTextSnippets.push(...extractEmailTextSnippets(bodyText));
    urlTextSnippets.push(...extractUrlTextSnippets(bodyText));

    return {
      url,
      title: clickedPage.getTitle(),
      description: clickedPage.getDescription(),
      emailTextSnippets,
      urlTextSnippets,
    };
  } catch (e) {
    console.log(`Error fetching website data for ${url}: ${e}`);
    return null;
  }
}

function prepareChatContext(
  userData: GithubUserWithReadme,
  websiteData: WebsiteData[],
  urlBlacklist: string[]
): ChatCompletionRequestMessage[] {
  let userDescription = `Find the email address of GitHub User ${userData.login}.`;
  if (userData.name) {
    userDescription += `\nName: ${userData.name}`;
  }
  if (userData.location) {
    userDescription += `\nLocation: ${userData.location}`;
  }

  const chatContext = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: emailFinder(urlBlacklist),
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: userDescription,
    },
  ];

  websiteData.forEach((data) => {
    chatContext.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `Title: ${data.title}\nDescription: ${data.description}`,
    });

    const contextTokenCount = countContextTokens(chatContext);
    let expectedContextTokenCount = contextTokenCount;

    data.emailTextSnippets.forEach((snippet) => {
      expectedContextTokenCount += snippet.tokenCount;

      if (expectedContextTokenCount < MAX_TOKENS_GPT4) {
        chatContext.push({
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: snippet.context,
        });
      }
    });

    data.urlTextSnippets.forEach((snippet) => {
      expectedContextTokenCount += snippet.tokenCount;

      if (expectedContextTokenCount < MAX_TOKENS_GPT4) {
        chatContext.push({
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: snippet.context,
        });
      }
    });
  });

  return chatContext;
}

async function searchEmailOnline(
  userData: GithubUserWithReadme,
  websiteData: WebsiteData[],
  clickedUrls: string[] = [],
  candidates: FoundEmail[] = [],
  chatContexts: ChatCompletionRequestMessage[][] = [],
  totalConsumedTokens: {
    input: number;
    output: number;
  } = { input: 0, output: 0 }
): Promise<FindEmailResponse> {
  console.log("######### before completion");
  const { error, response, newChatContext, consumedTokens } =
    await completeChat(
      prepareChatContext(userData, websiteData, clickedUrls),
      256,
      0
    );
  console.log("######### after completion");

  if (error || !response) {
    return {
      candidates,
      clickedUrls,
      chatContexts,
      totalConsumedTokens,
      error,
    };
  }

  const nextCandidates = extractCandidatesFromResponse(response);
  const nextUrls = extractUrlsFromResponse(response);

  candidates.push(...nextCandidates);
  clickedUrls.push(...nextUrls);
  chatContexts.push(newChatContext);
  totalConsumedTokens.input += consumedTokens.input;
  totalConsumedTokens.output += consumedTokens.output;

  const nextWebsiteDataRequests = await Promise.all(
    nextUrls.map(fetchWebsiteData)
  );
  const nextWebsiteData = nextWebsiteDataRequests.filter(
    (d) => d
  ) as WebsiteData[];

  if (
    nextWebsiteData.length === 0 ||
    candidates.some((c) => c.confidence === "high") ||
    totalConsumedTokens.input + totalConsumedTokens.output >
      EMAIL_SEARCH_GPT_TOKEN_LIMIT
  ) {
    return {
      candidates,
      clickedUrls,
      chatContexts,
      totalConsumedTokens,
    };
  }

  return searchEmailOnline(
    userData,
    nextWebsiteData,
    clickedUrls,
    candidates,
    chatContexts,
    totalConsumedTokens
  );
}

async function getAvailableUserWebsiteUrls(
  user: GithubUserWithReadme
): Promise<string[]> {
  let uniqueDefinitiveWebsites: string[] = [];

  const websitesFromTwitter = await fetchTwitterAccountWebsites(
    user.twitter_username
  );

  let definitiveWebsites = websitesFromTwitter;

  if (user.blog) {
    definitiveWebsites.push(user.blog);
  }

  definitiveWebsites = definitiveWebsites
    .filter((website) => website)
    .map((website) =>
      website
        .replace(/https?:\/\//, "")
        .replace(/\/$/, "")
        .trim()
    );

  uniqueDefinitiveWebsites = [...new Set(definitiveWebsites)];

  return uniqueDefinitiveWebsites;
}

function emptyResponse(res: NextApiResponse, error: string) {
  res.status(200).json({
    candidates: [],
    clickedUrls: [],
    totalConsumedTokens: 0,
    error,
  });
}

export default async function FindEmail(
  req: NextApiRequest,
  res: NextApiResponse<FindEmailResponse>
) {
  const user = req.body as GithubUserWithReadme;

  if (!user.login) {
    // add more sophisticated validation
    throw new Error("No username provided.");
  }

  const userWebsiteUrls = await getAvailableUserWebsiteUrls(user);

  if (userWebsiteUrls.length === 0) {
    if (!user.readme && !user.bio) {
      return emptyResponse(
        res,
        "No website URLs or bio and readme in user's GitHub profile."
      );
    }

    const githubProfileText = markdownToText(`${user.bio}\n\n${user.readme}`);
    const emailTextSnippets = extractEmailTextSnippets(githubProfileText);
    const urlTextSnippets = extractUrlTextSnippets(githubProfileText);

    if (emailTextSnippets.length + urlTextSnippets.length === 0) {
      return emptyResponse(
        res,
        "No email addresses or URLs found in user's GitHub profile."
      );
    }

    const clickedUrls = [`github.com/${user.login}`];
    const websiteData = [
      {
        url: `github.com/${user.login}`,
        title:
          `${user.login}` +
          (user.name && user.name !== user.login ? ` (${user.name})` : ""),
        description: `${user.login}'s GitHub profile page`,
        emailTextSnippets,
        urlTextSnippets,
      },
    ];

    const searchResult = await searchEmailOnline(
      user,
      websiteData,
      clickedUrls
    );
    res.status(200).json(searchResult);
    return;
  }

  console.log(userWebsiteUrls);
  const websiteDataRequests = await Promise.all(
    userWebsiteUrls.map(fetchWebsiteData)
  );
  console.log("????");
  const websiteData = websiteDataRequests.filter((d) => d) as WebsiteData[];
  console.log(websiteData.map((d) => d.url));
  console.log(websiteData.map((d) => d.emailTextSnippets.length));
  console.log(websiteData.map((d) => d.urlTextSnippets.length));

  const totalTextSnippets = websiteData.reduce(
    (acc, data) =>
      acc + data.emailTextSnippets.length + data.urlTextSnippets.length,
    0
  );

  if (totalTextSnippets === 0) {
    return emptyResponse(
      res,
      "No email addresses or URLs found on the websites of the user."
    );
  }

  const searchResult = await searchEmailOnline(
    user,
    websiteData,
    userWebsiteUrls
  );
  res.status(200).json(searchResult);
}
