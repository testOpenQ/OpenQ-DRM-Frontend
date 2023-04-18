import Twitter from "twitter-lite";

const twitter = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY as string,
  consumer_secret: process.env.TWITTER_API_SECRET as string,
  bearer_token: process.env.TWITTER_API_BEARER_TOKEN as string,
});

export async function fetchTwitterAccountWebsites(
  screen_name: string | undefined
): Promise<string[]> {
  if (!screen_name) return [];

  const websites: string[] = [];

  try {
    const user = await twitter.get("users/show", { screen_name });

    if (user.entities?.url?.urls.length > 0) {
      websites.push(
        ...user.entities.url.urls.map(
          (url: { expanded_url: string }) => url.expanded_url
        )
      );
    }

    return websites;
  } catch (error) {
    console.error("Error fetching website from twitter:", error);
    return [];
  }
}
