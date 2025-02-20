/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { formatRupiah } from "@/utils/Rupiah";
import { CellApprove } from "./CellApprove";
import { convertBookingSession } from "@/utils/convertBookingSession";
import { useMemo, useEffect, useState } from "react";

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
    header: "Tanggal Booking",
    cell: ({ row }) => {
      const [formattedDate, setFormattedDate] = useState<string>("");

      useEffect(() => {
        const date = new Date(row.original.bookingDate);
        const formatted = date.toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "Asia/Jakarta",
        });
        setFormattedDate(formatted);
      }, [row.original.bookingDate]);

      return <span>{formattedDate || "Memuat..."}</span>;
    },
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
        .map((item: any) => item.addon.name)
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
    header: "Total Harga",
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
