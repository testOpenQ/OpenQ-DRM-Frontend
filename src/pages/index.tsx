import { addCampaign, Campaign, getCampaigns, removeCampaign } from "@mktcodelib/github-insights";
import { useObservable } from "dexie-react-hooks";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Button from "~/components/base/Button";
import Input from "~/components/base/Input";
import Navigation from "~/components/layout/Navigation";
import WelcomeModal from "~/components/WelcomeModal";

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
        <title>OpenQ DRM</title>
        <link rel="icon" href="/openq-logo.png" />
      </Head>
      <main className="flex min-h-screen max-w-3xl flex-col items-center mx-auto">
        <Navigation />
        <h1 className="text-3xl font-bold mb-12">Campaigns</h1>
        <div className="space-y-3 w-full max-w-md flex flex-col items-center">
          <div className="flex w-full">
            <Input value={campaignName} setValue={setCampaignName} placeholder="My new campaign" />
            <div className="ml-3">
              <Button onClick={handleAddCampaign}>add</Button>
            </div>
          </div>
          {campaigns && campaigns.map((campaign) => <div key={campaign.id} className="flex space-x-3 w-full">
            <Button>{campaign.name}</Button>
            <Button className="flex-1" onClick={() => removeCampaign(campaign.id)}>delete</Button>
          </div>)}
        </div>
      </main>
      {!campaigns || campaigns.length === 0 && <WelcomeModal />}
    </>
  );
};

export default Home;
