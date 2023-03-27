import { TrashIcon } from '@heroicons/react/24/outline';
import { removeUser, type User } from '@mktcodelib/github-insights';
import Link from 'next/link';
import Button from '../base/Button';

export default function ListItem({ user }: { user: User }) {
  function handleRemoveUser() {
    removeUser(user.id).catch((err) => console.log(err));
  }

  return (
    <>
      <div className="flex space-x-3 w-full">
        <Link className="w-full" href={`/users/${user.id}`}>
          <Button>{user.login}</Button>
        </Link>
        <Button className="flex-1" onClick={handleRemoveUser}>
          <TrashIcon className="h-6 w-6 text-violet-700 group-hover:text-violet-100 transition-all" />
        </Button>
      </div>
    </>
  );
}
