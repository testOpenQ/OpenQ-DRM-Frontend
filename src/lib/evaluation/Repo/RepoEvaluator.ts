import { Scanner } from "@mktcodelib/github-scanner";
import {
  addEvaluation,
  addUser,
  getUserByLogin,
  updateEvaluation,
  getEvaluation,
} from "~/store";
import type { Repo, User } from "~/store/model";
import { Evaluator } from "../Evaluator";
import {
  REPO_QUERY,
  type RepoQueryResponseData,
  type RepoQueryResponseDataCommitAuthor,
} from "./queries";
import { normalize } from "../../numbers";
import { mapGraphQLUserToModel } from "~/lib/github/graphql";
import { RepoContributorEvaluator } from "./RepoContributorEvaluator";

export type RepoEvaluationParams = {
  since: string;
  until: string;
};

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

export type RepoQueryResponseDataCommit =
  RepoQueryResponseData["defaultBranchRef"]["target"]["history"]["nodes"][0];

export type RepoEvaluationResult = {
  commitCount: number;
  linesChanged: number;
  commits: RepoQueryResponseDataCommit[];
  commitsByDay: CommitsByDay;
  commitsByDayNormalized: CommitsByDayNormalized;
  commitsTrend: number;
  commitsByAuthor: CommitsByAuthor;
  authors: RepoQueryResponseDataCommitAuthor[];
};

const NUMBER_OF_CONTRIBUTORS = 10;

export class RepoEvaluator extends Evaluator<Repo> {
  constructor(repo: Repo, accessToken: string) {
    super(repo, accessToken);
  }

  async evaluate(params: RepoEvaluationParams) {
    const evaluationId = await addEvaluation({
      type: "repo",
      targetId: this.target.id,
    });

    const scanner = new Scanner({ accessToken: this.accessToken });

    const variables = {
      owner: this.target.ownerLogin,
      name: this.target.name,
      since: params.since,
      until: params.until,
      first: 100,
    };

    const childEvaluationIds: number[] = [];
    const evaluatedAuthors: string[] = [];

    await scanner.scan<{ repository: RepoQueryResponseData }>({
      query: REPO_QUERY,
      variables,
      update: async ({ data }) => {
        const result = this.digestRepoData(data.repository);

        for (const author of result.authors) {
          if (
            evaluatedAuthors.includes(author.user.login) ||
            evaluatedAuthors.length === NUMBER_OF_CONTRIBUTORS
          )
            continue;

          evaluatedAuthors.push(author.user.login);

          let user: User;

          const existingUser = await getUserByLogin(author.user.login);

          if (existingUser) {
            user = existingUser;
          } else {
            const userModel = mapGraphQLUserToModel(author.user);
            const userId = await addUser(userModel);
            user = { id: userId, ...userModel };
          }

          const childEvaluationTarget = new RepoContributorEvaluator(
            user,
            this.accessToken
          );
          const childEvaluationId = await childEvaluationTarget.evaluate();

          childEvaluationIds.push(childEvaluationId);
        }

        await updateEvaluation(evaluationId, {
          result,
          children: childEvaluationIds,
        });
      },
      done: () => {
        const watchChildren = setInterval(() => {
          Promise.all(childEvaluationIds.map((id) => getEvaluation(id)))
            .then((childEvaluations) => {
              const allDone = childEvaluations.every(
                (evaluation) => !evaluation || evaluation.done
              );

              if (allDone) {
                updateEvaluation(evaluationId, { done: 1 })
                  .then(() => {
                    clearInterval(watchChildren);
                  })
                  .catch(console.error);
              }
            })
            .catch(console.error);
        }, 3000);
      },
    });

    return evaluationId;
  }

  digestRepoData(repoData: RepoQueryResponseData): RepoEvaluationResult {
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

    const commitsTrend = this.calculateTrend(
      commitsByDayNormalized.commitCount
    );

    const authors = commits.reduce((acc, commit) => {
      if (!commit.author?.user?.login) {
        return acc;
      }

      if (acc.some((a) => a.user.id === commit.author.user.id)) return acc;

      acc.push(commit.author);

      return acc;
    }, [] as RepoQueryResponseDataCommitAuthor[]);

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
      commits,
      commitsByDay,
      commitsByDayNormalized,
      commitsTrend,
      commitsByAuthor,
      authors,
    };
  }

  calculateTrend(normalizedNumbers: number[]) {
    const diffs = normalizedNumbers
      .slice(1)
      .map((value, index, array) => value - (array[index - 1] ?? 0));
    const sum = diffs.reduce((acc, curr) => acc + curr, 0);
    const trend = sum / diffs.length;

    const maxDiff = Math.max(...diffs) - Math.min(...diffs);
    const normalizedTrend = maxDiff === 0 ? 0 : trend / maxDiff;

    return normalizedTrend;
  }
}
