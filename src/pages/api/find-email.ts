import type { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
} from "openai";
import { fetchTwitterAccountWebsite } from "~/server/utils/twitter";
import { emailFinder } from "~/server/gpt/system";
import {
  extractEmailTextSnippets,
  extractUrlTextSnippets,
  htmlToMarkdown,
  markdownToText,
} from "~/server/utils/text";
import { completeChat } from "~/server/gpt";
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

type FindEmailResponse = {
  candidates: FoundEmail[];
  finalContext: ChatCompletionRequestMessage[];
  googleSearches: string[];
  clickedUrls: string[];
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
    return input.substring(6);
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
  initialContext: ChatCompletionRequestMessage[]
): Promise<FindEmailResponse> {
  const candidates: FoundEmail[] = [];
  const googleSearches: string[] = [];
  const clickedUrls: string[] = [];
  const maxTries = 10;
  let tries = 0;
  let context = initialContext;

  while (
    candidates.filter((c) => c.confidence > 0.5).length === 0 &&
    tries < maxTries
  ) {
    tries++;

    const { response, newContext } = await completeChat(context, 100, 0.3);
    context = newContext;

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

    if (nextGoogleSearches.length === 0 && nextClickedUrls.length === 0) {
      break;
    }

    const emailTextSnippets: string[] = [];
    const urlTextSnippets: string[] = [];

    if (nextGoogleSearches.length > 0) {
      for (const query of nextGoogleSearches) {
        const searchResult = await fetch(
          `https://google.com/search?q=${encodeURIComponent(query)}`
        )
          .then((res) => res.text())
          .then((html) => new HTMLPage(html));
        const bodyText = markdownToText(htmlToMarkdown(searchResult.getBody()));
        emailTextSnippets.push(...extractEmailTextSnippets(bodyText));
        urlTextSnippets.push(...extractUrlTextSnippets(bodyText));
      }
    }

    if (nextClickedUrls.length > 0) {
      for (const url of nextClickedUrls) {
        const clickedPage = await fetch(url)
          .then((res) => res.text())
          .then((html) => new HTMLPage(html));
        const bodyText = markdownToText(htmlToMarkdown(clickedPage.getBody()));
        emailTextSnippets.push(...extractEmailTextSnippets(bodyText));
        urlTextSnippets.push(...extractUrlTextSnippets(bodyText));
      }
    }

    if (emailTextSnippets.length > 0) {
      context.push({
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: emailTextSnippets.join(""),
      });
    }

    if (urlTextSnippets.length > 0) {
      context.push({
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: urlTextSnippets.join(""),
      });
    }
  }

  return {
    candidates,
    googleSearches,
    clickedUrls,
    finalContext: context,
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
      content: username,
    },
  ];

  const websiteFromTwitter = await fetchTwitterAccountWebsite(twitterHandle);

  const definitiveWebsites = [
    websiteFromGithub,
    websiteFromTwitter,
    // ...potentially other websites
  ]
    .map((website) => "https://" + website.replace(/https?:\/\//, ""))
    .filter((website) => website);

  const uniqueDefinitiveWebsites = [...new Set(definitiveWebsites)];

  if (uniqueDefinitiveWebsites.length === 0) {
    const bioText = bio ? markdownToText(bio) : "";
    const readmeText = readme ? markdownToText(readme) : "";

    const otherEmailsFromGithubProfile = extractEmailTextSnippets(
      [bioText, readmeText].join("\n\n")
    );
    const otherWebsitesFromGithubProfile = extractUrlTextSnippets(
      [bioText, readmeText].join("\n\n")
    );

    initialContext.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: otherEmailsFromGithubProfile.join("\n\n"),
    });

    initialContext.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: otherWebsitesFromGithubProfile.join("\n\n"),
    });

    res.status(200).json(await searchEmailOnline(initialContext));
  }

  const websites = await Promise.all(
    uniqueDefinitiveWebsites.map((url) =>
      fetch(url)
        .then((res) => res.text())
        .then((html) => new HTMLPage(html))
    )
  );
  const websitesText = websites.map((website) => {
    let title = website.getTitle();
    if (title.length > 100) {
      title = title.substring(0, 100) + "...";
    }

    let description = website.getDescription();
    if (description.length > 250) {
      description = description.substring(0, 100) + "...";
    }

    const bodyText = markdownToText(htmlToMarkdown(website.getBody()));
    const emailTextSnippets = extractEmailTextSnippets(bodyText);
    const urlTextSnippets = extractUrlTextSnippets(bodyText);

    return `${title}\n${description}\n\n${emailTextSnippets.join(
      "\n\n"
    )}\n\n${urlTextSnippets.join("\n\n")}`;
  });

  if (websitesText.length === 0) {
    res
      .status(200)
      .json({
        candidates: [],
        finalContext: initialContext,
        googleSearches: [],
        clickedUrls: [],
      });
  }

  websitesText.forEach((websiteText) => {
    initialContext.push({
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: websiteText,
    });
  });

  res.status(200).json(await searchEmailOnline(initialContext));
}
