import { Scanner } from "@mktcodelib/github-scanner";
import { USER_QUERY, UserQueryResponseData } from "./query";
import { Evaluation, addEvaluation, db, updateEvaluation } from "~/db";

export type UserEvaluationResult = {
  forkCount: number;
  stargazerCount: number;
  followersForkCount: number;
  followersStargazerCount: number;
  followersFollowerCount: number;
  mergedPullRequestCount: number;
  mergedPullRequestCount30d: number;
  mergedPullRequestCount365d: number;
};

export type UserEvaluation = Evaluation & {
  type: "user";
  result?: UserEvaluationResult;
};

export function evaluateUserData(
  userData: UserQueryResponseData
): UserEvaluationResult {
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

export async function evaluateUser(
  id: number,
  accessToken: string,
  since: string,
  until: string
) {
  const user = await db.users.get(id);

  if (!user) {
    throw new Error(`User ${id} not found in database`);
  }

  const evaluationId = await addEvaluation({
    type: "user",
    targetId: id,
    done: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const scanner = new Scanner({ accessToken });
  const variables = { login: user.login };

  const { scanId } = await scanner.scan<{ user: UserQueryResponseData }>({
    query: USER_QUERY,
    variables,
    update: ({ data }) => {
      updateEvaluation(evaluationId, { result: evaluateUserData(data.user) });
    },
    done: (_) => {
      updateEvaluation(evaluationId, { done: 1 });
    },
  });

  updateEvaluation(evaluationId, { dataIds: { userData: scanId } });

  return evaluationId;
}
