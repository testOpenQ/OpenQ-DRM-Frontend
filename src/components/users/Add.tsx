import { addUser } from '@mktcodelib/github-insights';
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import { useState } from 'react';
import Button from '../base/Button';
import Input from '../base/Input';

export default function AddUser() {
  const [userName, setUserName] = useState("");

  function handleAddUser() {
    setUserName("");
    addUser(userName).catch((err) => console.log(err));
  }

  return (
    <div className="flex w-full">
      <Input value={userName} setValue={setUserName} placeholder="GitHub Username" />
      <div className="ml-3">
        <Button onClick={handleAddUser}>
          <PlusSmallIcon className="h-6 w-6 text-violet-700 group-hover:text-violet-100 transition-all" />
        </Button>
      </div>
    </div>
  );
}
