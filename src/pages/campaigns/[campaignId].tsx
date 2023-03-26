import { Campaign, getCampaign } from "@mktcodelib/github-insights";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CampaignDetails: NextPage = () => {
  const router = useRouter()
  const { campaignId } = router.query
  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);

  useEffect(() => {
    if (typeof campaignId !== "string") return;

    getCampaign(Number(campaignId)).then((campaign) => {
      setCampaign(campaign);
    });
  }, []);
  
  return (
    <>
      <Head>
        <title>OpenQ DRM - {campaign?.name}</title>
      </Head>
      {
        campaign && (<>
          <h1 className="text-3xl font-bold mb-12">{campaign.name}</h1>
          <div className="space-y-3 w-full max-w-md flex flex-col items-center">
            asd
          </div>
        </>)
      }
    </>
  );
};

export default CampaignDetails;
