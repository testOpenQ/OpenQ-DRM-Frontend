import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Button from "./base/Button";
import { PowerIcon } from "@heroicons/react/24/outline";

export default function ConnectGithub() {
  const { data: session, status } = useSession();

  function handleSignIn() {
    signIn("github").catch(console.error);
  }

  function handleSignOut() {
    signOut().catch(console.error);
  }

  if (status === "authenticated") {
    return (
      <div className="relative p-6">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Avatar"
            className="mx-auto rounded-full"
            width={96}
            height={96}
          />
        )}
        <div className="mt-3 text-center text-xl font-bold">
          {session.user?.name}
        </div>
        <div className="absolute top-0 right-0 p-3">
          <Button
            className="!bg-gray-800 text-opacity-20 hover:!bg-gray-700 hover:text-opacity-100"
            onClick={handleSignOut}
          >
            <PowerIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={handleSignIn}
      className="w-full justify-center rounded-none !px-6 !py-4 text-xl"
    >
      Connect to GitHub
    </Button>
  );
}
