import Twitter from "twitter-lite";

const twitter = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY as string,
  consumer_secret: process.env.TWITTER_API_SECRET as string,
  bearer_token: process.env.TWITTER_API_BEARER_TOKEN as string,
});

export async function fetchTwitterAccountWebsite(
  screen_name: string | undefined
) {
  if (!screen_name) {
    return null;
  }

  try {
    const user = await twitter.get("users/show", { screen_name });
    return user.entities.url.urls[0].expanded_url;
  } catch (error) {
    console.error("Error fetching website:", error);
    return null;
  }
}
