import React from "react";
import { HydrateClient } from "@/trpc/server";
const page = async () => {
  return <HydrateClient>repack order</HydrateClient>;
};

export default page;
