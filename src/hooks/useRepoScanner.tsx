import { Scanner } from "@mktcodelib/github-insights";
import { useLiveQuery } from "dexie-react-hooks";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { RepoModel, getLatestRepoScan } from "~/db";
import { getRepoScan } from "~/lib/githubScanner";
import { evaluateRepoData } from "~/lib/githubScanner/evaluators/repo";

export default function useRepoScanner(repo: RepoModel) {
  const { data } = useSession();
  const viewerToken = data?.accessToken;

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

  function scan() {
    if (!viewerToken) {
      console.log("No access token set");
      return;
    }

    if (latestRepoScan && !latestRepoScan.done) {
      console.log("Already scanning");
      return;
    }

    const scanner = new Scanner({ viewerToken });
    const repoScan = getRepoScan(
      scanner,
      repo.ownerLogin,
      repo.name,
      since,
      until
    );

    repoScan().catch((err) => console.log(err));
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
