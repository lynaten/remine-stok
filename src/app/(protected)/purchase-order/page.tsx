import React from "react";
import { HydrateClient } from "@/trpc/server";
const page = async () => {
  return <HydrateClient>purchase order</HydrateClient>;
};

export default page;
