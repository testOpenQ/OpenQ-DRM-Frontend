import {
  getRepository,
  lastRepoResult,
  Scanner,
  type RepoCommitsEvaluation,
  type Repository,
} from "@mktcodelib/github-insights";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Card from "~/components/repos/Card";
import RequestInfo from "~/components/RequestInfo";
import Button from "~/components/base/Button";

const RepoDetails = () => {
  const router = useRouter();
  const { repoId } = router.query;

  const [repo, setRepo] = useState<Repository | undefined>(undefined);
  
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [scanning, setScanning] = useState(false);
  const [repoScanResult, setRepoScanResult] = useState<RepoCommitsEvaluation | null>(null);
  const [progress, setProgress] = useState<{ requestCount: number; remainingRequests: number } | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ used: number; remaining: number; resetAt: string } | null>(null);

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  useEffect(() => {
    if (repoId) {
      getRepository(Number(repoId)).then((repo) => {
        setRepo(repo);
      }).catch((err) => console.log(err));

      lastRepoResult(Number(repoId)).then((last) => {
        if (last) {
          setRepoScanResult(last);
        }
      }).catch((err) => console.log(err));
    }
  }, [repoId]);

  function scan() {
    if (!accessToken) {
      console.log("No access token set");
      return;
    }

    const scanner = new Scanner({ viewerToken: accessToken });
    const scan = scanner.scanRepoCommits(Number(repoId), oneMonthAgo, now)

    setScanning(true);
    scan(({ result, requestCount, remainingRequests, rateLimit }) => {
      setRepoScanResult(result);
      setProgress({ requestCount, remainingRequests });
      setRateLimitInfo(rateLimit);
    })
      .catch((err) => console.log(err))
      .finally(() => setScanning(false));
  }

  if (!repoId) return <>loading...</>;

  if (!repo) return <>Repository does not exist.</>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-12">{repo.owner}/{repo.name}</h1>
      {repoScanResult && <Card data={repoScanResult} />}
      {scanning && progress && rateLimitInfo && (
        <RequestInfo progress={progress} rateLimitInfo={rateLimitInfo} />
      )}
      <Button onClick={scan}>Scan</Button>
    </>
  );
};

export default RepoDetails;