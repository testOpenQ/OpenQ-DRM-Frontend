import { useSession } from "next-auth/react";
import { Repo } from "~/db";
import LoadingSpinner from "../../LoadingSpinner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import DiscreetButton from "../../base/DiscreetButton";
import Image from "next/image";
import DeleteButton from "./DeleteButton";
import { RepoEvaluator } from "~/lib/evaluation/Repo/RepoEvaluator";
import { useState } from "react";

export default function CardHeader({
  campaignId,
  repo,
}: {
  campaignId?: number;
  repo: Repo;
}) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [isEvaluating, setIsEvaluating] = useState(false);

  async function evaluateRepo() {
    if (!accessToken) return;

    setIsEvaluating(true);

    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setMonth(since.getMonth() - 1);

    const until = new Date();
    until.setHours(0, 0, 0, 0);

    const evaluation = new RepoEvaluator(repo, accessToken);
    await evaluation.evaluate({
      since: since.toISOString(),
      until: until.toISOString(),
    });

    setIsEvaluating(false);
  }

  return (
    <div className="flex items-center justify-between bg-gray-900/50 px-3 py-2 font-bold">
      <div className="flex items-center">
        <Image
          src={repo.ownerAvatarUrl}
          width={24}
          height={24}
          className="mr-2 rounded-full bg-white/5"
          alt="avatar"
        />
        {repo.fullName}
      </div>
      <div className="flex">
        {accessToken && (
          <DiscreetButton
            disabled={isEvaluating}
            onClick={evaluateRepo}
            className={
              isEvaluating ? "!cursor-default hover:!bg-transparent" : ""
            }
          >
            {isEvaluating && <LoadingSpinner className="!h-4 !w-4" />}
            {!isEvaluating && <ArrowPathIcon className="h-4 w-4" />}
          </DiscreetButton>
        )}
        {!isEvaluating && !!campaignId && (
          <DeleteButton repo={repo} campaignId={campaignId} />
        )}
      </div>
    </div>
  );
}
