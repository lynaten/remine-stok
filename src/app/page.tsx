import Link from "next/link";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { Navbar } from "./_components/navbar";
export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      {session && session.user.isVerified && <Navbar></Navbar>}
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-[#fffc60] to-[#cecb2e]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Re:mine <span className="text-[rgb(238,68,146)]">Stock</span> App
          </h1>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              {!session?.user.isVerified && session && (
                <p className="text-center text-2xl text-white">
                  Your account has not been verified. Please contact the
                  administrator to complete the verification process.
                </p>
              )}
              {session && session.user.isVerified ? (
                <Link
                  href={"/form/modify"}
                  className="rounded-full bg-[#ee4492] px-10 py-3 font-semibold no-underline transition hover:bg-[#ea7daf]/70"
                >
                  <span className="text-[rgb(232,230,32)]">Update Stock</span>
                </Link>
              ) : (
                <div>
                  <p className="text-center text-2xl text-white">
                    {session && <span>Logged in as {session.user?.name}</span>}
                  </p>
                  <Link
                    href={session ? "/api/auth/signout" : "/api/auth/signin"}
                    className="rounded-full bg-[#ee4492] px-10 py-3 font-semibold no-underline transition hover:bg-[#ea7daf]/70"
                  >
                    <span className="text-[rgb(232,230,32)]">
                      {session ? "Sign out" : "Sign in"}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
