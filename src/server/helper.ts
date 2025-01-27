import { db } from "./db";

export const getUserById = async (userId: string | undefined) => {
  if (userId === undefined) {
    return null;
  }
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch {
    return null;
  }
};

import { randomUUID } from "crypto";

export const createUser = async ({
  id,
  name,
  email,
  image,
  hashedPassword,
  isVerified,
  emailVerified,
  accountId,
  type,
  provider,
  providerAccountId,
  refresh_token,
  access_token,
  expires_at,
  token_type,
  scope,
  id_token,
  session_state,
  refresh_token_expires_in,
}: {
  id: string;
  name: string;
  email?: string | null;
  image?: string | null;
  hashedPassword?: string | null;
  isVerified: boolean;
  emailVerified?: boolean | null;
  accountId: string;
  type?: string;
  provider?: string;
  providerAccountId?: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  refresh_token_expires_in?: number | null;
}) => {
  try {
    // Create the user in the database
    const newUser = await db.user.create({
      data: {
        id,
        name,
        email,
        hashedPassword,
        isVerified,
        emailVerified,
        image,
        accounts: {
          create: {
            id: accountId,
            type: type || "",
            provider: provider || "",
            providerAccountId: providerAccountId || "",
            refresh_token,
            access_token,
            expires_at,
            token_type,
            scope,
            id_token,
            session_state,
            refresh_token_expires_in,
          },
        },
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};
