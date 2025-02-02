import React from "react";
import { HydrateClient } from "@/trpc/server";
import { api } from "@/trpc/server";

const Page = async ({ params }: { params: { productId: string } }) => {
  // ✅ Ensure params exist before using productId
  if (!params?.productId) {
    return <h1>Error: Missing Product ID</h1>;
  }

  const { productId } = await params; // Ensures proper decoding

  try {
    const [product, productGroups] = await Promise.all([
      api.product.getOneById({ id: productId }),
      api.productGroup.getAll(),
    ]);

    return (
      <HydrateClient>
        <h1>Product ID: {productId}</h1>
        {product ? (
          <pre>{JSON.stringify(product, null, 2)}</pre>
        ) : (
          <p>Product not found</p>
        )}
      </HydrateClient>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return <h1>Error loading product details</h1>;
  }
};

export default Page;
