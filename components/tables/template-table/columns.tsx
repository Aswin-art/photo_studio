"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CldImage } from "next-cloudinary";

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
    accessorKey: "image",
    header: "Gambar Template",
    cell: ({ row }) => (
      <CldImage
        width="200"
        height="200"
        sizes="100vw"
        src={row.original.public_id}
        alt="image-cloud"
      />
    )
  },
  {
    accessorKey: "label",
    header: "Nama Template"
  },
  // {
  //   accessorKey: "Results.length",
  //   header: "Jumlah Penggunaan"
  // },
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
