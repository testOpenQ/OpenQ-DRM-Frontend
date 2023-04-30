import { UserModel } from "~/db";
import { GithubGraphQLUser } from "../types";

export function mapGraphQLUserToModel(user: GithubGraphQLUser): UserModel {
  return {
    login: user.login,
    githubRestId: user.databaseId,
    githubGraphqlId: user.id,
    avatarUrl: user.avatarUrl,
    name: user.name,
    company: user.company,
    isHireable: user.isHireable,
    website: user.websiteUrl,
    location: user.location,
    email: user.email,
    bio: user.bio,
    twitterUsername: user.twitterUsername,
    followersCount: user.followers.totalCount,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
