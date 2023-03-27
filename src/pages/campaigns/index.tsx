import { type NextPage } from "next";
import Head from "next/head";
import List from "~/components/campaigns/List";

const Campaigns: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Campaigns</title>
      </Head>
      <h1 className="mb-12 text-3xl font-bold">Campaigns</h1>
      <List />
    </>
  );
};

export default Campaigns;
