import { getRepository, Repository } from "@mktcodelib/github-insights";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RepoDetails: NextPage = () => {
  const router = useRouter()
  const { repoId } = router.query
  const [repo, setRepo] = useState<Repository | undefined>(undefined);

  useEffect(() => {
    if (typeof repoId !== "string") return;

    getRepository(Number(repoId)).then((repo) => {
      setRepo(repo);
    });
  }, []);
  
  return (
    <>
      <Head>
        <title>OpenQ DRM - {repo?.name}</title>
      </Head>
      {
        repo && (<>
          <h1 className="text-3xl font-bold mb-12">{repo.name}</h1>
          <div className="space-y-3 w-full max-w-md flex flex-col items-center">
            asd
          </div>
        </>)
      }
    </>
  );
};

export default RepoDetails;
