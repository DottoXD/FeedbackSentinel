import DiscordProvider from "next-auth/providers/discord";

import NextAuth from "next-auth";
import Client from "../../../lib/mongodb";

export const AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      authorization: { params: { scope: "identify" } },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    signIn: async ({ user }) => {
      const Collection = Client.db("feedbacksentinel").collection("users");
      Collection.find({ id: user.id }).toArray(function (Error, Result) {
        if (Result.length === 0) {
          Collection.insertOne({
            id: user.id,
            username: user.name,
            forms: [],
            plan: "free",
            formslimit: 2,
            banned: false,
          });
        }
      });
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(AuthOptions);
