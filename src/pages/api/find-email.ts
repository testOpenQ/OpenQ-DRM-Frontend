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
  countTokens,
} from "~/server/gpt";
import HTMLPage from "~/server/utils/htmlPage";

type GithubUserWithReadme = {
  login: string;
  name: string;
  bio?: string;
  twitter_username?: string;
  blog?: string;
  readme?: string;
};

type FoundEmail = {
  email: string;
  confidence: number;
  reason?: string;
};

export type FindEmailResponse = {
  candidates: FoundEmail[];
  finalContext: ChatCompletionRequestMessage[];
  googleSearches: string[];
  clickedUrls: string[];
  totalConsumedTokens: number;
};

function getGoogleSearchQuery(input: string): string | null {
  if (input.startsWith("google:")) {
    return input.substring(7);
  } else {
    return null;
  }
}

function getClickedUrl(input: string): string | null {
  if (input.startsWith("click:")) {
    return input.substring(6).replace(/https?:\/\//, "");
  } else {
    return null;
  }
}

function getFoundEmail(input: string): FoundEmail | null {
  if (input.startsWith("email:")) {
    input = input.substring(6);
    const [email, confidence, reason] = input.split(" ");

    if (!email || !confidence) {
      return null;
    }

    return {
      email,
      confidence: Number(confidence),
      reason,
    };
  } else {
    return null;
  }
}

async function searchEmailOnline(
  initialChatContext: ChatCompletionRequestMessage[]
): Promise<FindEmailResponse> {
  const candidates: FoundEmail[] = [];
  const googleSearches: string[] = [];
  const clickedUrls: string[] = [];
  const maxTries = 10;
  let tries = 0;
  let chatContext = initialChatContext;
  let totalConsumedTokens = 0;

  while (tries < maxTries) {
    tries++;
    if (tries === maxTries) {
      console.log("(last try)");
    }

    const {
      response,
      newContext: newChatContext,
      consumedTokens,
    } = await completeChat(chatContext, 100, 0);
    chatContext = newChatContext;
    totalConsumedTokens += consumedTokens;

    const nextGoogleSearches: string[] = [];
    const nextClickedUrls: string[] = [];

    response.split("\n").forEach((line) => {
      const candidate = getFoundEmail(line);
      if (candidate) {
        candidates.push(candidate);
      }

      const googleSearchQuery = getGoogleSearchQuery(line);
      if (googleSearchQuery) {
        nextGoogleSearches.push(googleSearchQuery);
        googleSearches.push(googleSearchQuery);
      }

      const clickedUrl = getClickedUrl(line);
      if (clickedUrl) {
        nextClickedUrls.push(clickedUrl);
        clickedUrls.push(clickedUrl);
      }
    });

    if (
      nextGoogleSearches.length === 0 &&
      nextClickedUrls.length === 0 &&
      candidates.some((c) => c.confidence > 0.5)
    ) {
      break;
    }

    const emailTextSnippets: TextSnippet[] = [];
    const urlTextSnippets: TextSnippet[] = [];

    if (nextGoogleSearches.length > 0) {
      for (const query of nextGoogleSearches) {
        const searchUrl = `google.com/search?q=${encodeURIComponent(query)}`;
        const searchResult = await fetch("https://" + searchUrl)
          .then((res) => res.text())
          .then((html) => new HTMLPage(html, searchUrl));
        const bodyText = htmlToMarkdown(searchResult.getBody());
        emailTextSnippets.push(...extractEmailTextSnippets(bodyText));
        urlTextSnippets.push(...extractUrlTextSnippets(bodyText));
      }
    }

    if (nextClickedUrls.length > 0) {
      for (const url of nextClickedUrls) {
        const clickedPage = await fetch("https://" + url)
          .then((res) => res.text())
          .then((html) => new HTMLPage(html, url));
        const bodyText = htmlToMarkdown(clickedPage.getBody());
        emailTextSnippets.push(...extractEmailTextSnippets(bodyText));
        urlTextSnippets.push(...extractUrlTextSnippets(bodyText));
      }
    }

    if (emailTextSnippets.length > 0) {
      chatContext.push({
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: emailTextSnippets.map((s) => s.context).join("\n"),
      });
    }

    if (urlTextSnippets.length > 0) {
      const urlTextSnippetsContent = urlTextSnippets
        .map((s) => s.context)
        .join("\n");

      if (
        countContextTokens(chatContext) + countTokens(urlTextSnippetsContent) <
        MAX_TOKENS_GPT4
      ) {
        chatContext.push({
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: urlTextSnippetsContent,
        });
      } else {
        const halfUrlTextSnippets = urlTextSnippets.filter(
          (_, i) => i % 2 === 0
        );
        const halfUrlTextSnippetsContent = halfUrlTextSnippets
          .map((s) => s.context)
          .join("\n");
        if (
          countContextTokens(chatContext) +
            countTokens(halfUrlTextSnippetsContent) <
          MAX_TOKENS_GPT4
        ) {
          chatContext.push({
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: halfUrlTextSnippets.map((s) => s.context).join("\n"),
          });
        }
      }
    }

    if (countContextTokens(chatContext) > MAX_TOKENS_GPT4) {
      // tried reducing urls, but still too long
      // as of now: fail
      break;
    }
  }

  return {
    candidates,
    googleSearches,
    clickedUrls,
    finalContext: chatContext,
    totalConsumedTokens,
  };
}

export default async function FindEmail(
  req: NextApiRequest,
  res: NextApiResponse<FindEmailResponse>
) {
  const {
    login: username,
    blog: websiteFromGithub,
    twitter_username: twitterHandle,
    bio,
    readme,
  } = req.body as GithubUserWithReadme;

  if (!username) {
    throw new Error("No username provided.");
  }

  const initialContext: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: emailFinder(),
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: "GitHub username: " + username,
    },
  ];

  const websitesFromTwitter = await fetchTwitterAccountWebsites(twitterHandle);

  let definitiveWebsites = websitesFromTwitter;

  if (websiteFromGithub) {
    definitiveWebsites.push(websiteFromGithub);
  }

  definitiveWebsites = definitiveWebsites
    .filter((website) => website)
    .map((website) => website.replace(/https?:\/\//, ""));

  const uniqueDefinitiveWebsites = [...new Set(definitiveWebsites)];

  if (uniqueDefinitiveWebsites.length === 0) {
    const bioText = markdownToText(bio);
    const readmeText = markdownToText(readme);

    const emailTextSnippets = extractEmailTextSnippets(
      `${bioText}\n\n${readmeText}`
    );
    const urlTextSnippets = extractUrlTextSnippets(
      `${bioText}\n\n${readmeText}`
    );

    if (emailTextSnippets.length + urlTextSnippets.length === 0) {
      res.status(200).json({
        candidates: [],
        googleSearches: [],
        clickedUrls: [],
        finalContext: initialContext,
        totalConsumedTokens: 0,
      });
      return;
    }

    initialContext.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `github.com/${username}`,
    });

    initialContext.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `${urlTextSnippets
        .map((s) => s.context)
        .join("\n\n")}\n\n${emailTextSnippets
        .map((s) => s.context)
        .join("\n\n")}`,
    });

    const result = await searchEmailOnline(initialContext);

    res.status(200).json(result);
    return;
  }

  const fetchedWebsites = await Promise.all(
    uniqueDefinitiveWebsites.map((url) =>
      fetch("https://" + url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0",
        },
      })
        .then((res) => res.text())
        .then((html) => new HTMLPage(html, url))
    )
  );

  const websitesText = fetchedWebsites
    .map((fetchedWebsite) => {
      let title = fetchedWebsite.getTitle();
      if (title.length > 100) {
        title = title.substring(0, 100) + "...";
      }

      let description = fetchedWebsite.getDescription();
      if (description.length > 250) {
        description = description.substring(0, 100) + "...";
      }

      const bodyText = htmlToMarkdown(fetchedWebsite.getBody());
      const emailTextSnippets = extractEmailTextSnippets(bodyText);
      const urlTextSnippets = extractUrlTextSnippets(bodyText);

      if (emailTextSnippets.length + urlTextSnippets.length === 0) {
        return "";
      }

      return `${title}\n${description}\n\n${[
        ...emailTextSnippets.map((snippet) => snippet.context),
        ...urlTextSnippets.map((snippet) => snippet.context),
      ].join("\n\n")}`;
    })
    .filter((websiteText) => websiteText);

  if (websitesText.length === 0) {
    res.status(200).json({
      candidates: [],
      finalContext: initialContext,
      googleSearches: [],
      clickedUrls: [],
      totalConsumedTokens: 0,
    });
    return;
  }

  websitesText.forEach((websiteText, index) => {
    const website = uniqueDefinitiveWebsites[index];
    if (website) {
      initialContext.push({
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: website,
      });
    }

    initialContext.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: websiteText,
    });
  });

  const result = await searchEmailOnline(initialContext);

  res.status(200).json(result);
}
