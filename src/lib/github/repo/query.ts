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
                  login
                  email
                  avatarUrl
                  bio
                  websiteUrl
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
  email: string;
  user: {
    id: string;
    login: string;
    email: string;
    avatarUrl: string;
    bio: string;
    websiteUrl: string;
  };
};

export type RepoQueryResponseData = {
  defaultBranchRef: {
    name: string;
    target: {
      history: {
        totalCount: number;
        nodes: {
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
