import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { normalize } from "~/lib/numbers";
import { rateLimit, pageInfo } from "~/lib/githubScanner/queryFragments";

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
