import React from "react";
import { HydrateClient } from "@/trpc/server";
const page = async () => {
  return <HydrateClient>stock card</HydrateClient>;
};

export default page;
