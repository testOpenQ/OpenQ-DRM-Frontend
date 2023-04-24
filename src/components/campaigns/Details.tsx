import {
  type Campaign,
  type Repo,
  type User,
  deleteCampaign,
  saveCampaign,
} from "~/db";
import {
  TrashIcon,
  PencilIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Headline from "../layout/Headline";
import { useRouter } from "next/router";
import RepoCard from "../repos/card/Card";
import DiscreetButton from "../base/DiscreetButton";
import Link from "next/link";
import { useMemo, useState } from "react";
import Input from "../base/Input";

export default function CampaignsDetails({
  campaign,
  repos,
}: {
  campaign: Campaign;
  repos: Repo[];
  users: User[];
}) {
  const router = useRouter();

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

  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(campaign.name);

  function handleSaveName() {
    if (!campaign) return;
    setEditName(false);
    campaign.name = name;
    saveCampaign(campaign).catch(console.error);
  }

  function handleDeleteCampaign(id: number) {
    router
      .push("/")
      .then(() => deleteCampaign(id))
      .catch(console.error);
  }

  return (
    <>
      <Headline>
        <div className="mr-3 flex">
          {editName && (
            <Input value={name} setValue={setName} className="my-[21px]" />
          )}
          {!editName && <>{campaign.name}</>}
        </div>
        {editName && (
          <>
            <DiscreetButton onClick={handleSaveName}>
              <CheckIcon className="h-5 w-5" />
            </DiscreetButton>
            <DiscreetButton onClick={() => setEditName(false)}>
              <XMarkIcon className="h-5 w-5" />
            </DiscreetButton>
          </>
        )}
        {!editName && (
          <DiscreetButton onClick={() => setEditName(true)}>
            <PencilIcon className="h-5 w-5" />
          </DiscreetButton>
        )}
        <div className="ml-auto flex">
          <Link href={`/campaigns/${campaign.id}/edit`} className="ml-3">
            <DiscreetButton>
              <PlusIcon className="h-5 w-5" />
            </DiscreetButton>
          </Link>
          <DiscreetButton
            onClick={() => handleDeleteCampaign(campaign.id)}
            className="hover:!bg-red-700"
          >
            <TrashIcon className="h-5 w-5" />
          </DiscreetButton>
        </div>
      </Headline>

      {repos.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-indigo-700">Repositories</h2>
          <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} since={since} until={until} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
