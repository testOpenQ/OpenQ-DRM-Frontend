import { type NextPage } from "next";
import Head from "next/head";
import List from "~/components/campaigns/List";
import Headline from "~/components/layout/Headline";

const Campaigns: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Campaigns</title>
      </Head>
      <Headline>Campaigns</Headline>
      <List />
    </>
  );
};

export default Campaigns;
