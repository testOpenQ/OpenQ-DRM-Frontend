import {
  type Scan,
  hashQuery,
  db as scansDb,
  type QueryVariables,
} from "@mktcodelib/github-scanner";
import Dexie, { type Table } from "dexie";
import { type DocumentNode } from "graphql";
import {
  USER_QUERY,
  type UserQueryResponseData,
} from "./lib/github/user/query";
import {
  REPO_QUERY,
  type RepoQueryResponseData,
} from "./lib/github/repo/query";

interface CampaignModel {
  id?: number;
  name: string;
  orgsIds: number[];
  reposIds: number[];
  usersIds: number[];
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
  gravatarId: string;
  name: string;
  company: string;
  blog: string;
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
  login: string;
  githubRestId: number;
  githubGraphqlId: string;
  avatarUrl: string;
  gravatarId: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitterUsername: string;
  followers: number;
  following: number;
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
  evaluationType: "user" | "repo" | "org";
  targetId?: number;
  dataIds: { [key: string]: number };
  result: { [key: string]: any };
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Evaluation extends EvaluationModel {
  id: number;
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
      orgs: `++id, login`,
      repos: `++id, fullName`,
      users: `++id, login`,
      commitSummaries: `++id, repoId, userId`,
      evaluations: `++id, evaluationType, targetId, done`,
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

async function addCampaign(campaign: CampaignModel) {
  return await db.campaigns.add(campaign);
}

async function saveCampaign(campaign: Campaign) {
  return await db.campaigns.update(campaign.id, campaign);
}

function deleteCampaign(id: number | string) {
  return db.campaigns.delete(Number(id));
}

function addOrg(org: OrgModel) {
  return db.orgs.add(org);
}

function getRepos(campaignId?: number | string) {
  return (
    campaignId
      ? db.repos.where({ campaignId: Number(campaignId) }).toArray()
      : db.repos.toArray()
  ) as Promise<Repo[]>;
}

function addRepo(repo: RepoModel) {
  return db.repos.add(repo);
}

function editRepo(repoId: number, changes: Partial<RepoModel>) {
  return db.repos.update(repoId, changes);
}

function deleteRepo(id: number | string) {
  return db.repos.delete(Number(id));
}

function getUsers(id?: number | string) {
  return (
    id
      ? db.users.where({ campaignId: Number(id) }).toArray()
      : db.users.toArray()
  ) as Promise<User[]>;
}

function addUser(user: UserModel) {
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
  evaluationType: "user" | "repo",
  targetId: number
) {
  return db.evaluations
    .where({ evaluationType, targetId })
    .toArray() as Promise<Evaluation[]>;
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
  getCampaigns,
  getCampaign,
  addCampaign,
  saveCampaign,
  deleteCampaign,
  addOrg,
  getRepos,
  addRepo,
  editRepo,
  deleteRepo,
  getUsers,
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
  db,
  scansDb,
};
