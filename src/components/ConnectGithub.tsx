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
        <button
          onClick={handleSignOut}
          className="flex items-center rounded-lg px-3 py-1 transition-all hover:bg-white/5"
        >
          sign out
        </button>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Avatar"
            className="ml-3 rounded-full"
            width={24}
            height={24}
          />
        )}
      </>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center rounded-lg px-3 py-1 transition-all hover:bg-white/5"
    >
      Connect
    </button>
  );
}
