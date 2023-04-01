import { getUser } from "~/db";
import { useLiveQuery } from "dexie-react-hooks";
import Card from "./Card";
import Headline from "../layout/Headline";

export default function UserDetails({ userId }: { userId: string }) {
  const user = useLiveQuery(getUser(userId));

  if (!user) return <>User does not exist.</>;

  return (
    <>
      <Headline>{user.login}</Headline>
      <Card user={user} />
    </>
  );
}
