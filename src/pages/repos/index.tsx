import Head from "next/head";
import dynamic from "next/dynamic";
import Headline from "~/components/layout/Headline";

const List = dynamic(() => import("~/components/repos/List"), {
  ssr: false,
});

export default function ReposPage() {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Repositories</title>
      </Head>
      <Headline>Repositories</Headline>
      <List />
    </>
  );
}
