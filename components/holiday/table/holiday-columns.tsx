/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "@/components/tables/cell-action";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const holidayColumns = (
  refreshHolidays: () => void
): ColumnDef<any>[] => [
  {
    accessorKey: "index",
    header: "INDEX",
    cell: ({ row }) => row.index + 1,
    enableSorting: false
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TANGGAL <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span>
        {new Date(row.original.date).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </span>
    )
  },
  {
    accessorKey: "description",
    header: "DESKRIPSI",
    cell: ({ row }) => <span>{row.original.description}</span>
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => (
      <CellAction
        data={row.original}
        updatePath="/dashboard/holiday"
        refresh={refreshHolidays}
      />
    )
  }
];
