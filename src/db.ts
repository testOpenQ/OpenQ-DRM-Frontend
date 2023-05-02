import {
  db as scansDb,
  hashQuery,
  type Scan,
  type QueryVariables,
} from "@mktcodelib/github-scanner";
import Dexie, { type Table } from "dexie";
import { type DocumentNode } from "graphql";
import {
  REPO_QUERY,
  USER_QUERY,
  type UserQueryResponseData,
  type RepoQueryResponseData,
} from "./lib/evaluation/Repo/queries";
import type { RepoEvaluationResult } from "./lib/evaluation/Repo/RepoEvaluator";
import type { RepoContributorEvaluationResult } from "./lib/evaluation/Repo/RepoContributorEvaluator";

interface CampaignModel {
  id?: number;
  name: string;
  orgIds: number[];
  repoIds: number[];
  userIds: number[];
}

interface Campaign extends CampaignModel {
  id: number;
}

interface CommitSummaryModel {
  id?: number;
  repoId?: number;
  userId?: number;
  since?: string;
  until?: string;
  summary: string;
}

interface CommitSummary extends CommitSummaryModel {
  id: number;
}

interface OrgModel {
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

interface Org extends OrgModel {
  id: number;
}

interface UserModel {
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

interface User extends UserModel {
  id: number;
}

interface RepoModel {
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

interface Repo extends RepoModel {
  id: number;
}

interface EvaluationModel {
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

interface Evaluation extends EvaluationModel {
  id: number;
}

interface RepoEvaluation extends Evaluation {
  type: "repo";
  result?: RepoEvaluationResult;
}

interface RepoContributorEvaluation extends Evaluation {
  type: "repo-contributor";
  result?: RepoContributorEvaluationResult;
}

class Db extends Dexie {
  campaigns!: Table<CampaignModel, number>;
  orgs!: Table<OrgModel, number>;
  repos!: Table<RepoModel, number>;
  users!: Table<UserModel, number>;
  commitSummaries!: Table<CommitSummaryModel, number>;
  evaluations!: Table<EvaluationModel, number>;

