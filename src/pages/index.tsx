import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const Welcome = dynamic(() => import("~/components/Welcome"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM</title>
      </Head>
      <h1 className="mb-12 text-5xl font-bold">Welcome</h1>
      <Welcome />
    </>
  );
};

export default Home;
