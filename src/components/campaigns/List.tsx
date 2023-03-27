import { getCampaigns, type Campaign } from "@mktcodelib/github-insights";
import { useObservable } from "dexie-react-hooks";
import ListItem from "./ListItem";
import Add from "./Add";

export default function CampaignsList() {
  const campaigns = useObservable<Campaign[]>(() => getCampaigns());

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-3">
      <Add />
      {campaigns &&
        campaigns.map((campaign) => (
          <ListItem key={campaign.id} campaign={campaign} />
        ))}
    </div>
  );
}
