import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/server/db";
import { getUserById, createUser } from "../helper";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Attempt to retrieve the existing user from the database
      const existingUser = await getUserById(user.id);

      if (!existingUser && user.id && user.name) {
        const randomUUID = () => crypto.randomUUID();

        await createUser({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          hashedPassword: null,
          isVerified: false,
          emailVerified: null,
          accountId: randomUUID(),
          type: account?.type,
          provider: account?.provider,
          providerAccountId: account?.providerAccountId,
          refresh_token: account?.refresh_token,
          access_token: account?.access_token,
          expires_at: account?.expires_at,
          token_type: account?.token_type,
          scope: account?.scope,
          id_token: account?.id_token,
          session_state: null,
          refresh_token_expires_in: null,
        });
        return false;
      }

      if (!user.id || !user.name) {
        return false;
      }

      // User exists, check if they are verified
      if (existingUser && !existingUser.isVerified) {
        // User is not verified, prevent sign-in
        return false;
      }

      // User exists and is verified, allow sign-in
      return true;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.isVerified && session.user) {
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub && token.email != null) return token;
      const user = await getUserById(token.sub);
      if (!user) return token;
      token.isVerified = user?.isVerified;
      return token;
    },
  },
  adapter: PrismaAdapter(db),

  theme: {
    colorScheme: "auto", // Can be "auto", "dark", or "light"
    logo: "/remine.png", // Custom logo (optional)
    brandColor: "#ee4492",
    buttonText: "#e8e620",
  },
} satisfies NextAuthConfig;
