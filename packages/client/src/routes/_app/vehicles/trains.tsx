import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from "lucide-react";
import { AddVehicleDialog } from "@/components/vehicle-table/add-vehicle-dialog";
import { isAuthenticated } from "@/lib/auth";
import { VehicleActions } from "@/components/vehicle-table/vehicle-actions";
import type { VehicleRecord } from "@/components/vehicle-table/vehicle-schema";
import type { Vehicle } from "@latch/db/drizzle/auth-schema";

export const Route = createFileRoute("/_app/vehicles/trains")({
  component: VehiclesRoute,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search?.page ?? 1),
      pageSize: Number(search?.pageSize ?? 10),
      sortField: (search?.sortField as string) ?? "yearManufactured",
      sortOrder: (search?.sortOrder as "asc" | "desc") ?? "desc",
    };
  },

  beforeLoad: async ({ context: { qc, api }, location, search }) => {
    if (!(await isAuthenticated())) {
      throw redirect({
        to: "/signup",
        search: {
          redirect: location.href,
        },
      });
    }

    const currentPage = search.page;
    const prefetchPages = [-2, -1, 0, 1, 2] // Pages to prefetch relative to current page
      .map((offset) => currentPage + offset)
      .filter((page) => page > 0);

    // Prefetch count
    // await qc.prefetchQuery({
    //     queryKey: ["vehicles-count"],
    //     queryFn: async () => {
    //       const { data } = await api.vehicles.count.get();
    //       return data;
    //     },
    //   });

    const sortField = search.sortField;
    const sortOrder = search.sortOrder;

    await Promise.all(
      prefetchPages.map((page) =>
        qc.prefetchQuery({
          queryKey: [
            "vehicles-paginated",
            page,
            { id: sortField, desc: sortOrder === "desc" },
          ],
          queryFn: async () => {
            const { data } = await api.vehicles.page.get({
              query: {
                cursor: page.toString(),
                sortField,
                sortOrder,
              },
            });
            return data;
          },
          staleTime: 30000,
        }),
      ),
    );
  },
});

function VehiclesRoute() {
  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
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
    ],
    [],
  );
  const { api, qc } = Route.useRouteContext();
  const { page, pageSize, sortField, sortOrder } = Route.useSearch();

  const [sorting, setSorting] = useState<SortingState>(() => {
    if (sortField) {
      return [
        {
          id: sortField,
          desc: sortOrder === "desc",
        },
      ];
    }
    return [];
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data: totalCount } = useQuery({
    queryKey: ["vehicles-count"],
    queryFn: async () => {
      const { data } = await api.vehicles.count.get();
      return data;
    },
  });

  const { data: paginatedData, isLoading: isPaginatedLoading } = useQuery({
    queryKey: ["vehicles-paginated", page, sorting], // Add sorting to queryKey
    queryFn: async () => {
      const sortField = sorting[0]?.id;
      const sortOrder = sorting[0]?.desc ? "desc" : "asc";

      const { data } = await api.vehicles.page.get({
        query: {
          cursor: page.toString(),
          sortField,
          sortOrder,
        },
      });
      if (!data) throw new Error("No data returned");
      return data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  });

  const totalPages = Math.ceil((totalCount ?? 0) / pageSize);

  const prefetchNextPage = useMemo(() => {
    return () => {
      const nextPage = page + 1;
      if (nextPage <= totalPages) {
        const sortField = sorting[0]?.id;
        const sortOrder = sorting[0]?.desc ? "desc" : "asc";

        qc.prefetchQuery({
          queryKey: ["vehicles-paginated", nextPage, sorting],
          queryFn: async () => {
            const { data } = await api.vehicles.page.get({
              query: {
                cursor: nextPage.toString(),
                sortField,
                sortOrder,
              },
            });
            return data;
          },
          staleTime: 30000,
        });
      }
    };
  }, [page, totalPages, qc, sorting]);
  type SearchParams = {
    page: number;
    pageSize: number;
    sortField: string;
    sortOrder: "asc" | "desc";
  };

  const updatePage = (newPage: number) => {
    navigate({
      to: "/vehicles/trains",
      search: (): SearchParams => ({
        page: Math.max(1, Math.min(totalPages, newPage)),
        pageSize: 10,
        sortField: sorting[0]?.id ?? "yearManufactured",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
    });
  };

  const handlePageChange = (newPage: number) => {
    updatePage(newPage);
    // Prefetch next page when changing pages
    const nextPage = newPage + 1;
    if (nextPage <= totalPages) {
      const sortField = sorting[0]?.id;
      const sortOrder = sorting[0]?.desc ? "desc" : "asc";
      qc.prefetchQuery({
        queryKey: ["vehicles-paginated", nextPage, sorting],
        queryFn: async () => {
          const { data } = await api.vehicles.page.get({
            query: {
              cursor: nextPage.toString(),
              sortField,
              sortOrder,
            },
          });
          return data;
        },
        staleTime: 30000,
      });
    }
  };

  // Use all data if available, otherwise use paginated
  const vehicles = useMemo(() => {
    // if (allData) return allData;
    return paginatedData?.data ?? [];
  }, [paginatedData]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setGlobalFilter(value);
  }, 200);

  const filteredData = useMemo(
    () =>
      vehicles.filter((item) =>
        Object.values(item).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(globalFilter.toLowerCase()),
        ),
      ),
    [vehicles, globalFilter],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize,
      },
    },
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        const newSorting = updater(sorting);
        setSorting(newSorting);

        handlePageChange(1);
      }
    },
    manualSorting: true, // Enable manual sorting

    manualPagination: true,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater(table.getState().pagination);
        navigate({
          to: "/vehicles/trains",
          search: {
            page: newState.pageIndex + 1,
            pageSize: newState.pageSize,
            sortField: sorting[0]?.id,
            sortOrder: sorting[0]?.desc ? "desc" : ("asc" as const),
          },
        });
      }
    },
    pageCount: Math.ceil((totalCount ?? 0) / 10), // Set total pages
  });
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search all columns..."
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            debouncedSearch(event.target.value);
          }}
          className="max-w-sm"
        />
        <AddVehicleDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap bg-muted/50 font-medium text-muted-foreground px-0"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isPaginatedLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading vehicles...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : vehicles.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap px-0">
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-full">
        <Pagination className="w-full p-2">
          <PaginationContent className="flex items-center justify-between gap-4">
            <PaginationItem className="w-24">
              {" "}
              {/* Fixed width for prev/next buttons */}
              <PaginationPrevious
                className="w-full"
                onClick={() => handlePageChange(page - 1)}
              />
            </PaginationItem>

            <div className="flex items-center gap-2 min-w-[120px] justify-between">
              {" "}
              {/* Container for page numbers */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  isActive={page === 1}
                  className="min-w-[40px] flex justify-center"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {page > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {page > 2 && page < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink
                    isActive={true}
                    className="min-w-[40px] flex justify-center"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )}
              {page < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => updatePage(totalPages - 1)}
                    isActive={page === totalPages - 1}
                    className="min-w-[40px] flex justify-center"
                  >
                    {totalPages - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
            </div>

            <PaginationItem className="w-24">
              {" "}
              {/* Fixed width for prev/next buttons */}
              <PaginationNext
                className="w-full"
                onClick={() => handlePageChange(page + 1)}
                // disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );

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
}
