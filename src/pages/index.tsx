import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const WelcomeModal = dynamic(() => import("~/components/WelcomeModal"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM</title>
      </Head>
      <h1 className="mb-12 text-3xl font-bold">Overview</h1>
      <WelcomeModal />
    </>
  );
};

export default Home;
