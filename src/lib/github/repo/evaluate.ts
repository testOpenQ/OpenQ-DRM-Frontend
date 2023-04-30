import { normalize } from "~/lib/numbers";
import { CommitAuthor, REPO_QUERY, RepoQueryResponseData } from "./query";
import { Evaluation, addEvaluation, db, updateEvaluation } from "~/db";
import { Scanner } from "@mktcodelib/github-scanner";

export type CommitsByDay = Record<
  string,
  { commitCount: number; linesChanged: number }
>;

export type CommitsByDayNormalized = {
  commitCount: number[];
  linesChanged: number[];
};

export type CommitsByAuthor = Record<
  string,
  { commitCount: number; linesChanged: number }
>;

export type RepoEvaluationResult = {
  commitCount: number;
  linesChanged: number;
  rawCommits: RepoQueryResponseData["defaultBranchRef"]["target"]["history"]["nodes"];
  commitsByDay: CommitsByDay;
  commitsByDayNormalized: CommitsByDayNormalized;
  commitsTrend: number;
  commitsByAuthor: CommitsByAuthor;
  authors: CommitAuthor[];
};

export type RepoEvaluation = Evaluation & {
  type: "repo";
  result?: RepoEvaluationResult;
};

function calculateTrend(normalizedNumbers: number[]) {
  const diffs = normalizedNumbers
    .slice(1)
    .map((value, index) => value - normalizedNumbers[index]!);
  const sum = diffs.reduce((acc, curr) => acc + curr, 0);
  const trend = sum / diffs.length;

  const maxDiff = Math.max(...diffs) - Math.min(...diffs);
  const normalizedTrend = maxDiff === 0 ? 0 : trend / maxDiff;

  return normalizedTrend;
}

export function evaluateRepoData(
  repoData: RepoQueryResponseData
): RepoEvaluationResult {
  const {
    defaultBranchRef: {
      target: {
        history: { nodes: commits },
      },
    },
  } = repoData;

  const commitCount = commits.length;
  const linesChanged = commits.reduce(
    (acc, commit) => acc + commit.additions + commit.deletions,
    0
  );

  const commitsByDay = commits.reduce((acc, commit) => {
    const date = new Date(commit.committedDate)
      .toISOString()
      .split("T")[0] as string;
    const commitCount = acc[date]?.commitCount ?? 0;
    const linesChanged = acc[date]?.linesChanged ?? 0;

    acc[date] = {
      commitCount: commitCount + 1,
      linesChanged: linesChanged + commit.additions + commit.deletions,
    };

    return acc;
  }, {} as Record<string, { commitCount: number; linesChanged: number }>);

  const commitsByDayNormalized = {
    commitCount: normalize(
      Object.values(commitsByDay).map(({ commitCount }) => commitCount)
    ),
    linesChanged: normalize(
      Object.values(commitsByDay).map(({ linesChanged }) => linesChanged)
    ),
  };

  const commitsTrend = calculateTrend(commitsByDayNormalized.commitCount);

  const authors = commits.reduce((acc, commit) => {
    if (!commit.author?.user?.login) {
      return acc;
    }

    if (acc.some((a) => a.user.id === commit.author.user.id)) return acc;

    acc.push(commit.author);

    return acc;
  }, [] as CommitAuthor[]);

  const commitsByAuthor = commits.reduce((acc, commit) => {
    if (!commit.author?.user?.login) return acc;

    const author = commit.author.user.login;
    const commitCount = acc[author]?.commitCount ?? 0;
    const linesChanged = acc[author]?.linesChanged ?? 0;

    acc[author] = {
      commitCount: commitCount + 1,
      linesChanged: linesChanged + commit.additions + commit.deletions,
    };

    return acc;
  }, {} as Record<string, { commitCount: number; linesChanged: number }>);

  return {
    commitCount,
    linesChanged,
    rawCommits: commits,
    commitsByDay,
    commitsByDayNormalized: {
      commitCount: normalize(
        Object.values(commitsByDay).map(({ commitCount }) => commitCount)
      ),
      linesChanged: normalize(
        Object.values(commitsByDay).map(({ linesChanged }) => linesChanged)
      ),
    },
    commitsTrend,
    commitsByAuthor,
    authors,
  };
}

export async function evaluateRepo(
  id: number,
  accessToken: string,
  since: string,
  until: string
) {
  const repo = await db.repos.get(id);

  if (!repo) {
    throw new Error(`Repo ${id} not found in database`);
  }

  const evaluationId = await addEvaluation({
    type: "repo",
    targetId: id,
    done: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const scanner = new Scanner({ accessToken });
  const variables = {
    owner: repo.ownerLogin,
    name: repo.name,
    since,
    until,
    first: 100,
  };

  const { scanId } = await scanner.scan<{ repository: RepoQueryResponseData }>({
    query: REPO_QUERY,
    variables,
    update: ({ data }) => {
      updateEvaluation(evaluationId, {
        result: evaluateRepoData(data.repository),
      });
    },
    done: (_) => {
      updateEvaluation(evaluationId, { done: 1 });
    },
  });

  updateEvaluation(evaluationId, { dataIds: { userData: scanId } });

  return evaluationId;
}
