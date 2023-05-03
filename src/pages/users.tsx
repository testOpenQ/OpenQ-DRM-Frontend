import dynamic from "next/dynamic";

const User = dynamic(() => import("~/components/customers"), {
  ssr: false,
});

export default function UsersPage() {
  return <User />;
}
