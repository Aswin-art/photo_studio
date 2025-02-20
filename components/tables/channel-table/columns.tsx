"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    enableHiding: false
  },
  {
    accessorKey: "code",
    header: "Kode Channel"
  },
  {
    accessorKey: "email",
    header: "Email Pengguna"
  },
  {
    accessorKey: "phone",
    header: "Telepon Pengguna"
  },
  {
    accessorKey: "ChannelImages.length",
    header: "Jumlah Foto"
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal Pembuatan <ArrowUpDown />
        </Button>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
