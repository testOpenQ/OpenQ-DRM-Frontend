import { getUsers, type User } from "@mktcodelib/github-insights";
import { useObservable } from "dexie-react-hooks";
import ListItem from "./ListItem";
import Add from "./Add";

export default function UsersList() {
  const users = useObservable<User[]>(() => getUsers());

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-3">
      <Add />
      {users && users.map((user) => <ListItem key={user.id} user={user} />)}
    </div>
  );
}
