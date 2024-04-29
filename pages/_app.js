import { Router } from "next/router";
import NProgress from "nprogress";

import { SessionProvider } from "next-auth/react";

import Navbar from "../components/navbar";

import "../styles/nprogress.css";
import "../styles/dashboard.css";
import "../styles/navbar.css";
import "../styles/globals.css";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});

export default function FeedbackSentinel({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <div className="feedbacksentinel">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
