import { Repo, User, deleteCampaign, getCampaign } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import Button from "../base/Button";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import Headline from "../layout/Headline";
import { useRouter } from "next/router";
import RepoCard from "../repos/Card";
import UserCard from "../users/Card";

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
    <div className="max-w-2xl">
      <Headline>
        {campaign.name}
        <div className="ml-2">
          <Button className="!bg-transparent hover:!bg-gray-800">
            <PencilIcon className="h-5 w-5 text-indigo-700 transition-all group-hover:text-indigo-600" />
          </Button>
        </div>
        <div className="ml-auto">
          <Button onClick={() => handleDeleteCampaign(campaign.id)}>
            <TrashIcon className="h-5 w-5 transition-all" />
          </Button>
        </div>
      </Headline>

      <div className="mt-12 space-y-12">
        {repos.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-indigo-700">Repositories</h2>
            <div className="space-y-3">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}
        {users.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-indigo-700">Users</h2>
            <div className="list-inside list-disc">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
