# OpenQ DRM

Install and run:

```bash
git clone https://github.com/OpenQDev/OpenQ-DRM-Frontend && cd OpenQ-DRM-Frontend && cp .env.sample .env && yarn && yarn dev
```

The app is running now but you still need to fill in the blanks in the `.env` file.

## T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`. To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

## GitHub Data Scanner

Fetching larger amounts of data from the GitHub API is handled by the [@mktcodelib/github-scanner package](https://npmjs.com/package/@mktcodelib/github-scanner). The term "Scan" just means: A GraphQL query with one ore more paginated properties, where all data / all pages are automatically fetched and progress can be tracked.

It uses [@mktcodelib/graphql-fetch-all](https://npmjs.com/package/@mktcodelib/graphql-fetch-all) and adds [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) storage and [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) on top of it.
From IndexedDB results can then be evaluated and presented in the UI.

After instantiating the scanner for the first time, you'll find [a database named `@mktcodelib/github-scanner-<version>` with a single table called `scans`](https://github.com/mktcode/lib/blob/master/packages/github-scanner/src/db.ts).

## Data Evaluations

The stored "raw" data is then run through functions that extract the essence of interest from it.

### User

### Repo

## GPT Evaluations

### Repo/User Commits

### Issues / Discussions

## TODO

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

# Email Address Finder

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
