/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

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
      <Image
        unoptimized
        width="200"
        height="200"
        sizes="100vw"
        alt="image-cloud"
        src={process.env.NEXT_PUBLIC_IMAGE_API + row.original.image_url}
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
    },
    cell: ({ row }) => {
      const [formattedDate, setFormattedDate] = useState<string>("");

      useEffect(() => {
        const date = new Date(row.original.createdAt);
        const formatted = date.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "Asia/Jakarta"
        });
        setFormattedDate(formatted);
      }, [row.original.createdAt]);

      return <span>{formattedDate || "Memuat..."}</span>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
