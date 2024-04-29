import React from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineQuestion, AiOutlineLoading } from "react-icons/ai";
import { IoIosRadioButtonOff } from "react-icons/io";

export default function Create() {
  const { data: Session } = useSession();

  const [State, SetState] = React.useState({
    name: "",
  });
  
  const [ErrorText, SetErrorText] = React.useState(null);
  const [QuestionNumber, SetQuestionNumber] = React.useState(1);
  const [FormQuestions, SetFormQuestions] = React.useState([]);
  const [Components, SetComponents] = React.useState([]);
  const [Button, SetButton] = React.useState(<button style={{ marginBottom: "120px" }} type="submit">Create form!</button>);

  function FormSubmit(Data) {
    let FormName;

    Data.preventDefault();
    for (let [key, value] of Object.entries(State)) {
      if (key === "name") FormName = value;
    }

    if (!FormName) return;

    const Id = uuidv4();
    const FinalData = {
      id: Id,
      user: Session.user.id,
      name: FormName,
      data: FormQuestions,
    };

    SetButton(<button style={{ marginBottom: "120px", disabled: true }} type="submit" disabled><AiOutlineLoading className="loading"/></button>);

    fetch("/api/forms/create", {
      method: "POST",
      body: JSON.stringify(FinalData),
    }).then((Response) => {
      if (Response.status !== 200) {
        Response.json().then((Json) => DisplayError(Json.error));
        SetButton(<button style={{ marginBottom: "120px" }} type="submit">Create form!</button>);
      } else {
        Router.push("/dashboard/forms");
      }
    });
  }

  function DisplayError(Error) {
    SetErrorText(Error);
  }

  function FormChange(Data) {
    if(Data.target.name === "name") return SetState({ ...State, [Data.target.name]: Data.target.value });

    if(Data.target.name === "open-ended-question") {
      const TempArray = FormQuestions;
      let End = false;
      for(const Question of TempArray) {
        if(Question.id === Data.target.id) {
          End = true;
          TempArray.splice(FormQuestions.indexOf(Question), 1);
          TempArray.push({
            id: Data.target.id,
            type: "open-ended-question",
            text: Data.target.value,
          })
        }
      }
      if(!End) TempArray.push({
        id: Data.target.id,
        type: "open-ended-question",
        text: Data.target.value,
      })
      SetFormQuestions(TempArray);
    }
  }

  function AddOpenEndedQuestion() {
    SetComponents([
      ...Components,
      <input
        type="text"
        required
        maxLength="500"
        minLength="5"
        placeholder="Open ended question"
        onChange={FormChange}
        id={QuestionNumber}
        name="open-ended-question"
        key={QuestionNumber}
      />,
    ]);
    SetQuestionNumber(QuestionNumber + 1);
  }

  function AddMultipleChoiceQuestion() {
    SetComponents([
      ...Components,
      <MultipleChoiceQuestion onChange={FormChange} id={QuestionNumber} />,
    ]);
    SetQuestionNumber(QuestionNumber + 1);
  }

  return (
    <div className="container">
      <h1 className="special">New form</h1>
      <div className="error">
        <p>{ErrorText}</p>
      </div>
      <form onSubmit={FormSubmit}>
        <input
          type="text"
          required
          maxLength="50"
          minLength="5"
          id="name"
          onChange={FormChange}
          name="name"
          placeholder="Form name"
        />
        <>
          {Components.map((Component) => {
            return Component;
          })}
        </>
        {Button}
      </form>
      <div className="toolbar">
        <button onClick={AddOpenEndedQuestion}>
          <AiOutlineQuestion /> Open-ended question
        </button>
        <button onClick={AddMultipleChoiceQuestion}>
          <IoIosRadioButtonOff /> Multiple choice question
        </button>
      </div>
    </div>
  );
}
