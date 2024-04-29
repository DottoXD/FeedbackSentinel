import { useSession, signOut } from "next-auth/react";
import Router from "next/router";

export default function Logout() {
  const { data: Session } = useSession();
  if (!Session) {
    return (
      <div className="container">
        <h1 className="special">Logout</h1>
        <p>You cannot logout because you are not logged in.</p>
        <div className="main-buttons">
          <button onClick={() => Router.push("/")}>Go back</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <h1 className="special">Logout</h1>
        <p>Are you sure that you want to logout?</p>
        <div className="main-buttons">
          <button onClick={() => signOut()}>Logout</button>
        </div>
      </div>
    );
  }
}
