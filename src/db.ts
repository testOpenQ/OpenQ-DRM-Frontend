import Dexie, { type Table } from "dexie";

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

export interface RepoModel {
  id?: number;
  name: string;
  owner: string;
  campaignId?: number;
}

export interface Repo extends RepoModel {
  id: number;
}

export interface UserModel {
  id?: number;
  login: string;
  campaignId?: number;
}

export interface User extends UserModel {
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
