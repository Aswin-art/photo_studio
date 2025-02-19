"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "@/components/tables/cell-action";
import { formatRupiah } from "@/utils/Rupiah";

interface AddonColumnsProps {
  onRefresh: () => void;
}
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const AddonColumns = (refreshAddons: () => void): ColumnDef<any>[] => [
  {
    accessorKey: "index",
    header: "No",
    cell: ({ row }) => row.index + 1, 
    enableSorting: false
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => <span>{row.original.name}</span>
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-0 py-2"
        >
          Harga <ArrowUpDown />
        </button>
      );
    },
    cell: ({ row }) => (
      <span>
        Rp{formatRupiah(row.original.price)}
      </span>
    )
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => <CellAction data={row.original} updatePath="/dashboard/addon" refresh={refreshAddons} />
  }
];