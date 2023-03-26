import { useSession, signIn, signOut } from "next-auth/react"

export default function ConnectGithub() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <>
        <p>Signed in as {session.user?.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return <button onClick={() => signIn()}>Sign in</button>
}