import { type NextPage } from "next";
import Head from "next/head";
import List from "~/components/campaigns/List";

const Campaigns: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Campaigns</title>
      </Head>
      <h1 className="text-3xl font-bold mb-12">Campaigns</h1>
      <List />
    </>
  );
};

export default Campaigns;
