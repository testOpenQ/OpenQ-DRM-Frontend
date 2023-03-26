import { addCampaign, Campaign, getCampaigns, removeCampaign } from "@mktcodelib/github-insights";
import { useObservable } from "dexie-react-hooks";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Button from "~/components/base/Button";
import Input from "~/components/base/Input";
import { PlusSmallIcon, TrashIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const campaigns = useObservable<Campaign[]>(() => getCampaigns());
  const [campaignName, setCampaignName] = useState("");

  function handleAddCampaign() {
    setCampaignName("");
    addCampaign(campaignName);
  }

  return (
    <>
      <Head>
        <title>OpenQ DRM - Campaigns</title>
      </Head>
      <h1 className="text-3xl font-bold mb-12">Campaigns</h1>
      <div className="space-y-3 w-full max-w-md flex flex-col items-center">
        <div className="flex w-full">
          <Input value={campaignName} setValue={setCampaignName} placeholder="My new campaign" />
          <div className="ml-3">
            <Button onClick={handleAddCampaign}>
              <PlusSmallIcon className="h-6 w-6 text-violet-700 group-hover:text-violet-100 transition-all" />
            </Button>
          </div>
        </div>
        {campaigns && campaigns.map((campaign) => <div key={campaign.id} className="flex space-x-3 w-full">
          <Link className="w-full" href={`/campaigns/${campaign.id}`}><Button>{campaign.name}</Button></Link>
          <Button className="flex-1" onClick={() => removeCampaign(campaign.id!)}>
            <TrashIcon className="h-6 w-6 text-violet-700 group-hover:text-violet-100 transition-all" />
          </Button>
        </div>)}
      </div>
    </>
  );
};

export default Home;
