import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";

export default function Index() {
  return (
    <div className="container">
      <h1 className="special">
        Feedback<span className="optional">, suggestions and reviews</span>
        <span className="underlined"> at your fingertips.</span>
      </h1>
      <p>
        Create custom forms and find out how to improve your product with your
        customers&apos; reviews!
      </p>
      <div className="main-buttons">
        <Link href="/login">
          <button>
            Get started for free! <BsArrowRight />
          </button>
        </Link>
      </div>
    </div>
  );
}
