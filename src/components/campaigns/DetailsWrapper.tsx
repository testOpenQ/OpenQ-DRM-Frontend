import { getCampaign, getRepos, getUsers } from "~/db";
import { useRouter } from "next/router";
import { useLiveQuery } from "dexie-react-hooks";
import Details from "./Details";

export default function Wrapper({ campaignId }: { campaignId: string }) {
  const router = useRouter();

  const campaign = useLiveQuery(getCampaign(campaignId), [campaignId]);
  const repos = useLiveQuery(() => getRepos(campaignId), [campaignId]);
  const users = useLiveQuery(() => getUsers(campaignId), [campaignId]);

  if (!campaign) return <>Campaign does not exist.</>;

  if (!repos || !users) return <>Loading...</>;

  if (repos.length + users.length === 0) {
    router.push(`/campaigns/${campaignId}/edit`);
  }

  return <Details campaign={campaign} repos={repos} users={users} />;
}
