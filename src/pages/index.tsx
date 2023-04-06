import Head from "next/head";
import dynamic from "next/dynamic";

const Frontpage = dynamic(() => import("~/components/Frontpage"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <Head>
        <title>OpenQ DRM</title>
      </Head>
      <Frontpage />
    </>
  );
}
