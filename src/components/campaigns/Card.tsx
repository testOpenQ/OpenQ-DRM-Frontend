import { type Campaign, getRepos, getUsers } from "~/db";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import DiscreetButton from "../base/DiscreetButton";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const repos = useLiveQuery(() => getRepos(campaign.repoIds));
  const users = useLiveQuery(() => getUsers(campaign.userIds));

  const numberOfRepos = repos?.length ?? 0;
  const numberOfUsers = users?.length ?? 0;

  return (
    <div className="mb-auto overflow-hidden rounded-lg bg-gray-800">
      <div className="flex items-center justify-between bg-gray-900/50 px-3 py-2 font-bold">
        <div className="mr-2">{campaign.name}</div>
        <Link href={`/campaigns/${campaign.id}`}>
          <DiscreetButton>
            <ArrowRightIcon className="h-4 w-4" />
          </DiscreetButton>
        </Link>
      </div>
      <div className="flex items-center justify-center space-x-6 p-3 text-center text-gray-400">
        <div>{numberOfRepos} repos</div>
        <div>{numberOfUsers} users</div>
      </div>
    </div>
  );
}
