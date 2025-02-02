import React from "react";
import { HydrateClient } from "@/trpc/server";
const page = async () => {
  return <HydrateClient>Adjustment Order</HydrateClient>;
};

export default page;
