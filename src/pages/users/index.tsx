import { type NextPage } from "next";
import Head from "next/head";
import List from "~/components/users/List";

const Users: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Users</title>
      </Head>
      <h1 className="mb-12 text-3xl font-bold">Users</h1>
      <List />
    </>
  );
};

export default Users;
