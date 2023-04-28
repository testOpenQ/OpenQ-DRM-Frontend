import { OrgModel, RepoModel, UserModel } from "~/db";
import { GithubRestRepo, GithubRestUser } from "../types";

function options(accessToken: string): RequestInit {
  return {
    headers: {
      Authorization: "token " + accessToken,
    },
  };
}

export async function fetchRepo(
  item: string,
  accessToken: string
): Promise<GithubRestRepo> {
  const response = await fetch(
    `https://api.github.com/repos/${item}`,
    options(accessToken)
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repo: ${response.statusText}`);
  }

  const repo: GithubRestRepo = await response.json();

  return repo;
}

export function mapRestRepoToModel(repo: GithubRestRepo): RepoModel {
  return {
    githubRestId: repo.id,
    githubGraphqlid: repo.node_id,
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    ownerLogin: repo.owner.login,
    ownerAvatarUrl: repo.owner.avatar_url,
    description: repo.description,
    fork: repo.fork,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    homepage: repo.homepage,
    size: repo.size,
    stargazersCount: repo.stargazers_count,
    watchersCount: repo.watchers_count,
    language: repo.language,
    hasIssues: repo.has_issues,
    hasProjects: repo.has_projects,
    hasDiscussions: repo.has_discussions,
    forksCount: repo.forks_count,
    archived: repo.archived,
    disabled: repo.disabled,
    openIssuesCount: repo.open_issues_count,
    license: repo.license,
    topics: repo.topics,
    visibility: repo.visibility,
    defaultBranch: repo.default_branch,
    subscribersCount: repo.subscribers_count,
  };
}

export async function fetchUser(
  item: string,
  accessToken: string
): Promise<GithubRestUser> {
  const response = await fetch(
    `https://api.github.com/users/${item}`,
    options(accessToken)
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  const user: GithubRestUser = await response.json();

  return user;
}

export function mapRestUserToModel(user: GithubRestUser): UserModel {
  return {
    login: user.login,
    githubRestId: user.id,
    githubGraphqlId: user.node_id,
    avatarUrl: user.avatar_url,
    gravatarId: user.gravatar_id,
    name: user.name,
    company: user.company,
    hireable: user.hireable,
    blog: user.blog,
    location: user.location,
    email: user.email,
    bio: user.bio,
    twitterUsername: user.twitter_username,
    followers: user.followers,
    following: user.following,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

export function mapRestOrgToModel(org: GithubRestUser): OrgModel {
  return {
    login: org.login,
    githubRestId: org.id,
    githubGraphqlId: org.node_id,
    avatarUrl: org.avatar_url,
    gravatarId: org.gravatar_id,
    name: org.name,
    company: org.company,
    blog: org.blog,
    location: org.location,
    email: org.email,
    bio: org.bio,
    twitterUsername: org.twitter_username,
    followers: org.followers,
    createdAt: org.created_at,
    updatedAt: org.updated_at,
  };
}

export async function fetchAllPages(
  url: string,
  accessToken: string,
  page: number,
  perPage: number,
  accumulatedData: any[] = []
): Promise<any[]> {
  const response = await fetch(
    `${url}?page=${page}&per_page=${perPage}`,
    options(accessToken)
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.length === 0) {
    return accumulatedData;
  }

  return fetchAllPages(
    url,
    accessToken,
    page + 1,
    perPage,
    accumulatedData.concat(data)
  );
}

export async function fetchAllOrgRepos(
  orgName: string,
  accessToken: string
): Promise<GithubRestRepo[]> {
  const url = `https://api.github.com/orgs/${orgName}/repos`;
  const repos = await fetchAllPages(url, accessToken, 1, 100);
  return repos;
}

export async function searchRepos(
  query: string,
  excludedRepos: string[],
  accessToken: string
): Promise<GithubRestRepo[]> {
  const url = `https://api.github.com/search/code?q=${encodeURIComponent(
    query
  )}&per_page=10&sort=stars&order=desc`;
  const response = await fetch(url, options(accessToken));

  if (!response.ok) {
    throw new Error(`Failed to search repos: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.items.length === 0) {
    return [];
  }

  const repos = data.items.reduce((acc: any[], item: any) => {
    if (excludedRepos.includes(item.repository.full_name)) {
      return acc;
    }

    if (acc.find((repo) => repo.id === item.repository.id)) {
      return acc;
    }

    return acc.concat(item.repository);
  }, []);

  return repos;
}
