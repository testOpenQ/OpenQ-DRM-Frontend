import { getUsers, User } from '@mktcodelib/github-insights';
import { useObservable } from 'dexie-react-hooks';
import ListItem from './ListItem';
import Add from './Add';

export default function UsersList() {
  const users = useObservable<User[]>(() => getUsers())

  return (
    <div className="space-y-3 w-full max-w-md flex flex-col items-center">
      <Add />
      {users && users.map((user) => (
        <ListItem key={user.id} user={user} />
      ))}
    </div>
  );
}
