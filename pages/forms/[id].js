import Client from "../../lib/mongodb";
import Link from "next/link";

export default function Form({ FormObj }) {
  if (!FormObj) {
    return (
      <div className="container">
        <h1 className="special">Form not found!</h1>
        <p>
          We could not find this form... are you sure you put the correct ID?
        </p>
        <Link href="/">
          <button>Go back!</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="special">{FormObj.name}</h1>
      <p>Form ID: {FormObj.id}</p>
      {FormObj.data.map((Question) => {
        if(Question.type === "open-ended-question") return (
          <div key={Question.id}>
            <p>{Question.text}</p>
            <input type="text" required maxLength="500" minLength="5" />
          </div>
        );
      })}
    </div>
  );
}

export async function getServerSideProps(context) {
  const Collection = Client.db("feedbacksentinel").collection("forms");
  const Data = Collection.find({ id: context.query.id });

  let FormObj = {};
  await Data.forEach((Result) => {
    FormObj.id = Result.id;
    FormObj.name = Result.name;
    FormObj.user = Result.user;
    FormObj.data = Result.data;
  });

  console.log(FormObj.data)
  if (!FormObj.id) FormObj = null;

  return {
    props: {
      FormObj,
    },
  };
}
