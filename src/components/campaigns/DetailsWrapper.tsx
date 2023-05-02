import { type Org, type Repo, type User } from "~/store/model";
import { getCampaign, getOrgs, getRepos, getUsers } from "~/store";
import { useRouter } from "next/router";
import { useLiveQuery } from "dexie-react-hooks";
import Details from "./Details";
import { useEffect, useState } from "react";

export default function Wrapper({ campaignId }: { campaignId: string }) {
  const router = useRouter();

  const campaign = useLiveQuery(getCampaign(campaignId), [campaignId]);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    if (campaign) {
      getOrgs(campaign.orgIds).then(setOrgs).catch(console.error);
      getUsers(campaign.userIds).then(setUsers).catch(console.error);
      getRepos(campaign.repoIds).then(setRepos).catch(console.error);

      if (
        campaign.orgIds.length +
          campaign.userIds.length +
          campaign.repoIds.length ===
        0
      ) {
        router.push(`/campaigns/${campaign.id}/edit`).catch(console.error);
      }
    }
  }, [campaign, router]);

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <Details campaign={campaign} orgs={orgs} users={users} repos={repos} />
  );
}
