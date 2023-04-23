import type { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { rateLimit, pageInfo } from "~/lib/githubData/queryFragments";

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
          first: 25
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
