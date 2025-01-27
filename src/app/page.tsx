import Link from "next/link";

import { HydrateClient } from "@/trpc/server";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <HydrateClient>
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <h1 className="text-center text-5xl font-bold">
          Re:mine Inventory App
        </h1>
        <br></br>
        <div>
          <Button className="m-2">
            <Link href={"/auth/login"}>Sign In</Link>
          </Button>
        </div>
      </div>
    </HydrateClient>
  );
}
