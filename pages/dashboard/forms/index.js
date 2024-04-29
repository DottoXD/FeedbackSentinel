import { unstable_getServerSession } from "next-auth/next";
import { AuthOptions } from "../../api/auth/[...nextauth]";
import Client from "../../../lib/mongodb";
import Link from "next/link";

export default function Forms({ Forms }) {
  const FormData = () => {
    if (Forms.length === 0) {
      return (
        <div>
          <p>You currently have no forms. Try creating one, it's cool!</p>
          <Link href="/dashboard/create">
            <button>Create a form!</button>
          </Link>
        </div>
      );
    } else {
      return (
        <>
          {Forms.map((Form) => {
            return (
              <div className="action" key={Form.id}>
                <p>{Form.name}</p>
                <Link href={`/forms/${Form.id}`}>
                  <button className="smaller">View form</button>
                </Link>
                <Link href={`/dashboard/forms/edit/${Form.id}`}>
                  <button className="smaller">Edit form</button>
                </Link>
                <Link href={`/dashboard/forms/delete/${Form.id}`}>
                  <button className="smaller">Delete form</button>
                </Link>
              </div>
            );
          })}
        </>
      );
    }
  };

  return (
    <div className="container">
      <h1 className="special">My forms</h1>
      <p>Can't see your recently created form? Reload the page!</p>
      <FormData />
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const Session = await unstable_getServerSession(req, res, AuthOptions);
  const Collection = Client.db("feedbacksentinel").collection("users");
  const Data = Collection.find({ id: Session.user.id });
  let Forms;

  await Data.forEach((Result) => {
    Forms = Result.forms;
  });

  return {
    props: {
      Forms,
    },
  };
}
