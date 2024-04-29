import { BiUser } from "react-icons/bi";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar">
      <nav>
        <ul>
          <li></li>
          <li>
            <Link href="/pricing">
              <button>Pricing</button>
            </Link>
          </li>
          <li className="middle">
            <Link href="/dashboard">
              <button>Dashboard</button>
            </Link>
          </li>
          <li className="optional">
            <Link href="/demo">
              <button>Demo</button>
            </Link>
          </li>
          <li className="right">
            <Link href="/login">
              <button>
                <BiUser />
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
