import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn("google")}>Sign in</button>
      </>
    );
  }
  return (
    <div className="bg-blue-900 min-h-screen">
      <Nav />
      Signed in as {session.user.email} <br />
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
