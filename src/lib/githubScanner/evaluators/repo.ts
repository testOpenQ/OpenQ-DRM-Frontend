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

export type RepoData = {
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

export type RepoEvaluation = {
  commitCount: number;
  linesChanged: number;
  commitsByDay: Record<string, { commitCount: number; linesChanged: number }>;
  commitsByDayNormalized: { commitCount: number[]; linesChanged: number[] };
  commitsByAuthor: Record<
    string,
    { commitCount: number; linesChanged: number }
  >;
  authors: CommitAuthor[];
};

export type CommitsByDay = Record<
  string,
  { commitCount: number; linesChanged: number }
>;

function normalizeNumbers(numbers: number[]): number[] {
  const max = Math.max(...numbers);
  return numbers.map((num) => num / max);
}

export function evaluateRepoData(repoData: RepoData): RepoEvaluation {
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
      commitCount: normalizeNumbers(
        Object.values(commitsByDay).map(({ commitCount }) => commitCount)
      ),
      linesChanged: normalizeNumbers(
        Object.values(commitsByDay).map(({ linesChanged }) => linesChanged)
      ),
    },
    commitsByAuthor,
    authors,
  };
}
