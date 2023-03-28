import { getCampaigns } from "~/db";
import ListItem from "./ListItem";
import Add from "./Add";
import { useLiveQuery } from "dexie-react-hooks";

export default function CampaignsList() {
  const campaigns = useLiveQuery(getCampaigns);

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
