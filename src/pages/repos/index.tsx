import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const List = dynamic(() => import("~/components/repos/List"), {
  ssr: false,
});

const Repos: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Repositories</title>
      </Head>
      <h1 className="mb-12 text-3xl font-bold">Repositories</h1>
      <List />
    </>
  );
};

export default Repos;
