import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Layout({ children }) {
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
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mg-2 rounded-lg p-4">
        {/* Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button> */}
        {children}
      </div>
    </div>
  );
}
