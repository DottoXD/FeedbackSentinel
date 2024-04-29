import Link from "next/link";
import { BiError } from "react-icons/bi";

export default function NotFound() {
  return (
    <div className="error">
      <h1 className="special">
        Internal server error! <BiError />
      </h1>
      <p>There was an unknown error on our servers, try going back!</p>
      <Link href="/">
        <button>Go back!</button>
      </Link>
    </div>
  );
}
