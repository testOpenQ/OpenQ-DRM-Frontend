import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"

export default function ConnectGithub() {
  const { data: session, status } = useSession()

  function handleSignIn() {
    signIn()
  }

  function handleSignOut() {
    signOut()
  }

  if (status === "authenticated") {
    return (
      <>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Avatar"
            className="rounded-full mr-3"
            width={24}
            height={24}
          />
        )}
        <button onClick={handleSignOut}>sign out</button>
      </>
    )
  }

  return <button onClick={handleSignIn}>Connect</button>
}