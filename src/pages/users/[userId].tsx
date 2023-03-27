import { getUser, User } from "@mktcodelib/github-insights";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UserDetails: NextPage = () => {
  const router = useRouter()
  const { userId } = router.query
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (typeof userId !== "string") return;

    getUser(Number(userId)).then((user) => {
      setUser(user);
    });
  }, []);
  
  return (
    <>
      <Head>
        <title>OpenQ DRM - {user?.login}</title>
      </Head>
      {
        user && (<>
          <h1 className="text-3xl font-bold mb-12">{user.login}</h1>
          <div className="space-y-3 w-full max-w-md flex flex-col items-center">
            asd
          </div>
        </>)
      }
    </>
  );
};

export default UserDetails;
