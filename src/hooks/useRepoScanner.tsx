import { Scanner } from "@mktcodelib/github-scanner";
import { useLiveQuery } from "dexie-react-hooks";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { type RepoModel, getLatestRepoScan } from "~/db";
import { evaluateRepoData } from "~/lib/githubData/repo/evaluate";
import {
  REPO_QUERY,
  type RepoQueryResponseData,
} from "~/lib/githubData/repo/query";

export default function useRepoScanner(repo: RepoModel) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const since = useMemo(() => {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setMonth(since.getMonth() - 1);
    return since.toISOString();
  }, []);

  const until = useMemo(() => {
    const until = new Date();
    until.setHours(0, 0, 0, 0);
    return until.toISOString();
  }, []);

  const latestRepoScan = useLiveQuery(
    () => getLatestRepoScan(repo.ownerLogin, repo.name, since, until),
    [repo, since, until]
  );
  const latestRepoEvaluation =
    latestRepoScan?.data?.repository &&
    evaluateRepoData(latestRepoScan.data.repository);
  const isScanning = latestRepoScan && !latestRepoScan.done;

  async function scan() {
    if (!accessToken) {
      console.log("No access token set");
      return;
    }

    if (latestRepoScan && !latestRepoScan.done) {
      console.log("Already scanning");
      return;
    }

    const scanner = new Scanner({ accessToken });
    await scanner.scan<{ repository: RepoQueryResponseData }>(REPO_QUERY, {
      owner: repo.ownerLogin,
      name: repo.name,
      since,
      until,
      first: 50,
    });
  }

  return {
    isScanning,
    latestRepoScan,
    latestRepoEvaluation,
    since,
    until,
    scan,
  };
}
