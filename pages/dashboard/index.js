import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { AuthOptions } from "../api/auth/[...nextauth]";
import { FaBookMedical, FaAddressBook } from "react-icons/fa";
import Client from "../../lib/mongodb";
import Router from "next/router";
import Link from "next/link";

export default function Dashboard({ Plan, UsedForms, MaxForms }) {
  const { data: Session } = useSession();
  switch (Session) {
    case undefined:
      return (
        <div className="container">
          <h1 className="special">Oops!</h1>
          <p>There was an error while processing your request!</p>
          <button onClick={() => Router.push("/")}>Go back</button>
        </div>
      );
    case null:
      return (
        <div className="container">
          <h1 className="special">Oops!</h1>
          <p>Invalid session!</p>
          <button onClick={() => Router.push("/")}>Go back</button>
        </div>
      );
    default:
      return (
        <div className="container">
          <h1 className="special">Dashboard</h1>
          <p>
            Hey, {Session.user.name}! You are currently using {UsedForms} out of{" "}
            {MaxForms} forms! ({Plan} plan)
          </p>
          <div className="actions">
            <Link href="/dashboard/create">
              <div className="action">
                <FaBookMedical />
                <h2 className="special">Create a new form</h2>
              </div>
            </Link>
            <Link href="/dashboard/forms">
              <div className="action">
                <FaAddressBook />
                <h2 className="special">My forms</h2>
              </div>
            </Link>
          </div>
        </div>
      );
  }
}

export async function getServerSideProps({ req, res }) {
  const Session = await unstable_getServerSession(req, res, AuthOptions);
  const Collection = Client.db("feedbacksentinel").collection("users");

  let Plan;
  let UsedForms = 0;
  let MaxForms = 3;

  const Data = Collection.find({ id: Session.user.id });
  await Data.forEach((Result) => {
    Plan = Result.plan;
    UsedForms = Result.forms.length;
    MaxForms = Result.formslimit;
  });

  return {
    props: {
      Plan,
      UsedForms,
      MaxForms,
    },
  };
}
