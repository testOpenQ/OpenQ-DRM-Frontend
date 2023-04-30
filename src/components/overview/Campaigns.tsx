import type { Campaign } from "~/db";
import Card from "../campaigns/Card";

export default function CampaignsOverview({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  return (
    <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
