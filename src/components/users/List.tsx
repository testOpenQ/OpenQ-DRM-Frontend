import { getUsers, User } from '@mktcodelib/github-insights';
import { useObservable } from 'dexie-react-hooks';
import ListItem from './ListItem';
import Add from './Add';

export default function UsersList() {
  const users = useObservable<User[]>(() => getUsers())

  return (
    <>
      <Add />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        {users && users.map((user) => (
          <ListItem key={user.id} user={user} />
        ))}
      </div>
    </>
  );
}
