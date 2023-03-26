import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import ConnectGithub from "~/components/ConnectGithub";

const List = dynamic(() => import("~/components/repos/List"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const Repos: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Repositories</title>
      </Head>
      <ConnectGithub />
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Repositorues
        </h1>
        <List />
      </div>
    </>
  );
};

export default Repos;
