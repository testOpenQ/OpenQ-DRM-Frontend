export type GithubRestRepo = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_discussions: boolean;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: string;
  topics: string[];
  visibility: string;
  default_branch: string;
  subscribers_count: number;
};

export function isGithubRestRepo(obj: unknown): obj is GithubRestRepo {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "node_id" in obj &&
    "name" in obj &&
    "full_name" in obj &&
    "private" in obj &&
    "owner" in obj &&
    obj.owner !== null &&
    typeof obj.owner === "object" &&
    "login" in obj.owner &&
    "avatar_url" in obj.owner &&
    "description" in obj &&
    "fork" in obj &&
    "created_at" in obj &&
    "updated_at" in obj &&
    "pushed_at" in obj &&
    "homepage" in obj &&
    "size" in obj &&
    "stargazers_count" in obj &&
    "watchers_count" in obj &&
    "language" in obj &&
    "has_issues" in obj &&
    "has_projects" in obj &&
    "has_discussions" in obj &&
    "forks_count" in obj &&
    "archived" in obj &&
    "disabled" in obj &&
    "open_issues_count" in obj &&
    "license" in obj &&
    "topics" in obj &&
    "visibility" in obj &&
    "default_branch" in obj &&
    "subscribers_count" in obj
  );
}

export type GithubRestUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username: string;
  followers: number;
  following: number;
  type: "User" | "Organization";
  created_at: string;
  updated_at: string;
};

export function isGithubRestUser(obj: unknown): obj is GithubRestUser {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "login" in obj &&
    "id" in obj &&
    "node_id" in obj &&
    "avatar_url" in obj &&
    "gravatar_id" in obj &&
    "name" in obj &&
    "company" in obj &&
    "blog" in obj &&
    "location" in obj &&
    "email" in obj &&
    "hireable" in obj &&
    "bio" in obj &&
    "twitter_username" in obj &&
    "followers" in obj &&
    "following" in obj &&
    "type" in obj &&
    "created_at" in obj &&
    "updated_at" in obj
  );
}

export type GitHubRestCodeSearchResultItem = {
  repository: GithubRestRepo;
};

export function isGitHubRestCodeSearchResultItem(
  obj: unknown
): obj is GitHubRestCodeSearchResultItem {
  return (
    typeof obj === "object" && obj !== null && "name" in obj && "path" in obj
  );
}

export type GitHubRestCodeSearchResult = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRestCodeSearchResultItem[];
};

export function isGitHubRestCodeSearchResult(
  obj: unknown
): obj is GitHubRestCodeSearchResult {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "total_count" in obj &&
    "incomplete_results" in obj &&
    "items" in obj &&
    Array.isArray(obj.items) &&
    obj.items.every(isGitHubRestCodeSearchResultItem)
  );
}

export type GithubGraphQLUser = {
  id: string;
  databaseId: number;
  login: string;
  avatarUrl: string;
  name: string;
  company: string;
  isHireable: boolean;
  websiteUrl: string;
  location: string;
  email: string;
  bio: string;
  twitterUsername: string;
  followers: {
    totalCount: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type RateLimit = {
  used: number;
  remaining: number;
  reset: number;
};

export type RateLimits = {
  core: RateLimit;
  graphql: RateLimit;
  search: RateLimit;
};

export type RateLimitsResponse = {
  resources: RateLimits;
};

export function isRateLimitsResponse(obj: unknown): obj is RateLimitsResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "resources" in obj &&
    typeof obj.resources === "object" &&
    obj.resources !== null &&
    "core" in obj.resources &&
    "graphql" in obj.resources &&
    "search" in obj.resources
  );
}

export type DepsJson = {
  name: string;
  dependencies: Record<string, string>;
  excludedRepos: string[];
};

export function isDepsJson(obj: unknown): obj is DepsJson {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "dependencies" in obj &&
    "excludedRepos" in obj &&
    typeof obj.name === "string" &&
    typeof obj.dependencies === "object" &&
    typeof obj.excludedRepos === "object" &&
    Array.isArray(obj.excludedRepos) &&
    obj.excludedRepos.every((repo) => typeof repo === "string")
  );
}

export const ScoreCategory = {
  activity: "activity",
  growth: "growth",
  popularity: "popularity",
  reputation: "reputation",
} as const;

export type ScoreCategory = (typeof ScoreCategory)[keyof typeof ScoreCategory];

export type Scores = {
  activity: number;
  growth: number;
  popularity: number;
  reputation: number;
};

export type RepoScores = {
  [repoId: number]: Scores;
};
