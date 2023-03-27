import { type NextPage } from "next";
import Head from "next/head";
import List from "~/components/users/List";

const Users: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Users</title>
      </Head>
      <h1 className="text-3xl font-bold mb-12">Users</h1>
      <List />
    </>
  );
};

export default Users;
