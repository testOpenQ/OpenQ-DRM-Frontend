import { useSession } from "next-auth/react";
import { type Repo, deleteRepo } from "~/db";
import LoadingSpinner from "../../LoadingSpinner";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DiscreetButton from "../../base/DiscreetButton";
import useRepoScanner from "~/hooks/useRepoScanner";

export default function CardHeader({ repo }: { repo: Repo }) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const { isScanning, scan } = useRepoScanner(repo);

  function handleDeleteRepo() {
    deleteRepo(repo.id).catch(console.error);
  }

  if (!repo) return <>Repository does not exist.</>;

  return (
    <div className="flex items-center justify-between bg-gray-900/50 px-3 py-2 font-bold">
      <div>
        {repo.owner}/{repo.name}
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
        {!isScanning && (
          <DiscreetButton>
            <XMarkIcon className="h-4 w-4" onClick={handleDeleteRepo} />
          </DiscreetButton>
        )}
      </div>
    </div>
  );
}
