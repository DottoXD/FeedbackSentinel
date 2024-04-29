import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { AiOutlineLoading } from "react-icons/ai";
import React from "react";

export default function Delete() {
  const Router = useRouter();
  const { data: Session } = useSession();

  const [ErrorText, SetErrorText] = React.useState(null);
  const [Button, SetButton] = React.useState(<button onClick={DeleteForm}>Delete form</button>);
  const { id } = Router.query;

  function DeleteForm() {
    const Data = {
      id: id,
      user: Session.user.id,
    };

    SetButton(<button style={{ marginBottom: "120px", disabled: true }} type="submit" disabled><AiOutlineLoading className="loading"/></button>);

    fetch("/api/forms/delete", {
      method: "POST",
      body: JSON.stringify(Data),
    }).then((Response) => {
      if (Response.status !== 200) {
        Response.json().then((Json) => DisplayError(Json.error));
        SetButton(<button onClick={DeleteForm}>Delete form</button>);
      } else {
        Router.push("/dashboard/forms");
      }
    });
  }

  function DisplayError(Error) {
    SetErrorText(Error);
  }

  return (
    <div className="container">
      <h1 className="special">Delete form</h1>
      {ErrorText}
      <p>
        Are you sure that you want to delete this form? This action is
        irreversible.
      </p>
      {Button}
    </div>
  );
}
