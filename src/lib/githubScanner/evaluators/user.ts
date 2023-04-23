import type { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { rateLimit, pageInfo } from "~/lib/githubScanner/queryFragments";

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

export type UserData = {
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

export type UserEvaluation = {
  forkCount: number;
  stargazerCount: number;
  followersForkCount: number;
  followersStargazerCount: number;
  followersFollowerCount: number;
  mergedPullRequestCount: number;
  mergedPullRequestCount30d: number;
  mergedPullRequestCount365d: number;
};

export function evaluateUserData(userData: UserData): UserEvaluation {
  const {
    followers: { nodes: followers },
    repositories: { nodes: repositories },
    pullRequests: { nodes: pullRequests },
  } = userData;

  const forkCount = repositories.reduce((acc, repo) => acc + repo.forkCount, 0);
  const stargazerCount = repositories.reduce(
    (acc, repo) => acc + repo.stargazerCount,
    0
  );

  const followersForkCount = followers.reduce(
    (acc, follower) =>
      acc +
      follower.repositories.nodes.reduce(
        (acc, repo) => acc + repo.forkCount,
        0
      ),
    0
  );

  const followersStargazerCount = followers.reduce(
    (acc, follower) =>
      acc +
      follower.repositories.nodes.reduce(
        (acc, repo) => acc + repo.stargazerCount,
        0
      ),
    0
  );

  const followersFollowerCount = followers.reduce(
    (acc, follower) => acc + follower.followers.totalCount,
    0
  );

  const eligablePullRequests = pullRequests
    .filter((pr) => pr.merged && !!pr.repository)
    .filter(
      (pr) => !!pr.repository && pr.repository?.owner.login !== userData.login
    );

  const mergedPullRequestCount = eligablePullRequests.reduce(
    (acc, pr) => (pr.merged ? acc + 1 : acc),
    0
  );

  const mergedPullRequestCount30d = eligablePullRequests.reduce((acc, pr) => {
    const mergedAt = new Date(pr.mergedAt);
    const now = new Date();
    const diff = now.getTime() - mergedAt.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return pr.merged && diffDays <= 30 ? acc + 1 : acc;
  }, 0);

  const mergedPullRequestCount365d = eligablePullRequests.reduce((acc, pr) => {
    const mergedAt = new Date(pr.mergedAt);
    const now = new Date();
    const diff = now.getTime() - mergedAt.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    return pr.merged && diffDays <= 365 ? acc + 1 : acc;
  }, 0);

  return {
    forkCount,
    stargazerCount,
    followersForkCount,
    followersStargazerCount,
    followersFollowerCount,
    mergedPullRequestCount,
    mergedPullRequestCount30d,
    mergedPullRequestCount365d,
  };
}
