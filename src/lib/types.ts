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