  constructor() {
    super(`openq-drm`);
    this.version(1).stores({
      campaigns: `++id, name`,
      orgs: `++id, login, githubRestId, githubGraphqlId`,
      repos: `++id, fullName, githubRestId, githubGraphqlId`,
      users: `++id, login, githubRestId, githubGraphqlId`,
      commitSummaries: `++id, repoId, userId`,
      evaluations: `++id, type, targetId, [type+targetId], done`,
    });
  }
}

const db = new Db();

function getCampaigns() {
  return db.campaigns.toArray() as Promise<Campaign[]>;
}

function getCampaign(id: number | string) {
  return () => db.campaigns.get(Number(id)) as Promise<Campaign | undefined>;
}

function updateCampaign(id: number | string, changes: Partial<CampaignModel>) {
  return db.campaigns.update(Number(id), changes);
}

async function addCampaign(campaign: CampaignModel) {
  return await db.campaigns.add(campaign);
}

async function saveCampaign(campaign: Campaign) {
  return await db.campaigns.update(campaign.id, campaign);
}

function deleteCampaign(id: number | string) {
  return db.campaigns.delete(Number(id));
}

async function addOrg(org: OrgModel) {
  const existingOrg = await db.orgs
    .where("githubRestId")
    .equals(org.githubRestId)
    .first();

  if (existingOrg && existingOrg.id) {
    await editOrg(existingOrg.id, org);
    return existingOrg.id;
  }

  return db.orgs.add(org);
}

function editOrg(orgId: number, changes: Partial<OrgModel>) {
  return db.orgs.update(orgId, changes);
}

function getOrgs(orgIds: number[]) {
  return db.orgs.where("id").anyOf(orgIds).toArray() as Promise<Org[]>;
}

function getRepos(repoIds: number[]) {
  return db.repos.where("id").anyOf(repoIds).toArray() as Promise<Repo[]>;
}

async function addRepo(repo: RepoModel) {
  const existingRepo = await db.repos
    .where("githubRestId")
    .equals(repo.githubRestId)
    .first();

  if (existingRepo && existingRepo.id) {
    await editRepo(existingRepo.id, repo);
    return existingRepo.id;
  }

  return db.repos.add(repo);
}

function editRepo(repoId: number, changes: Partial<RepoModel>) {
  return db.repos.update(repoId, changes);
}

function deleteRepo(id: number | string) {
  return db.repos.delete(Number(id));
}

function removeRepoFromCampaign(repoId: number, campaignId: number) {
  return db.campaigns
    .where("id")
    .equals(campaignId)
    .modify((campaign) => {
      campaign.repoIds = campaign.repoIds.filter((id) => id !== repoId);
    });
}

function getUsers(userIds: number[]) {
  return db.users.where("id").anyOf(userIds).toArray() as Promise<User[]>;
}

function getUser(id: number | string) {
  return db.users.get(Number(id)) as Promise<User | undefined>;
}

function getUserByLogin(login: string) {
  return db.users.where("login").equals(login).first() as Promise<
    User | undefined
  >;
}

async function addUser(user: UserModel) {
  const existingUser = await db.users
    .where("githubRestId")
    .equals(user.githubRestId)
    .first();

  if (existingUser && existingUser.id) {
    await editUser(existingUser.id, user);
    return existingUser.id;
  }

  return db.users.add(user);
}

function editUser(userId: number, changes: Partial<UserModel>) {
  return db.users.update(userId, changes);
}

function deleteUser(id: number | string) {
  return db.users.delete(Number(id));
}

function getRepoCommitSummaries(repoId: number) {
  return db.commitSummaries.where({ repoId }).toArray() as Promise<
    CommitSummary[]
  >;
}

function getUserCommitSummaries(userId: number) {
  return db.commitSummaries.where({ userId }).toArray() as Promise<
    CommitSummary[]
  >;
}

function addCommitSummary(commitSummary: CommitSummaryModel) {
  return db.commitSummaries.add(commitSummary);
}

async function getPendingScans() {
  return scansDb.scans.where("done").equals(0).toArray();
}

async function getLatestScan<DataType extends Record<string, unknown>>(
  query: DocumentNode,
  variables: QueryVariables
): Promise<Scan<DataType> | undefined> {
  const hash = await hashQuery(query, variables);

  const scan = (await scansDb.scans
    .where("hash")
    .equals(hash)
    .reverse()
    .first()) as Scan<DataType> | undefined;

  return scan;
}

function getLatestUserScan(
  login: string
): Promise<Scan<{ user: UserQueryResponseData }> | undefined> {
  return getLatestScan<{ user: UserQueryResponseData }>(USER_QUERY, {
    login,
    firstFollowers: 50,
    firstPrs: 50,
  });
}

function getLatestRepoScan(
  owner: string,
  name: string,
  since: string,
  until: string
): Promise<Scan<{ repository: RepoQueryResponseData }> | undefined> {
  return getLatestScan<{ repository: RepoQueryResponseData }>(REPO_QUERY, {
    owner,
    name,
    since,
    until,
    first: 50,
  });
}

function getEvaluationsByTypeAndTagetId(
  type: "org" | "user" | "repo",
  targetId: number
) {
  return db.evaluations
    .where({ type, targetId })
    .reverse()
    .toArray() as Promise<Evaluation[]>;
}

function getEvaluation(id: number) {
  return db.evaluations.get(id) as Promise<Evaluation | undefined>;
}

function addEvaluation(
  evaluation: Omit<EvaluationModel, "createdAt" | "updatedAt" | "done">
) {
  // TODO: replace this logic with dexie hooks
  const newEvaluation: EvaluationModel = {
    ...evaluation,
    done: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return db.evaluations.add(newEvaluation);
}

function updateEvaluation(
  id: number,
  changes: Partial<Omit<EvaluationModel, "createdAt" | "updatedAt">>
) {
  // TODO: replace this logic with dexie hooks
  const timestampedChanges: Partial<EvaluationModel> = {
    ...changes,
    updatedAt: new Date().toISOString(),
  };
  return db.evaluations.update(id, timestampedChanges);
}

export {
  type CampaignModel,
  type Campaign,
  type CommitSummaryModel,
  type CommitSummary,
  type OrgModel,
  type Org,
  type UserModel,
  type User,
  type RepoModel,
  type Repo,
  type EvaluationModel,
  type Evaluation,
  type RepoEvaluation,
  type RepoContributorEvaluation,
  getCampaigns,
  getCampaign,
  addCampaign,
  updateCampaign,
  saveCampaign,
  deleteCampaign,
  addOrg,
  getOrgs,
  getRepos,
  addRepo,
  editRepo,
  deleteRepo,
  removeRepoFromCampaign,
  getUsers,
  getUser,
  getUserByLogin,
  addUser,
  editUser,
  deleteUser,
  getRepoCommitSummaries,
  getUserCommitSummaries,
  addCommitSummary,
  getPendingScans,
  getLatestUserScan,
  getLatestRepoScan,
  getEvaluationsByTypeAndTagetId,
  getEvaluation,
  addEvaluation,
  updateEvaluation,
  db,
  scansDb,
};
