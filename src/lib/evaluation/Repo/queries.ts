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

export type RepoQueryResponseDataCommitAuthor = {
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
          author: RepoQueryResponseDataCommitAuthor;
        }[];
      };
    };
  };
};

export const USER_QUERY: DocumentNode = gql`query (
  $login: String!,
  $firstFollowers: Int!,
  $afterFollower: String,
  $firstRepos: Int!,
  $afterRepo: String,
  $firstPrs: Int!,
  $afterPr: String
) {
  ${rateLimit}
  user (login: $login) {
    id
    login
    createdAt
    followers (first: $firstFollowers, after: $afterFollower) {
      ${pageInfo}
      nodes {
        id
        repositories (
          first: 5
          isFork: false
          orderBy: { field: STARGAZERS, direction: DESC }
        ) {
          nodes {
            id
            stargazerCount
            forkCount
          }
        }
        followers {
          totalCount
        }
      }
    }
    repositories (
      first: $firstRepos
      after: $afterRepo
      isFork: false
      orderBy: { field: STARGAZERS, direction: DESC }
    ) {
      ${pageInfo}
      nodes {
        id
        name
        stargazerCount
        forkCount
      }
    }
    pullRequests (
      first: $firstPrs
      after: $afterPr
      states: [MERGED]
      orderBy: { field: CREATED_AT, direction: DESC }
    ) {
      ${pageInfo}
      nodes {
        id
        merged
        mergedAt
        repository {
          owner {
            login
          }
          stargazerCount
          forkCount
        }
      }
    }
  }
}`;

export type UserQueryResponseData = {
  id: string;
  login: string;
  createdAt: string;
  followers: {
    totalCount: number;
    nodes: {
      id: string;
      repositories: {
        nodes: {
          stargazerCount: number;
          forkCount: number;
        }[];
      };
      followers: {
        totalCount: number;
      };
    }[];
  };
  repositories: {
    nodes: {
      id: string;
      stargazerCount: number;
      forkCount: number;
    }[];
  };
  pullRequests: {
    totalCount: number;
    nodes: {
      id: string;
      merged: boolean;
      mergedAt: string;
      repository: {
        owner: {
          login: string;
        };
        stargazerCount: number;
        forkCount: number;
      } | null;
    }[];
  };
};
