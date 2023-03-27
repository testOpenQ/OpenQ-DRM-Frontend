import { getCampaigns, type Campaign } from "@mktcodelib/github-insights";
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
      <h1 className="mb-12 text-3xl font-bold">Overview</h1>
      {!campaigns || (campaigns.length === 0 && <WelcomeModal />)}
    </>
  );
};

export default Home;
