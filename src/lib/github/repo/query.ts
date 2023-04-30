import type { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { rateLimit, pageInfo } from "~/lib/github/queryFragments";

export const REPO_QUERY: DocumentNode = gql`query (
  $owner: String!,
  $name: String!,
  $since: GitTimestamp!,
  $until: GitTimestamp!,
  $first: Int!,
  $after: String
) {
  ${rateLimit}
  repository(owner: $owner, name: $name) {
    defaultBranchRef {
      name
      target {
        ... on Commit {
          history(since: $since, until: $until, first: $first, after: $after) {
            ${pageInfo}
            nodes {
              message
              additions
              deletions
              changedFilesIfAvailable
              committedDate
              author {
                user {
                  id
                  databaseId
                  login
                  avatarUrl
                  name
                  company
                  isHireable
                  websiteUrl
                  location
                  email
                  bio
                  twitterUsername
                  followers {
                    totalCount
                  }
                  createdAt
                  updatedAt
                }
              }
            }
          }
        }
      }
    }
  }
}`;

export type CommitAuthor = {
  user: {
    id: string;
    databaseId: number;
    login: string;
    name: string;
    email: string;
    avatarUrl: string;
    bio: string;
    websiteUrl: string;
    twitterUsername: string;
    company: string;
    isHireable: boolean;
    location: string;
    followers: {
      totalCount: number;
    };
    createdAt: string;
    updatedAt: string;
  };
};

export type RepoQueryResponseData = {
  defaultBranchRef: {
    name: string;
    target: {
      history: {
        totalCount: number;
        nodes: {
          message: string;
          additions: number;
          deletions: number;
          changedFilesIfAvailable: number;
          committedDate: string;
          author: CommitAuthor;
        }[];
      };
    };
  };
};
