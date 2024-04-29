import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";

export default function NotFound() {
  return (
    <div className="error">
      <h1 className="special">
        Not found! <AiOutlineSearch />
      </h1>
      <p>We got you, just click the button below to go back!</p>
      <Link href="/">
        <button>Go back!</button>
      </Link>
    </div>
  );
}
