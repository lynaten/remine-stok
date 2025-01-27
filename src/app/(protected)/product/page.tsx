import React from "react";
import { HydrateClient } from "@/trpc/server";
const page = async () => {
  return <HydrateClient>product </HydrateClient>;
};

export default page;
