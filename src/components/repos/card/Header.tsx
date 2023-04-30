import { useSession } from "next-auth/react";
import type { Repo } from "~/db";
import LoadingSpinner from "../../LoadingSpinner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import DiscreetButton from "../../base/DiscreetButton";
import Image from "next/image";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import { evaluateRepo } from "~/lib/github/repo/evaluate";

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
    if (!accessToken) return;

    setIsScanning(true);

    await evaluateRepo(repo.id, accessToken, since, until);

    setIsScanning(false);
  }

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
