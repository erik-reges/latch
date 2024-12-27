import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
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
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { AddVehicleDialog } from "@/components/vehicle-table/add-vehicle-dialog";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/vehicle-table/vehicle-table";

type SearchParams = {
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: "asc" | "desc";
};
type PaginatedVehicles = {
  data: {
    length: string;
    model: string;
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    maxSpeed: number;
    maxWeight: string;
    manufacturer: string;
    yearManufactured: number;
    status: "active" | "maintenance" | "decommissioned";
    lastMaintenanceDate: string | null;
    nextMaintenanceDate: string | null;
  }[];
  nextCursor: number | undefined;
  hasMore: boolean;
  totalCount: number;
};

export const Route = createFileRoute("/_app/vehicles")({
  component: VehiclesRoute,
  validateSearch: (search?: SearchParams) => {
    return {
      page: Number(search?.page ?? 1),
      pageSize: Number(search?.pageSize ?? 10),
      sortField: (search?.sortField as string) ?? "yearManufactured",
      sortOrder: (search?.sortOrder as "asc" | "desc") ?? "desc",
    };
  },
});

function VehiclesRoute() {
  const { api, qc } = Route.useRouteContext();
  const { page, pageSize, sortField, sortOrder } = Route.useSearch();
  const memoizedColumns = useMemo(() => columns, []);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: sortField || "yearManufactured",
      desc: sortField ? sortOrder === "desc" : true,
    },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data: paginatedData, isLoading: isPaginatedLoading } = useQuery({
    queryKey: ["vehicles-paginated", page, sorting],
    queryFn: async () => {
      const sortField = sorting[0]?.id ?? "yearManufactured";
      const sortOrder = sorting[0]?.desc ? "desc" : "asc";

      const queryKey = ["vehicles-paginated", page, sorting];
      const existingData = qc.getQueryData<PaginatedVehicles>(queryKey);
      if (existingData) {
        return existingData;
      }

      const { data } = await api.vehicles.page.get({
        query: {
          cursor: (page - 1).toString(),
          sortField,
          sortOrder,
        },
      });
      if (!data) throw new Error("No data returned");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const totalCount = paginatedData?.totalCount;

  const totalPages = Math.ceil((totalCount ?? 0) / pageSize);

  const updatePage = (newPage: number) => {
    navigate({
      to: "/vehicles",
      search: (): SearchParams => ({
        page: Math.max(1, Math.min(totalPages, newPage)),
        pageSize: 10,
        sortField: sorting[0]?.id ?? "yearManufactured",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
    });
  };

  // const prefetchNextPage = () => {
  //   const nextPage = page;
  //   if (nextPage <= totalPages) {
  //     const queryKey = [
  //       "vehicles-paginated",
  //       nextPage,
  //       sorting[0] ?? { id: "yearManufactured", desc: true },
  //     ];

  //     if (!qc.getQueryData(queryKey)) {
  //       qc.prefetchQuery({
  //         queryKey,
  //         queryFn: async () => {
  //           const { data } = await api.vehicles.page.get({
  //             query: {
  //               cursor: nextPage.toString(),
  //               sortField: sorting[0]?.id ?? "yearManufactured",
  //               sortOrder: sorting[0]?.desc ? "desc" : "asc",
  //             },
  //           });
  //           return data;
  //         },
  //         staleTime: 30000,
  //       });
  //     }
  //   }
  // };

  const handlePageChange = (newPage: number) => {
    updatePage(newPage);

    // const nextPage = newPage + 1;
    // if (nextPage <= totalPages) {
    //   const queryKey = [
    //     "vehicles-paginated",
    //     nextPage,
    //     sorting[0] ?? { id: "yearManufactured", desc: true },
    //   ];

    //   if (!qc.getQueryData(queryKey)) {
    //     qc.prefetchQuery({
    //       queryKey,
    //       queryFn: async () => {
    //         const { data } = await api.vehicles.page.get({
    //           query: {
    //             cursor: nextPage.toString(),
    //             sortField: sorting[0]?.id ?? "yearManufactured",
    //             sortOrder: sorting[0]?.desc ? "desc" : "asc",
    //           },
    //         });
    //         return data;
    //       },
    //       staleTime: 30000,
    //     });
    //   }
    // }
  };

  const vehicles = useMemo(() => {
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
    columns: memoizedColumns,
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
          to: "/vehicles",
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

      <div className="overflow-x-auto max-w-[calc(100vw-2rem)]">
        {" "}
        {/* or whatever padding/margin you have */}
        <div className="min-w-[950px]">
          {" "}
          {/* Set a minimum width that fits all your columns comfortably */}
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
                        <TableCell
                          key={cell.id}
                          className="whitespace-nowrap px-0"
                        >
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
        </div>
      </div>

      <div className="w-full">
        <Pagination className=" p-2">
          <PaginationContent className="flex items-center justify-between gap-4">
            <PaginationItem className="w-24 cursor-pointer">
              <PaginationPrevious
                className="w-full"
                onClick={() => handlePageChange(page - 1)}
              />
            </PaginationItem>

            <div className="flex items-center gap-2 min-w-[275px]  justify-between">
              <PaginationItem className="cursor-pointer p-2">
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  isActive={page === 1}
                  className="min-w-[40px] flex justify-center"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {page > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {page >= 2 && page < totalPages - 1 && (
                <PaginationItem className="cursor-pointer p-2">
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
                <PaginationItem className="cursor-pointer p-2">
                  <PaginationLink
                    onClick={() => updatePage(totalPages)}
                    isActive={page === totalPages}
                    className={`min-w-[${totalPages > 100 ? "60" : "40"}px] flex justify-center`}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
            </div>

            <PaginationItem className="w-20">
              <Button
                variant="ghost"
                className="gap-1 pr-2.5 w-full cursor-pointer"
                onClick={() => handlePageChange(page + 1)}
                // onMouseEnter={prefetchNextPage}
                disabled={page === totalPages}
                size="default"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
