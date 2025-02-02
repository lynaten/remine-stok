"use client";
import { useRouter } from "next/navigation";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DataTableCreateOption from "./dataTableCreateOption";
import { DataTablePagination } from "./dataTablePagination";
import { DataTableViewOptions } from "./dataTableViewOptions";
import { DataTableFilterOptions } from "./dataTableFilterOptions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableColumnHeader } from "./columnHeader";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/* ----------------------------------- *
 * 1) Filter Functions
 * ----------------------------------- */

// Case-insensitive substring match:
function includesString<TData>(
  row: { getValue: (columnId: string) => any },
  columnId: string,
  filterValue: string,
) {
  const rowValue = String(row.getValue(columnId) ?? "").toLowerCase();
  return rowValue.includes(filterValue.toLowerCase());
}

// Case-sensitive substring match:
function includesStringSensitive<TData>(
  row: { getValue: (columnId: string) => any },
  columnId: string,
  filterValue: string,
) {
  const rowValue = String(row.getValue(columnId) ?? "");
  return rowValue.includes(filterValue);
}

// Number range:
function inNumberRange<TData>(
  row: { getValue: (columnId: string) => any },
  columnId: string,
  filterValue: { min?: number; max?: number },
) {
  const val = Number(row.getValue(columnId));
  // If not a valid number, exclude the row
  if (Number.isNaN(val)) {
    return false;
  }
  const { min, max } = filterValue;
  if (typeof min === "number" && val < min) {
    return false;
  }
  if (typeof max === "number" && val > max) {
    return false;
  }
  return true;
}

// Date range:
function dateRange<TData>(
  row: { getValue: (columnId: string) => any },
  columnId: string,
  range: { from: Date | null; to: Date | null },
) {
  const dateVal = new Date(row.getValue(columnId));
  if ((range.from || range.to) && isNaN(dateVal.getTime())) {
    // If there is a range but this cell isn't a valid date, exclude it
    return false;
  }
  const { from: start, to: end } = range;

  // Adjust `end` to include the entire day
  const adjustedEnd = end ? new Date(end.setHours(23, 59, 59, 999)) : null;

  if (start && !adjustedEnd) {
    return dateVal >= start;
  } else if (!start && adjustedEnd) {
    return dateVal <= adjustedEnd;
  } else if (start && adjustedEnd) {
    return dateVal >= start && dateVal <= adjustedEnd;
  }

  // No range specified
  return true;
}

/* ----------------------------------- *
 * 2) Detecting "type" and building columns
 * ----------------------------------- */

function detectColumnType(
  value: unknown,
  allValues: unknown[],
): "number" | "date" | "string" | "enum" | "none" {
  // If value is parseable as a date:
  if (value instanceof Date) {
    return "date";
  }

  // If it's a valid number
  if (typeof value === "number") {
    return "number";
  }

  // If it's a string that only has a small set of repeated values across the entire dataset,
  // we might treat it as an "enum":
  if (typeof value === "string") {
    const uniqueValues = Array.from(new Set(allValues));
    // (Heuristic) if there are fewer than ~10 unique values, call it an enum:
    if (uniqueValues.length > 1 && uniqueValues.length <= 10) {
      return "enum";
    }
    return "string";
  }
  // fallback
  return "none";
}

function generateColumns<TData extends Record<string, any>>({
  data,
  entityName,
  router,
}: {
  data: TData[];
  entityName: string;
  router: AppRouterInstance;
}): ColumnDef<TData>[] {
  if (!data.length) return [];
  const dynamicColumns: ColumnDef<TData>[] = [
    // ... optionally a "select" column here ...
  ];
  dynamicColumns.push({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  });
  // We'll use the first row's keys for column detection
  const sample = data[0];
  const keys = Object.keys(sample);
  keys.forEach((key) => {
    if (key === "id") {
      return;
    }
    // All values for this key across the dataset:
    const allValues = data.map((row) => row[key]);
    const colType = detectColumnType(sample[key], allValues);
    if (colType === "none") {
      return;
    }

    // We’ll choose the filterFn and meta based on colType
    let filterFn: string;
    let meta: { filterType: string; filterOptions?: any[] } = {
      filterType: colType,
    };

    switch (colType) {
      case "number":
        filterFn = "inNumberRange";
        break;

      case "date":
        filterFn = "dateRange";
        break;

      case "enum":
        // For an enum, we do a case-sensitive filter and also gather unique options
        filterFn = "includesStringSensitive";
        // Convert to Set, back to array for unique values
        const uniqueEnumValues = Array.from(new Set(allValues));
        meta = {
          filterType: "enum",
          filterOptions: uniqueEnumValues,
        };
        break;

      case "string":
      default:
        filterFn = "includesString";
        break;
    }

    dynamicColumns.push({
      accessorKey: key,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={key} />
      ),
      filterFn,
      meta,
      cell: ({ row }) => {
        const rawValue = row.getValue(key);

        // Optional: date/number formatting
        if (colType === "date") {
          const d = new Date(rawValue);
          return isNaN(d.getTime()) ? (
            <span>Invalid date</span>
          ) : (
            <span>{d.toLocaleDateString()}</span>
          );
        } else if (colType === "number") {
          return <span>{Number(rawValue).toLocaleString()}</span>;
        }
        return <span>{String(rawValue)}</span>;
      },
    });
  });

  // Add an "actions" dropdown column
  dynamicColumns.push({
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                console.log(rowData);
                const route = `/${entityName}/${rowData.id}`;
                router.push(route);
              }}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  });

  return dynamicColumns;
}

/* ----------------------------------- *
 * 3) The Generic DataTable Component
 * ----------------------------------- */

interface DataTableProps<TData extends object> {
  data: TData[];
  /** If you want custom columns, pass them. Otherwise columns are generated. */
  columns?: ColumnDef<TData>[];
}

export function DataTable<TData extends object>({
  data,
  columns,
  entityName,
  inputName,
}: DataTableProps<TData> & {
  entityName: string;
  inputName: string;
}) {
  const router = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // If columns aren't provided, generate them from the data:
  const finalColumns = React.useMemo(() => {
    if (columns && columns.length > 0) return columns;
    return generateColumns({ data, entityName, router });
  }, [columns, data]);

  // Create the table
  const table = useReactTable({
    data,
    columns: finalColumns,

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Our named filter functions (matching the strings we used above):
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    filterFns: {
      dateRange,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-end py-4">
        <DataTableCreateOption
          inputName={inputName}
          entityName={entityName}
        ></DataTableCreateOption>
        <DataTableFilterOptions table={table} />
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* Fallback if no rows */}
                <TableCell
                  colSpan={finalColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
