import { addUser } from '@mktcodelib/github-insights';
import { useState } from 'react';

export default function AddUser() {
  const [username, setUsername] = useState("");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <button
        className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
        onClick={() => addUser(username)}
      >
        <h3 className="text-2xl font-bold">Add user</h3>
      </button>
    </div>
  );
}
