"use client";

import { api } from "@/trpc/react";
import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import other add forms here...

export function SelectForm({
  placeholder,
  type,
}: {
  placeholder: string;
  type:
    | "ProductGroup"
    | "Supplier"
    | "ProductVariant"
    | "Address"
    | "Warehouse"
    | "Customer";
}) {
  const { data, isLoading } =
    type === "ProductGroup"
      ? api.productGroup.getAll.useQuery()
      : type === "Supplier"
        ? api.supplier.getAll.useQuery()
        : type === "ProductVariant"
          ? api.productVariant.getAll.useQuery()
          : type === "Address"
            ? api.address.getAll.useQuery()
            : api.warehouse.getAll.useQuery();

  // Dynamically set the create form

  return (
    <Select>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {/* Data Loading & Selection */}
        {isLoading ? (
          <SelectItem value="" disabled>
            Loading...
          </SelectItem>
        ) : data && data.length > 0 ? (
          data.map((item) => {
            // Extract ID
            const id = item.id?.toString(); // Ensure ID is a string

            // Determine `name` field based on `type`
            let name = "Unnamed"; // Default value

            switch (type) {
              case "ProductGroup":
                name = item.name ?? "Unnamed";
                break;
              case "ProductVariant":
                name = item.sku ?? "Unnamed";
                break;
              case "Supplier":
                name = item.code ?? "Unnamed";
                break;
              case "Address":
                name = item.fullAddress ?? "Unnamed";
                break;
              case "Warehouse":
                name = item.code ?? "Unnamed";
                break;
            }

            return (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            );
          })
        ) : (
          <SelectItem value="novalue" disabled>
            No items available
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
