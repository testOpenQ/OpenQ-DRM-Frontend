import type { UserQueryResponseData } from "./query";

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

export function evaluateUserData(
  userData: UserQueryResponseData
): UserEvaluation {
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
