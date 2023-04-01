import { getCampaign, getRepos, getUsers } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import FirstView from "./FirstView";
import Details from "./Details";

export default function Wrapper({ campaignId }: { campaignId: string }) {
  const campaign = useLiveQuery(getCampaign(campaignId));

  const repos = useLiveQuery(() => getRepos(campaignId));
  const users = useLiveQuery(() => getUsers(campaignId));

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <div className="max-w-2xl">
      {campaign &&
        repos &&
        users &&
        (repos.length + users.length > 0 ? (
          <Details campaignId={campaignId} repos={repos} users={users} />
        ) : (
          <FirstView campaignId={campaignId} />
        ))}
    </div>
  );
}
