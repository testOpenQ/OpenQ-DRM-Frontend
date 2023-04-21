import {
  type Scan,
  hashQuery,
  db as scansDb,
  type QueryVariables,
} from "@mktcodelib/github-insights";
import Dexie, { type Table } from "dexie";
import { type DocumentNode } from "graphql";
import { type UserData } from "./lib/githubScanner/evaluators/user";
import { REPO_QUERY, USER_QUERY } from "./lib/githubScanner/queries";
import { type RepoData } from "./lib/githubScanner/evaluators/repo";

export interface CampaignModel {
  id?: number;
  name: string;
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

export interface UserModel {
  id?: number;
  login: string;
  restId: number;
  graphqlId: string;
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
  created_at: string;
  updated_at: string;
  campaignId: number;
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
  campaignId: number;
}

export interface Repo extends RepoModel {
  id: number;
}

export class Db extends Dexie {
  campaigns!: Table<CampaignModel, number>;
  repos!: Table<RepoModel, number>;
  users!: Table<UserModel, number>;
  commitSummaries!: Table<CommitSummaryModel, number>;

  constructor() {
    super(`openq-drm`);
    this.version(1).stores({
      campaigns: `++id, name`,
      repos: `++id, name, owner, campaignId`,
      users: `++id, login, campaignId`,
      commitSummaries: `++id, repoId, userId`,
    });
  }
}

export const db = new Db();

export function getCampaigns() {
  return db.campaigns.toArray() as Promise<Campaign[]>;
}

export function getCampaign(id: number | string) {
  return () => db.campaigns.get(Number(id)) as Promise<Campaign | undefined>;
}

export async function addCampaign(campaign: CampaignModel) {
  return await db.campaigns.add(campaign);
}

export async function saveCampaign(campaign: Campaign) {
  return await db.campaigns.update(campaign.id, campaign);
}

export function deleteCampaign(id: number | string) {
  return db.campaigns.delete(Number(id));
}

export function getRepos(id?: number | string) {
  return (
    id
      ? db.repos.where({ campaignId: Number(id) }).toArray()
      : db.repos.toArray()
  ) as Promise<Repo[]>;
}

export function getRepo(id: number | string) {
  return () => db.repos.get(Number(id)) as Promise<Repo | undefined>;
}

export async function addRepo(repo: RepoModel) {
  return await db.repos.add(repo);
}

export function deleteRepo(id: number | string) {
  return db.repos.delete(Number(id));
}

export function getUsers(id?: number | string) {
  return (
    id
      ? db.users.where({ campaignId: Number(id) }).toArray()
      : db.users.toArray()
  ) as Promise<User[]>;
}

export function getUser(id: number | string) {
  return () => db.users.get(Number(id)) as Promise<User | undefined>;
}

export async function addUser(user: UserModel) {
  return await db.users.add(user);
}

export function deleteUser(id: number | string) {
  return db.users.delete(Number(id));
}

export function getRepoCommitSummaries(repoId: number) {
  return db.commitSummaries.where({ repoId }).toArray() as Promise<
    CommitSummary[]
  >;
}

export function getUserCommitSummaries(userId: number) {
  return db.commitSummaries.where({ userId }).toArray() as Promise<
    CommitSummary[]
  >;
}

export function addCommitSummary(commitSummary: CommitSummaryModel) {
  return db.commitSummaries.add(commitSummary);
}

export async function getPendingScans() {
  return scansDb.scans.where("done").equals(0).toArray();
}

export async function getLatestScan<DataType extends Record<string, unknown>>(
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

export function getLatestUserScan(
  login: string
): Promise<Scan<{ user: UserData }> | undefined> {
  return getLatestScan<{ user: UserData }>(USER_QUERY, {
    login,
    firstFollowers: 50,
    firstPrs: 50,
  });
}

export function getLatestRepoScan(
  owner: string,
  name: string,
  since: string,
  until: string
): Promise<Scan<{ repository: RepoData }> | undefined> {
  return getLatestScan<{ repository: RepoData }>(REPO_QUERY, {
    owner,
    name,
    since,
    until,
    first: 50,
  });
}
