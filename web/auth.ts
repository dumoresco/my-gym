/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInSchema } from "@/app/schemas/auth.schema";
import NextAuth, { User as NextAuthUser, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

interface User extends NextAuthUser {
  accessToken?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken?: string;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      type: "credentials",

      authorize: async (credentials) => {
        const { success, data } = signInSchema.safeParse(credentials);
        if (!success) {
          return null;
        }

        const { email, password } = data;

        try {
          const response = await axios.post(
            "https://my-gym-jyqhaxpokq-uc.a.run.app/api/sign-in",
            {
              email,
              password,
            }
          );

          return {
            id: response.data.id,
            email: response.data.email,
            name: response?.data?.name,
            accessToken: response.data.accessToken,
          };
        } catch {}

        return null;
      },
      id: "credentials",
      name: "Credentials",
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: User }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      session.user.id = token.id as string;
      session.user.accessToken = token.accessToken;

      return session;
    },
  },
});
