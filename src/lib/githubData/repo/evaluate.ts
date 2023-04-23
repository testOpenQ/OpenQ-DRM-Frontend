import { normalize } from "~/lib/numbers";
import type { CommitAuthor, RepoQueryResponseData } from "./query";

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

export type RepoEvaluation = {
  commitCount: number;
  linesChanged: number;
  commitsByDay: CommitsByDay;
  commitsByDayNormalized: CommitsByDayNormalized;
  commitsByAuthor: CommitsByAuthor;
  authors: CommitAuthor[];
};

export function evaluateRepoData(
  repoData: RepoQueryResponseData
): RepoEvaluation {
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

  const authors = commits.reduce((acc, commit) => {
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
    commitsByDay,
    commitsByDayNormalized: {
      commitCount: normalize(
        Object.values(commitsByDay).map(({ commitCount }) => commitCount)
      ),
      linesChanged: normalize(
        Object.values(commitsByDay).map(({ linesChanged }) => linesChanged)
      ),
    },
    commitsByAuthor,
    authors,
  };
}
