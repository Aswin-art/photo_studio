/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { formatRupiah } from "@/utils/Rupiah";
import { CellApprove } from "./CellApprove";
import { convertBookingSession } from "@/utils/convertBookingSession";
import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const TransactionColumns = (
  refreshTransactions: () => void
): ColumnDef<any>[] => [
  {
    accessorKey: "index",
    header: "No",
    cell: ({ row }) => row.index + 1,
    enableSorting: false
  },
  {
    accessorFn: (row) => row.studio?.name ?? "",
    id: "studioName",
    header: "Studio",
    cell: ({ row }) => <span>{row.original.studio.name}</span>
  },
  {
    accessorKey: "customerName",
    header: "Nama Customer",
    cell: ({ row }) => <span>{row.original.customerName}</span>
  },
  {
    accessorKey: "customerPhone",
    header: "Telepon",
    cell: ({ row }) => <span>{row.original.customerPhone}</span>
  },
  {
    accessorKey: "customerEmail",
    header: "Email",
    cell: ({ row }) => <span>{row.original.customerEmail}</span>
  },
  {
    accessorKey: "bookingDate",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-0 py-2"
        >
          Tanggal Booking <ArrowUpDown />
        </button>
      );
    },
    cell: ({ row }) => {
      const [formattedDate, setFormattedDate] = useState<string>("");

      useEffect(() => {
        const date = new Date(row.original.bookingDate);
        const formatted = date.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "Asia/Jakarta"
        });
        setFormattedDate(formatted);
      }, [row.original.bookingDate]);

      return <span>{formattedDate || "Memuat..."}</span>;
    }
  },
  {
    accessorKey: "bookingTime",
    header: "Waktu Booking",
    cell: ({ row }) => (
      <span>{convertBookingSession(row.original.bookingTime)}</span>
    )
  },
  {
    accessorKey: "addons",
    header: "Layanan Tambahan",
    cell: ({ row }) => {
      const addonNames = row.original.customeraddon
        .map((item: any) => item.addon.name + ` (${item.quantity})`)
        .join(", ");
      return <span>{addonNames}</span>;
    }
  },
  {
    accessorFn: (row) => row.voucher?.name ?? "",
    id: "voucher",
    header: "Voucher",
    cell: ({ row }) => (
      <span>
        {row.original.voucher ? row.original.voucher.name : "Tidak ada"}
      </span>
    )
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 px-0 py-2"
        >
          Total Harga <ArrowUpDown />
        </button>
      );
    },
    cell: ({ row }) => <span>Rp{formatRupiah(row.original.totalPrice)}</span>
  },
  {
    id: "isApproved",
    header: "Status Pembayaran",
    cell: ({ row }) => (
      <CellApprove data={row.original} refresh={refreshTransactions} />
    )
  }
];
