import { Campaign, getCampaigns } from "@mktcodelib/github-insights";
import { useObservable } from "dexie-react-hooks";
import { type NextPage } from "next";
import Head from "next/head";
import WelcomeModal from "~/components/WelcomeModal";

const Home: NextPage = () => {
  const campaigns = useObservable<Campaign[]>(() => getCampaigns());

  return (
    <>
      <Head>
        <title>OpenQ DRM</title>
      </Head>
      <h1 className="text-3xl font-bold mb-12">Overview</h1>
      {!campaigns || campaigns.length === 0 && <WelcomeModal />}
    </>
  );
};

export default Home;
