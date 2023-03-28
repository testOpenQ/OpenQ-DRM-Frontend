import { getCampaign } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function CampaignsDetails({
  campaignId,
}: {
  campaignId: string;
}) {
  const campaign = useLiveQuery(getCampaign(campaignId));

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <>
      <h1 className="mb-12 text-3xl font-bold">{campaign.name}</h1>
      <div className="flex w-full max-w-md flex-col items-center space-y-3">
        asd
      </div>
    </>
  );
}
