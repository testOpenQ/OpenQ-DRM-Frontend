import Head from "next/head";
import Headline from "~/components/layout/Headline";
import List from "~/components/users/List";

export default function UsersPage() {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Users</title>
      </Head>
      <Headline>Users</Headline>
      <List />
    </>
  );
}
