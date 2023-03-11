import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { config } from "@/utils/serverside";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login'
  },
  jwt: {
    // maxAge: 60 * 60 * 24 * 30,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const [username, password] = config.login;

        if (!credentials) {
          return null;
        }

        if (username === credentials.username && password === credentials.password) {
          return { id: '1', name: username };
        }

        return null
      }
    })
  ],
}

export default NextAuth(authOptions)
