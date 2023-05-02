import type { RepoContributorEvaluationResult } from "~/lib/evaluation/Repo/RepoContributorEvaluator";
import type { RepoEvaluationResult } from "~/lib/evaluation/Repo/RepoEvaluator";

export interface CampaignModel {
  id?: number;
  name: string;
  orgIds: number[];
  repoIds: number[];
  userIds: number[];
}

export interface Campaign extends CampaignModel {
  id: number;
}

export interface CommitSummaryModel {
  id?: number;
  repoId?: number;
  userId?: number;
  since?: string;
  until?: string;
  summary: string;
}

export interface CommitSummary extends CommitSummaryModel {
  id: number;
}

export interface OrgModel {
  id?: number;
  login: string;
  githubRestId: number;
  githubGraphqlId: string;
  avatarUrl: string;
  name: string;
  company: string;
  website: string;
  location: string;
  email: string;
  bio: string;
  twitterUsername: string;
  followers: number;
  createdAt: string;
  updatedAt: string;
}

export interface Org extends OrgModel {
  id: number;
}

export interface UserModel {
  id?: number;
  githubRestId: number;
  githubGraphqlId: string;
  login: string;
  name: string;
  avatarUrl: string;
  company: string;
  website: string;
  location: string;
  email: string;
  isHireable: boolean;
  bio: string;
  twitterUsername: string;
  followersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User extends UserModel {
  id: number;
}

export interface RepoModel {
  id?: number;
  githubRestId: number;
  githubGraphqlid: string;
  name: string;
  fullName: string;
  private: boolean;
  ownerLogin: string;
  ownerAvatarUrl: string;
  description: string;
  fork: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  homepage: string;
  size: number;
  stargazersCount: number;
  watchersCount: number;
  language: string;
  hasIssues: boolean;
  hasProjects: boolean;
  hasDiscussions: boolean;
  forksCount: number;
  archived: boolean;
  disabled: boolean;
  openIssuesCount: number;
  license: string;
  topics: string[];
  visibility: string;
  defaultBranch: string;
  subscribersCount: number;
}

export interface Repo extends RepoModel {
  id: number;
}

export interface EvaluationModel {
  id?: number;
  type: "repo" | "repo-contributor";
  targetId: number;
  params?: { [key: string]: any };
  data?: { [key: string]: any };
  result?: { [key: string]: any };
  children?: number[];
  done: 1 | 0;
  createdAt: string;
  updatedAt: string;
}

export interface Evaluation extends EvaluationModel {
  id: number;
}

export interface RepoEvaluation extends Evaluation {
  type: "repo";
  result?: RepoEvaluationResult;
}

export interface RepoContributorEvaluation extends Evaluation {
  type: "repo-contributor";
  result?: RepoContributorEvaluationResult;
}
