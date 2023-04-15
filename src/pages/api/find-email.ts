import type { NextApiRequest, NextApiResponse } from "next";
import {
  ChatCompletionRequestMessageRoleEnum,
  type ChatCompletionRequestMessage,
  type ChatCompletionResponseMessage,
} from "openai";
import { gpt, MAX_TOKENS_GPT3_5, countTokens } from "~/server/gpt";

type ValidBody = {
  username: string;
  website: string;
  twitter: string;
};

export default async function FindEmail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, website, twitter } = req.body as ValidBody;

  const data = "website data and latest tweets";

  const messages: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `You discover a GitHub user's email address online. You receive a list of text, email addresses, and URLs from a website. To find the likely email address of the GitHub user, you can either choose from the provided list or browse the web by clicking on links to gather more content, links, and potential email addresses. You have the ability to click on multiple links at once.
Input:
<github user>

or

<content>

Output:
<the email address>

or

<click:url>

or

<click:url>
<click:url>
<click:url>
...`,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: username,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: data,
    },
  ];

  //   try {
  //     const completion = await gpt.createChatCompletion({
  //       model: "gpt-4",
  //       messages,
  //       max_tokens: 50,
  //       temperature: 0.6,
  //     });

  //     const summary = completion.data.choices[0]?.message?.content;

  //     if (!summary) {
  //       throw new Error("An unexpected error occured. No final summary.");
  //     } else {
  //       res.status(200).json({ summary });
  //       return;
  //     }
  //   } catch (error) {
  //     console.error(error);

  //     res
  //       .status(500)
  //       .json({
  //         email: undefined,
  //         reason: "I couldn't find an email address because an unexpected error occured while searching online."
  //       });
  //     return;
  //   }
}
