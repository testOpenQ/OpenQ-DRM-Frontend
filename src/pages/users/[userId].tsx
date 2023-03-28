import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const UserDetails = dynamic(() => import("~/components/users/Details"), {
  ssr: false,
});

export default function User() {
  const router = useRouter();
  const { userId } = router.query;

  if (!userId) return <>Loading...</>;

  if (Array.isArray(userId)) return <>Invalid repository id.</>;

  return (
    <>
      <UserDetails userId={userId} />
    </>
  );
}
