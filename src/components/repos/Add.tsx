import { addRepo } from "~/db";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "../base/Button";
import Input from "../base/Input";

export default function AddUser() {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");

  function handleAddRepo() {
    setOwner("");
    setName("");
    addRepo({ owner, name }).catch((err) => console.log(err));
  }

  return (
    <div className="flex w-full">
      <Input
        value={owner}
        setValue={setOwner}
        placeholder="Owner"
        className="rounded-r-none"
      />
      <Input
        value={name}
        setValue={setName}
        placeholder="Repository"
        className="rounded-l-none"
      />

      <div className="ml-3">
        <Button onClick={handleAddRepo}>
          <PlusSmallIcon className="h-6 w-6 text-violet-700 transition-all group-hover:text-violet-100" />
        </Button>
      </div>
    </div>
  );
}
