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
} from "../lib/evaluation/Repo/queries";
import type {
  Campaign,
  CampaignModel,
  CommitSummary,
  CommitSummaryModel,
  Evaluation,
  EvaluationModel,
  Org,
  OrgModel,
  Repo,
  RepoModel,
  User,
  UserModel,
} from "./model";

class Store extends Dexie {
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

const store = new Store();

function getCampaigns() {
  return store.campaigns.toArray() as Promise<Campaign[]>;
}

function getCampaign(id: number | string) {
  return () => store.campaigns.get(Number(id)) as Promise<Campaign | undefined>;
}

function updateCampaign(id: number | string, changes: Partial<CampaignModel>) {
  return store.campaigns.update(Number(id), changes);
}

async function addCampaign(campaign: CampaignModel) {
  return await store.campaigns.add(campaign);
}

async function saveCampaign(campaign: Campaign) {
  return await store.campaigns.update(campaign.id, campaign);
}

function deleteCampaign(id: number | string) {
  return store.campaigns.delete(Number(id));
}

async function addOrg(org: OrgModel) {
  const existingOrg = await store.orgs
    .where("githubRestId")
    .equals(org.githubRestId)
    .first();

  if (existingOrg && existingOrg.id) {
    await editOrg(existingOrg.id, org);
    return existingOrg.id;
  }

  return store.orgs.add(org);
}

function editOrg(orgId: number, changes: Partial<OrgModel>) {
  return store.orgs.update(orgId, changes);
}

function getOrgs(orgIds: number[]) {
  return store.orgs.where("id").anyOf(orgIds).toArray() as Promise<Org[]>;
}

function getRepos(repoIds: number[]) {
  return store.repos.where("id").anyOf(repoIds).toArray() as Promise<Repo[]>;
}

async function addRepo(repo: RepoModel) {
  const existingRepo = await store.repos
    .where("githubRestId")
    .equals(repo.githubRestId)
    .first();

  if (existingRepo && existingRepo.id) {
    await editRepo(existingRepo.id, repo);
    return existingRepo.id;
  }

  return store.repos.add(repo);
}

function editRepo(repoId: number, changes: Partial<RepoModel>) {
  return store.repos.update(repoId, changes);
}

function deleteRepo(id: number | string) {
  return store.repos.delete(Number(id));
}

function removeRepoFromCampaign(repoId: number, campaignId: number) {
  return store.campaigns
    .where("id")
    .equals(campaignId)
    .modify((campaign) => {
      campaign.repoIds = campaign.repoIds.filter((id) => id !== repoId);
    });
}

function getUsers(userIds: number[]) {
  return store.users.where("id").anyOf(userIds).toArray() as Promise<User[]>;
}

function getUser(id: number | string) {
  return store.users.get(Number(id)) as Promise<User | undefined>;
}

function getUserByLogin(login: string) {
  return store.users.where("login").equals(login).first() as Promise<
    User | undefined
  >;
}

async function addUser(user: UserModel) {
  const existingUser = await store.users
    .where("githubRestId")
    .equals(user.githubRestId)
    .first();

  if (existingUser && existingUser.id) {
    await editUser(existingUser.id, user);
    return existingUser.id;
  }

  return store.users.add(user);
}

function editUser(userId: number, changes: Partial<UserModel>) {
  return store.users.update(userId, changes);
}

function deleteUser(id: number | string) {
  return store.users.delete(Number(id));
}

function getRepoCommitSummaries(repoId: number) {
  return store.commitSummaries.where({ repoId }).toArray() as Promise<
    CommitSummary[]
  >;
}

function getUserCommitSummaries(userId: number) {
  return store.commitSummaries.where({ userId }).toArray() as Promise<
    CommitSummary[]
  >;
}

function addCommitSummary(commitSummary: CommitSummaryModel) {
  return store.commitSummaries.add(commitSummary);
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
  return store.evaluations
    .where({ type, targetId })
    .reverse()
    .toArray() as Promise<Evaluation[]>;
}

function getEvaluation(id: number) {
  return store.evaluations.get(id) as Promise<Evaluation | undefined>;
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
  return store.evaluations.add(newEvaluation);
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
  return store.evaluations.update(id, timestampedChanges);
}

export {
  store as db,
  scansDb,
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
};
