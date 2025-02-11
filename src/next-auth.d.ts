import NextAuth, { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  isVerified: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    isVerified?: boolean;
  }
}
