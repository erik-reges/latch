import { cn } from "@/lib/utils";
import type { Vehicle } from "@latch/db/drizzle/auth-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { VehicleActions } from "./vehicle-actions";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

function SortingIcon({ column }: { column: any }) {
  return (
    <span
      className={cn(
        "ml-2 inline-block transition-colors",
        column.getIsSorted()
          ? "text-foreground"
          : "text-muted-foreground group-hover:text-foreground",
      )}
    >
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowUpDown className="h-4 w-4" />
      )}
    </span>
  );
}
export const columns: ColumnDef<Vehicle>[] = [
  {
    id: "actions",
    header: () => <div className="w-[50px]"></div>, // Empty header for actions column
    cell: ({ row }) => {
      const vehicle = row.original;
      return (
        <div className="flex justify-center">
          <VehicleActions vehicle={vehicle} />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div
        className={cn(
          "group", // add group class for hover coordination
          "flex flex-row items-center justify-center w-[125px] cursor-pointer select-none",
          "transition-colors",
          // text only changes on hover, not when sorted
          "text-muted-foreground hover:text-foreground",
        )}
        onClick={column.getToggleSortingHandler()}
      >
        <span>Make</span>
        <SortingIcon column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: ({ row }) => (
      <div
        className="flex max-w-[100px] truncate text-nowrap pl-3"
        title={row.getValue("name")}
      >
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <div
        className="flex flex-row items-center justify-center w-[125px] cursor-pointer select-none"
        onClick={column.getToggleSortingHandler()}
      >
        <span>Model</span>
        <SortingIcon column={column} />
      </div>
    ),
    sortingFn: "text",
    cell: ({ row }) => (
      <div
        className="flex max-w-[100px] truncate"
        title={row.getValue("model")}
      >
        {row.getValue("model")}
      </div>
    ),
  },
  {
    accessorKey: "maxSpeed",
    header: ({ column }) => (
      <div
        className="flex flex-row items-center justify-center w-[100px] cursor-pointer select-none"
        onClick={column.getToggleSortingHandler()}
      >
        Max speed
        <SortingIcon column={column} />
      </div>
    ),
    sortingFn: "alphanumeric",
    cell: ({ row }) => (
      <div className="flex max-w-[100px] truncate justify-center">
        {row.getValue("maxSpeed")} km/h
      </div>
    ),
  },
  {
    accessorKey: "maxWeight",
    header: ({ column }) => (
      <div
        className="flex flex-row items-center justify-center w-[100px] cursor-pointer select-none"
        onClick={column.getToggleSortingHandler()}
      >
        Max weight
        <SortingIcon column={column} />
      </div>
    ),
    sortingFn: "basic",
    cell: ({ row }) => (
      <div className="flex max-w-[100px] truncate justify-center">
        {row.getValue("maxWeight")} kg
      </div>
    ),
  },
  {
    accessorKey: "length",
    header: ({ column }) => (
      <div
        className="flex flex-row items-center justify-center w-[100px] cursor-pointer select-none"
        onClick={column.getToggleSortingHandler()}
      >
        Length
        <SortingIcon column={column} />
      </div>
    ),
    sortingFn: "basic",
    cell: ({ row }) => (
      <div className="flex max-w-[100px] truncate justify-center">
        {row.getValue("length")} cm
      </div>
    ),
  },
  {
    accessorKey: "manufacturer",
    header: ({ column }) => (
      <div
        className=" flex flex-row items-center justify-center  w-[150px] cursor-pointer select-none"
        onClick={column.getToggleSortingHandler()}
      >
        Manufacturer
        <SortingIcon column={column} />
      </div>
    ),
    sortingFn: "alphanumeric",
    cell: ({ row }) => (
      <div
        className="max-w-[150px] text-center truncate"
        title={row.getValue("manufacturer")}
      >
        {row.getValue("manufacturer")}
      </div>
    ),
  },
  {
    accessorKey: "yearManufactured",
    header: ({ column }) => (
      <div
        className="flex flex-row items-center justify-center w-[80px] cursor-pointer select-none"
        onClick={column.getToggleSortingHandler()}
      >
        Year
        <SortingIcon column={column} />
      </div>
    ),
    sortingFn: "alphanumeric",
    cell: ({ row }) => (
      <div className="w-[80px] text-center">
        {row.getValue("yearManufactured")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div
        className="flex flex-row items-center justify-center w-[170px] cursor-pointer select-none "
        onClick={column.getToggleSortingHandler()}
      >
        Status
        <SortingIcon column={column} />
      </div>
    ),
    sortingFn: "alphanumeric",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={cn(
            "flex w-[170px] items-center justify-center gap-2",
            status === "active" && "text-green-500",
            status === "maintenance" && "text-yellow-500",
            status === "decommissioned" && "text-red-500",
          )}
        >
          <div className="h-2 w-2 rounded-full bg-current" />
          {status}
        </div>
      );
    },
  },
];
