import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteUser, type User } from "~/db";
import Link from "next/link";
import Button from "../base/Button";

export default function ListItem({ user }: { user: User }) {
  function handleRemoveUser() {
    deleteUser(user.id).catch((err) => console.log(err));
  }

  return (
    <>
      <div className="flex w-full space-x-3">
        <Link className="w-full" href={`/users/${user.id}`}>
          <Button>{user.login}</Button>
        </Link>
        <Button className="flex-1" onClick={handleRemoveUser}>
          <TrashIcon className="h-6 w-6 text-violet-700 transition-all group-hover:text-violet-100" />
        </Button>
      </div>
    </>
  );
}
