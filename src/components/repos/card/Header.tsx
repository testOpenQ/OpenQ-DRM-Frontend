import { useSession } from "next-auth/react";
import { type Repo, editRepo } from "~/db";
import LoadingSpinner from "../../LoadingSpinner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import DiscreetButton from "../../base/DiscreetButton";
import Image from "next/image";
import { Scanner } from "@mktcodelib/github-scanner";
import {
  REPO_QUERY,
  type RepoQueryResponseData,
} from "~/lib/githubData/repo/query";
import { useEffect, useState } from "react";
import DeleteButton from "./DeleteButton";

export default function CardHeader({
  repo,
  since,
  until,
}: {
  repo: Repo;
  since: string;
  until: string;
}) {
  const { data } = useSession();
  const accessToken = data?.accessToken;
  const [isScanning, setIsScanning] = useState(false);

  async function scan() {
    if (!accessToken) {
      console.log("No access token set");
      return;
    }

    if (isScanning) {
      console.log("Already scanning");
      return;
    }

    setIsScanning(true);

    const queryVariables = {
      owner: repo.ownerLogin,
      name: repo.name,
      since,
      until,
      first: 50,
    };

    const scanner = new Scanner({ accessToken });
    await scanner.scan<{ repository: RepoQueryResponseData }>(
      REPO_QUERY,
      queryVariables,
      ({ scanId }) => {
        editRepo(repo.id, { lastScanId: scanId }).catch(console.error);
      }
    );

    setIsScanning(false);
  }

  useEffect(() => {
    if (!repo.lastScanId) {
      scan().catch(console.error);
    }
  });

  return (
    <div className="flex items-center justify-between bg-gray-900/50 px-3 py-2 font-bold">
      <div className="flex items-center">
        <Image
          src={repo.ownerAvatarUrl}
          width={24}
          height={24}
          className="mr-2 rounded-full"
          alt="avatar"
        />
        {repo.fullName}
      </div>
      <div className="flex">
        {accessToken && (
          <DiscreetButton
            disabled={isScanning}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={scan}
            className={
              isScanning ? "!cursor-default hover:!bg-transparent" : ""
            }
          >
            {isScanning && <LoadingSpinner className="!h-4 !w-4" />}
            {!isScanning && <ArrowPathIcon className="h-4 w-4" />}
          </DiscreetButton>
        )}
        {!isScanning && <DeleteButton repo={repo} />}
      </div>
    </div>
  );
}
