import { useSession, signIn, signOut } from "next-auth/react"

export default function ConnectGithub() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <>
        {session.user?.image && (
          <img src={session.user.image} alt="Avatar" className="w-6 h-6 rounded-full mr-3" />
        )}
        <button onClick={() => signOut()}>sign out</button>
      </>
    )
  }

  return <button onClick={() => signIn()}>Connect</button>
}