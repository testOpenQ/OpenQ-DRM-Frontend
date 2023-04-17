# OpenQ DRM

## TODO

- Import (text/csv) 2d
- Score calculation 2d
- Email client 5d
- Stripe 3d
  - For what purpose? On-demand, like ETH? Or fixed amount for a fixed quota?
- GPT prompt improvement 3d
  - Email research
  - Commit analysis
- GitHub fetching solidity 2d
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

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
