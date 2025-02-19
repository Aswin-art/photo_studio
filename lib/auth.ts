import NextAuth from "next-auth";
import { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { db } from "./db";

export const authOptions = {
  debug: true,
  session: {
    strategy: "jwt" as SessionStrategy
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) {
          throw new Error("Missing credentials");
        }

        const user = await db.users.findFirst({
          where: { email: email }
        });

        if (!user) return null;

        const isValidPassword = await bcryptjs.compare(password, user.password);

        if (!isValidPassword) return null;

        return {
          id: user.id.toString(),
          email: user.email
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.sub || "",
          email: token.email || "",
          name: token.name,
          emailVerified: null
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    }
  },
  secret: process.env.AUTH_SECRET
};

export default NextAuth(authOptions);
