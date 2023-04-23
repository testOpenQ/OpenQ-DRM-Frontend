# OpenQ DRM

Install and run:

```bash
git clone https://github.com/OpenQDev/OpenQ-DRM-Frontend && cd OpenQ-DRM-Frontend && cp .env.sample .env && yarn && yarn dev
```

The app should be running now but you still need to fill in the blanks in the `.env` file.

```bash
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

OPENAI_API_KEY="sk-..."

TWITTER_API_KEY="..."
TWITTER_API_SECRET="..."
TWITTER_API_BEARER_TOKEN="..."
```

A GitHub OAuth app is required. OpenAI and Twitter credentials are used for the experimental GPT-based features.

## T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`. To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

## GitHub Data Scanner

Fetching larger amounts of data from the GitHub API is handled by the [@mktcodelib/github-scanner package](https://npmjs.com/package/@mktcodelib/github-scanner). The term "Scan" just means: A GraphQL query with one ore more paginated properties, where all data / all pages are automatically fetched and progress can be observed.

It uses [@mktcodelib/graphql-fetch-all](https://npmjs.com/package/@mktcodelib/graphql-fetch-all) and adds [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) storage and [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) on top of it.
From IndexedDB results can then be evaluated and presented in the UI.

After instantiating the scanner for the first time, you'll find [a database named `@mktcodelib/github-scanner-<version>` with a single table called `scans`](https://github.com/mktcode/lib/blob/master/packages/github-scanner/src/db.ts).

## Data Evaluations

The stored "raw" data is then digested by functions that extract the desired essence from it.

Find the related utilities in `src/lib/githubData`.

Charts in the UI are handled by [Chart.js](https://www.chartjs.org/).

## Database (IndexedDB)

In addition to the database that contains the scans and is provided by the GitHub Scanner package, the DRM uses another, local database for managing other app data, like campaigns, repositories and users.

```ts
import { db, scansDb } from "~/db";

// get all campaigns
const campaigns = await db.campaigns.toArray();

// get all scans
const scans = await scansDb.scans.toArray();
```

## Other OpenQ Services

Currently the DRM is completely independent from the other OpenQ services.
Authentication via OpenQ account or providing additional data (like email addresses) is yet to be implemented.

## ChatGPT

⚠️ **EXPERIMENTAL** ⚠️

You'll need an [OpenAI API key](https://platform.openai.com/account/api-keys) to use the GPT features.

```bash
OPENAI_API_KEY="sk-..."
```

### Chat Completions

`/api/chat-completion` is a [ChatGPT](https://platform.openai.com/docs/guides/chat) endpoint that can be used to complete a given chat context.

```ts
import { completeChat } from "~/server/gpt";

const context: ChatCompletionRequestMessage[] = [
  {
    role: "system",
    content:
      "You are OpenQ-GPT: You know everything about OpenQ and currently ongoing hackathons.\n\nOpenQ is...\n\nHackathons: ...",
  },
  {
    role: "user",
    content: "I have problems claiming my hackathon prize.",
  },
  {
    role: "assistant",
    content:
      "Don't worry, we'll figure it out. What hackathon did you participate in?",
  },
  {
    role: "user",
    content: "ETH Denver, 2023",
  },
];

await completeChat(context);
```

The maximum response length is 64 tokens (aprrox. 80 words) by default.

You can use the [ChatGPT Tokenizer](https://platform.openai.com/tokenizer) to get a sense of how many tokens are in a given text.

The temperature is set to 0 by default, meaning that the responses are deterministic. Same input in, same output out. A temperature of 1 means unpredictable but more "creative" responses.

```ts
// increase response length and let it be "semi-creative"
await completeChat(context, 256, 0.5);
```

### Repo/User Commit Summary

This is an excellent use case for this technology. If you have an OpenAI API key configured in your `.env` file, you can use the `/api/commit-summary` endpoint to get a summary of a given GitHub repository or user. You can try this in the repository card UI.

### Issues / Discussions

Another handy feature could be to know, with the press of a button, what's going on in a repository's issues and discussions. GPT could be instructed to "write a report to get a sense of the community and the project's health", if provided with the relevant contents. You could of course include the commit summary in the report, too.

All in all lots of potential for generating high quality texts based on carefully tailored data, to get valuable insights into a project in a matter of momments.

## TODO

(random notes from here on)

- Import (text/csv) 2d
- Score calculation 2d
- Email client 5d
- Stripe 3d
  - For what purpose? On-demand, like ETH? Or fixed amount for a fixed quota?
- GPT prompt improvement 3d
  - Email research
  - Commit analysis
- GitHub fetching solidity / move to service worker 2d
- Overall UI 3d

**next:**

Pay Button -> Get email button -> send E-Mail button
-> UI for that
-> codemocks for that

Stripe Payment

- Demo payment integration
- On settings page, just continuing this demo flow
- No purpose yet

Tab in repo card for devs' emails

- fetch unknown via ai (fetch all button)
- Checkboxes
- note from AI
- choose/edit template
- send button

### Email Address Finder

- first "manual"/script-based search

  - look for email in public github profile data via API
  - if found: Yes! The user is kind to us.
  - if not:
    - look for website (blog) and twitter in github profile via API
    - fetch user's profile repo REDME and bio
    - if twitter:
      - look for website via twitter API
      - fetch recent tweets (no retweets)
    - collect all email addresses and URLs found in these contents (regex)

- add obscured email patterns (name {at} domain.com)
- before even GPT: Look for org email

Currently GPT is not aware of the domains of the initial contents passed to it.
If it discovers one of these urls when browsing, it will lead to passing it the same initial content.
The content snippets needs the url.
