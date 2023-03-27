import { type NextPage } from "next";
import Head from "next/head";
import List from "~/components/repos/List";

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
