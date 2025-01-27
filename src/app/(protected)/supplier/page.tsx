import React from "react";
import { HydrateClient } from "@/trpc/server";
const page = async () => {
  return <HydrateClient>supplier</HydrateClient>;
};

export default page;
