import { type NextPage } from "next";
import Head from "next/head";
import Headline from "~/components/layout/Headline";
import List from "~/components/users/List";

const Users: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Users</title>
      </Head>
      <Headline>Users</Headline>
      <List />
    </>
  );
};

export default Users;
