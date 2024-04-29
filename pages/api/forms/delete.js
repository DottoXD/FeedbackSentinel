import { unstable_getServerSession } from "next-auth/next";
import { AuthOptions } from "../auth/[...nextauth]";
import Client from "../../../lib/mongodb";

export default async function Create(Request, Response) {
  if (Request.method !== "POST")
    return Response.status(405).json({ error: "Method not allowed!" });
  const Body = JSON.parse(Request.body);
  const Session = await unstable_getServerSession(
    Request,
    Response,
    AuthOptions
  );

  if (Session.user.id !== Body.user)
    return Response.status(401).json({ error: "Unauthorized!" });

  const Collection = Client.db("feedbacksentinel").collection("users");
  const FormsCollection = Client.db("feedbacksentinel").collection("forms");

  let Data = Collection.find({ id: Session.user.id });

  let UserForms;

  await Data.forEach((Result) => {
    UserForms = Result.forms;
    Data = Result;
  });

  let Found = false;
  UserForms.forEach((Form) => {
    if (Form.id === Body.id) {
      const Index = UserForms.indexOf(Form);
      UserForms.splice(Index, 1);
      Found = true;
    }
  });

  if (Found === false)
    return Response.status(404).json({ error: "Form not found!" });

  const NewUserData = {
    id: Data.id,
    username: Data.username,
    forms: UserForms,
    plan: Data.plan,
    formslimit: Data.formslimit,
    banned: Data.banned,
  };

  Collection.updateOne({ id: Session.user.id }, { $set: NewUserData });
  FormsCollection.deleteOne({ id: Body.id });

  return Response.status(200).json({ success: "Form deleted!" });
}
