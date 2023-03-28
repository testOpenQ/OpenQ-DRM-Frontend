import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const RepoDetails = dynamic(() => import("~/components/repos/Details"), {
  ssr: false,
});

export default function Repo() {
  const router = useRouter();
  const { repoId } = router.query;

  if (!repoId) return <>Loading...</>;

  if (Array.isArray(repoId)) return <>Invalid repository id.</>;

  return (
    <>
      <RepoDetails repoId={repoId} />
    </>
  );
}
