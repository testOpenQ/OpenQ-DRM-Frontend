import { getRepo } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  evaluateRepoData,
  getLatestRepoScan,
  Scanner,
  type RepoEvaluation,
} from "@mktcodelib/github-insights";
import Card from "./Card";
import RequestInfo from "../RequestInfo";
import Button from "../base/Button";

export default function RepoDetails({ repoId }: { repoId: string }) {
  const repo = useLiveQuery(getRepo(repoId));

  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [scanning, setScanning] = useState(false);
  const [repoScanResult, setRepoScanResult] = useState<RepoEvaluation | null>(
    null
  );
  const [progress, setProgress] = useState<{
    requestCount: number;
    remainingRequests: number;
  } | null>(null);

  useEffect(() => {
    if (!repo) return;

    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    getLatestRepoScan(repo.owner, repo.name, oneMonthAgo, now)
      .then((latestRepoScan) => {
        if (latestRepoScan) {
          console.log("latestRepoScan", latestRepoScan);
          // TODO: setRepoScanResult(latestRepoScan.data)
        }
      })
      .catch((err) => console.error(err));
  }, [repo]);

  function scan() {
    if (!accessToken) {
      console.log("No access token set");
      return;
    }

    if (!repo) {
      console.log("No repo set");
      return;
    }

    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const scanner = new Scanner({ viewerToken: accessToken });
    const scan = scanner.scanRepo(repo.owner, repo.name, oneMonthAgo, now);

    setScanning(true);
    scan((data, requestCount, remainingRequests) => {
      setRepoScanResult(evaluateRepoData(data.repository));
      setProgress({ requestCount, remainingRequests });
    })
      .catch((err) => console.log(err))
      .finally(() => setScanning(false));
  }

  if (!repo) return <>Repository does not exist.</>;

  return (
    <>
      <h1 className="mb-12 text-3xl font-bold">
        {repo.owner}/{repo.name}
      </h1>
      <div className="flex w-full max-w-md flex-col items-center space-y-3">
        asd
      </div>
      {repoScanResult && <Card data={repoScanResult} />}
      {scanning && progress && <RequestInfo progress={progress} />}
      <Button onClick={scan}>Scan</Button>
    </>
  );
}
