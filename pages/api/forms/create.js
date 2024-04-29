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

  let UsedForms;
  let MaxForms;

  await Data.forEach((Result) => {
    Data = Result;
    UsedForms = Result.forms.length;
    MaxForms = Result.formslimit;
  });

  if (UsedForms === MaxForms)
    return Response.status(401).json({
      error: "Unauthorized - Max amount of forms used!",
    });

  const FormsArray = Data.forms;
  FormsArray.push(Body);

  const NewUserData = {
    id: Data.id,
    username: Data.username,
    forms: FormsArray,
    plan: Data.plan,
    formslimit: Data.formslimit,
    banned: Data.banned,
  };

  const FormBody = {
    id: Body.id,
    user: Body.user,
    name: Body.name,
    data: Body.data,
  };

  Collection.updateOne({ id: Session.user.id }, { $set: NewUserData });
  FormsCollection.insertOne(FormBody);

  return Response.status(200).json({ success: "Form created!" });
}
