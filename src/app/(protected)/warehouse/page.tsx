import React from "react";
import { HydrateClient } from "@/trpc/server";
const page = async () => {
  return <HydrateClient>warehouse</HydrateClient>;
};

export default page;
