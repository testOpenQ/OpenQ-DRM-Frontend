# OpenQ DRM

Install and run:

```bash
git clone https://github.com/OpenQDev/OpenQ-DRM-Frontend && cd OpenQ-DRM-Frontend
```

```bash
cp .env.sample .env && yarn && yarn dev
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

One motivation so far was to leverage the client (and the user's GitHub access token) as much as possible, before introducing any heavy backend components. As a result, two packages were created to handle the more demanding GitHub API queries smoothly.

The term "Scan" in the [@mktcodelib/github-scanner package](https://npmjs.com/package/@mktcodelib/github-scanner) refers to a GraphQL query with one or more paginated properties, where all data / all pages are automatically fetched and the progress can be observed.

It uses [@mktcodelib/graphql-fetch-all](https://npmjs.com/package/@mktcodelib/graphql-fetch-all) to handle paginated queries and adds [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for storage and [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers), ensuring a good UX, on top of it.
From IndexedDB results can be evaluated and presented in the UI.

After running the app for the first time, you'll find [a database named `@mktcodelib/github-scanner-<version>` with a single table called `scans`](https://github.com/mktcode/lib/blob/master/packages/github-scanner/src/db.ts).

## Data Evaluations

The stored "raw" data is then digested by functions that extract the desired essence from it.

Find the related utilities in `src/lib/evaluation`.

Charts in the UI are handled by [Chart.js](https://www.chartjs.org/).

## Database (IndexedDB)

In addition to the database that contains the scans and is provided by the GitHub Scanner package, the DRM uses another, local database for managing other app data, like campaigns, repositories and users.

```ts
import { store, scansDb } from "~/store";

// get all campaigns
const campaigns = await store.campaigns.toArray();

// get all scans
const scans = await scansDb.scans.toArray();
```

In both cases [Dexie.js](https://dexie.org/) is used as an abstraction layer around IndexedDB. Get yourself familiar with it, if you want to work with the DRM's local databases directly. Common helpers are/should be provided by the `db` exports.

```ts
import { getCampaigns } from "~/db";

const liveCampaigns = useLiveQuery(getCampaigns);
```

See: [Live Queries](<https://dexie.org/docs/dexie-react-hooks/useLiveQuery()>)

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

### Email Finder

The `/api/find-email` endpoint is an AutoGPT-like experiment, letting it browse the web on its own to find email addresses for a given GitHub user.
You provide it with scraped website data and it replies with commands like:

```
url:https://google.com?q=Christopher Stevers Email
email:christopher.stevers1@gmail.com | High | Email for job opportunities
```

⚠️ This can get very expensive when using GPT-4. Preparing and reducing information before feeding it to a GPT is key to keeping costs low.
Although there might be some hidden use cases that justify any cost.

## TODO

- Email functionality
- Import (text/csv)
- OpenQ account integration
- Payments (What product? Price? Modalities?)
  - Stripe
  - Crypto?
- Overall UI/UX
  - Timeperiod for data (currently hardcoded to 30 days)
  - Scores in repo cards
  - User cards
  - Confirm modals when deleting stuff
  - Better error handling
  - Page transitions / reduce UI flickering
  - Drag & drop cards
  - Smooth GitHub API rate limit handling
  - etc.
