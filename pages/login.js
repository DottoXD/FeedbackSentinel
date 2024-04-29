import { useSession, signIn, getProviders } from "next-auth/react";
import Router from "next/router";

export default function Login({ Providers }) {
  const { data: Session } = useSession();
  if (Session) {
    Router.push("/dashboard");
  } else {
    return (
      <div className="container">
        <h1 className="special">Login</h1>
        <p>
          FeedbackSentinel uses multiple external authentication providers just
          so you don&apos;t have to create another password!
        </p>
        <div className="main-buttons">
          <>
            {Object.values(Providers).map((Provider) => (
              <div key={Provider.name}>
                <button onClick={() => signIn(Provider.id)}>
                  Sign in with {Provider.name}
                </button>
              </div>
            ))}
          </>
        </div>
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const Providers = await getProviders();
  return {
    props: { Providers },
  };
}
