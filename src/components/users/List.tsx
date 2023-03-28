import { getUsers } from "~/db";
import ListItem from "./ListItem";
import Add from "./Add";
import { useLiveQuery } from "dexie-react-hooks";

export default function UsersList() {
  const users = useLiveQuery(getUsers);

  return (
    <div className="flex w-full max-w-md flex-col items-center space-y-3">
      <Add />
      {users && users.map((user) => <ListItem key={user.id} user={user} />)}
    </div>
  );
}
