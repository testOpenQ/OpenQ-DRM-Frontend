import { Repo, User, deleteCampaign, getCampaign } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import Button from "../base/Button";
import {
  TrashIcon,
  PencilIcon,
  PlusIcon,
  UserIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import Headline from "../layout/Headline";
import { useRouter } from "next/router";
import RepoCard from "../repos/Card";
import UserCard from "../users/Card";
import DiscreetButton from "../base/DiscreetButton";

export default function CampaignsDetails({
  campaignId,
  repos,
  users,
}: {
  campaignId: string;
  repos: Repo[];
  users: User[];
}) {
  const router = useRouter();
  const campaign = useLiveQuery(getCampaign(campaignId));

  function handleDeleteCampaign(id: number) {
    router
      .push("/")
      .then(() => deleteCampaign(id))
      .catch((err) => console.log(err));
  }

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <>
      <Headline>
        {campaign.name}
        <div className="ml-2">
          <DiscreetButton className="!bg-transparent hover:!bg-gray-800">
            <PencilIcon className="h-5 w-5" />
          </DiscreetButton>
        </div>
        <div className="ml-auto flex">
          <DiscreetButton onClick={() => handleDeleteCampaign(campaign.id)}>
            <UserIcon className="mr-2 h-5 w-5" />
            add user
          </DiscreetButton>
          <DiscreetButton onClick={() => handleDeleteCampaign(campaign.id)}>
            <CodeBracketIcon className="mr-2 h-5 w-5" />
            add repository
          </DiscreetButton>
          <DiscreetButton
            onClick={() => handleDeleteCampaign(campaign.id)}
            className="hover:!bg-red-700"
          >
            <TrashIcon className="mr-2 h-5 w-5" />
            delete campaign
          </DiscreetButton>
        </div>
      </Headline>

      {repos.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-indigo-700">Repositories</h2>
          <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </>
      )}
      {users.length > 0 && (
        <>
          <h2 className="text-3xl font-bold text-indigo-700">Users</h2>
          <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
