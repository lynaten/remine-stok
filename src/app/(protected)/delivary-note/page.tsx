import React from "react";
import { HydrateClient } from "@/trpc/server";
const page = async () => {
  return <HydrateClient>delivary note</HydrateClient>;
};

export default page;
