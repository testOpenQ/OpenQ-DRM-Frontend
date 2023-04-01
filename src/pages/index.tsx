import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const Frontpage = dynamic(() => import("~/components/Frontpage"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM</title>
      </Head>
      <Frontpage />
    </>
  );
};

export default Home;
