import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

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
      <>
        <div
          onClick={handleSignOut}
          className="cursor-pointer px-3 py-2 transition-all hover:bg-gray-900"
        >
          sign out
        </div>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Avatar"
            className="mx-3 rounded-full"
            width={24}
            height={24}
          />
        )}
      </>
    );
  }

  return (
    <div
      onClick={handleSignIn}
      className="cursor-pointer px-3 py-2 transition-all hover:bg-gray-900"
    >
      Connect to GitHub
    </div>
  );
}
