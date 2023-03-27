import { getCampaign, type Campaign } from "@mktcodelib/github-insights";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CampaignDetails = () => {
  const router = useRouter();
  const { campaignId } = router.query;
  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);

  useEffect(() => {
    if (campaignId) {
      getCampaign(Number(campaignId))
        .then((existingCampaign) => {
          setCampaign(existingCampaign);
        })
        .catch((err) => console.log(err));
    }
  }, [campaignId]);

  if (!campaignId) return <>loading...</>;

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <>
      <h1 className="mb-12 text-3xl font-bold">{campaign.name}</h1>
      <div className="flex w-full max-w-md flex-col items-center space-y-3">
        asd
      </div>
    </>
  );
};

export default CampaignDetails;
