import type { Scanner } from "@mktcodelib/github-insights";
import { type RepoData } from "./evaluators/repo";
import { type UserData } from "./evaluators/user";
import { USER_QUERY, REPO_QUERY } from "./queries";

export function getUserScan(scanner: Scanner, login: string) {
  return scanner.scan<{ user: UserData }>(USER_QUERY, {
    login,
    firstFollowers: 50,
    firstPrs: 50,
  });
}

export function getRepoScan(
  scanner: Scanner,
  owner: string,
  name: string,
  since: string,
  until: string
) {
  return scanner.scan<{ repository: RepoData }>(REPO_QUERY, {
    owner,
    name,
    since,
    until,
    first: 50,
  });
}
