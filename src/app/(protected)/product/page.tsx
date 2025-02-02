import React from "react";
import { api, HydrateClient } from "@/trpc/server";

import { DataTable } from "@/app/_components/dataTable";

const page = async () => {
  const product = await api.product.getAll();
  return (
    <HydrateClient>
      <div className="container mx-auto">
        <DataTable entityName={"product"} inputName={"Name"} data={product} />
      </div>
    </HydrateClient>
  );
};

export default page;
