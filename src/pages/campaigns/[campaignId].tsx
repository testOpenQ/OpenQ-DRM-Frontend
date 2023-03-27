import { Campaign, getCampaign } from "@mktcodelib/github-insights";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CampaignDetails = () => {
  const router = useRouter();
  const { campaignId } = router.query;
  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);

  useEffect(() => {
    if (campaignId) {
      getCampaign(Number(campaignId)).then((existingCampaign) => {
        setCampaign(existingCampaign);
      });
    }
  }, [campaignId]);

  if (!campaignId) return <>loading...</>;

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-12">{campaign.name}</h1>
      <div className="space-y-3 w-full max-w-md flex flex-col items-center">
        asd
      </div>
    </>
  );
};

export default CampaignDetails;