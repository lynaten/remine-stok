import React from "react";
import { HydrateClient } from "@/trpc/server";
const page = async () => {
  return <HydrateClient>dashboard</HydrateClient>;
};

export default page;
