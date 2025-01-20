import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      isVerified: boolean;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    async session({ session, user }) {
      // Fetch the latest user data from the database
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
      });

      // Ensure the user exists in the database
      if (dbUser) {
        // Include the isVerified status in the session
        session.user = {
          ...session.user,
          id: user.id,
          isVerified: dbUser.isVerified,
        };
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the landing page after sign in or sign out
      if (url === "/api/auth/signin" || url === "/api/auth/signout") {
        return baseUrl; // Redirect to the base URL (landing page)
      }
      return url; // Allow other redirects to proceed
    },
  },

  theme: {
    colorScheme: "auto", // Can be "auto", "dark", or "light"
    logo: "/remine.png", // Custom logo (optional)
    brandColor: "#ee4492",
    buttonText: "#e8e620",
  },
} satisfies NextAuthConfig;
