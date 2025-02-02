"use client";

import * as React from "react";
import { Table, Column } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";

// Example type used in column meta
type ColumnMeta = {
  filterType?: "string" | "number" | "enum" | "date";
  // For enum columns
  filterOptions?: string[];
};

// For date range filtering, store an object
type DateRangeValue = {
  from: Date;
  to?: Date;
};

interface DataTableFilterOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterOptions<TData>({
  table,
}: DataTableFilterOptionsProps<TData>) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedColumn, setSelectedColumn] = React.useState<Column<
    TData,
    unknown
  > | null>(null);

  // We store a temporary filter value for the currently selected column:
  // For "number" columns, we'll store { min?: string; max?: string }
  // For others, it might be a string, or a date range, etc.
  const [tempFilterValue, setTempFilterValue] = React.useState<any>("");

  // A helper to get columns that can be filtered:
  const filterableColumns = table.getAllColumns().filter((column) => {
    const meta = column.columnDef.meta as ColumnMeta | undefined;
    return meta && meta.filterType; // only if filterType is defined
  });

  function onSelectColumn(column: Column<TData, unknown>) {
    setSelectedColumn(column);

    // Initialize tempFilterValue from the column’s existing filter
    const currentVal = column.getFilterValue();
    // If there's no filter yet, we'll store "" or {} based on filterType
    setTempFilterValue(currentVal ?? "");
    setDialogOpen(true);
  }

  function handleApply() {
    if (selectedColumn) {
      // console.log("SELECTED COLUMN: ", selectedColumn);
      // console.log("DATE RANGE: ", tempFilterValue);

      // 🔍 Debug: Print all columns in the table
      // console.log(
      //   "All Columns: ",
      //   table.getAllColumns().map((col) => col.id),
      // );

      // 🔍 Try to get column explicitly
      const column = table.getColumn(selectedColumn.id);

      if (column) {
        column.setFilterValue(tempFilterValue);
      } else {
      }
    }
  }
  function handleReset() {
    if (selectedColumn) {
      selectedColumn.setFilterValue(undefined);
    }
    setTempFilterValue("");
  }

  function renderFilterInput() {
    if (!selectedColumn) return null;
    const meta = selectedColumn.columnDef.meta as ColumnMeta | undefined;
    if (!meta) return null;

    switch (meta.filterType) {
      case "string":
        return (
          <Input
            placeholder="Type to filter..."
            value={tempFilterValue ?? ""}
            onChange={(e) => setTempFilterValue(e.target.value)}
          />
        );

      case "number":
        console.log("TEMP FILTER VALUE: ", tempFilterValue);
        const min = tempFilterValue[0] ?? "";
        const max = tempFilterValue[1] ?? "";
        return (
          <div className="flex flex-col space-y-2">
            <Input
              type="number"
              placeholder="Min value"
              value={min}
              onChange={(e) =>
                setTempFilterValue((old: [number, number]) => [
                  parseFloat(e.target.value),
                  old?.[1],
                ])
              }
            />
            <Input
              type="number"
              placeholder="Max value"
              value={max}
              onChange={(e) =>
                setTempFilterValue((old: [number, number]) => [
                  old?.[0],
                  parseFloat(e.target.value),
                ])
              }
            />
          </div>
        );

      case "enum":
        if (!meta.filterOptions) {
          return <div>No options provided.</div>;
        }
        return (
          <Select
            value={tempFilterValue ?? ""}
            onValueChange={(val) => setTempFilterValue(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a value" />
            </SelectTrigger>
            <SelectContent>
              {meta.filterOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "date": {
        // For demonstration, let's do a quick date-range picker
        const dateRange = tempFilterValue as DateRangeValue | undefined;

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="pointer-events-auto w-auto p-0"
              align="start"
            >
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(selection) => {
                  // selection is { from?: Date; to?: Date }
                  setTempFilterValue(selection);
                }}
                numberOfMonths={1}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );
      }

      default:
        return null;
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>Filter columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {filterableColumns.length === 0 && (
            <div className="px-2 py-1 text-sm">No filterable columns</div>
          )}
          {filterableColumns.map((column) => {
            return (
              <AlertDialog
                key={column.id}
                open={dialogOpen && selectedColumn?.id === column.id}
                onOpenChange={setDialogOpen}
              >
                <AlertDialogTrigger onClick={() => onSelectColumn(column)}>
                  <DropdownMenuItem className="pointer-events-none cursor-pointer capitalize">
                    {column.id}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Filter: {selectedColumn?.id}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Set a filter for the selected column.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="space-y-4 py-2">{renderFilterInput()}</div>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => {
                        handleReset();
                        setDialogOpen(false);
                      }}
                    >
                      Reset
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        handleApply();
                        setDialogOpen(false);
                      }}
                    >
                      Apply
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
