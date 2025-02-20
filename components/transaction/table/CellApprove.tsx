"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types";
import { useState } from "react";
import { updateTransactionApproval } from "@/actions/bookingAction";

interface CellApproveProps {
  data: Transaction;
  updatePath?: string;
  refresh: () => void;
}

export const CellApprove: React.FC<CellApproveProps> = ({ data, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isApprove, setIsApprove] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleApprove = () => {
    setIsApprove(true);
    setOpen(true);
  };

  const handleReject = () => {
    setIsApprove(false);
    setOpen(true);
  };

  const onConfirm = async (id) => {
    setLoading(true);
    try {
      await updateTransactionApproval(id, isApprove);
      setOpen(false);
      toast({
        title: "Success",
        type: "foreground",
        description: "Berhasil memperbarui status pembayaran"
      });
      refresh();
    } catch {
      toast({
        title: "Error",
        type: "background"
      });
    }
    setLoading(false);
  };

  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apakah Anda Yakin {isApprove ? "Menerima" : "Menolak"} Pembayaran?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Transaksi ini akan{" "}
              {isApprove ? "diterima" : "ditolak"} secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={() => onConfirm(data.id)}
            >
              {loading ? "Loading..." : "Lanjutkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {data.isApproved === null && (
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            className="flex items-center gap-2 px-2 py-1 text-white bg-green-500 rounded-md"
          >
            Terima
          </button>
          <button
            onClick={handleReject}
            className="flex items-center gap-2 px-2 py-1 text-white bg-red-500 rounded-md"
          >
            Tolak
          </button>
        </div>
      )}

      {data.isApproved === true && <span>Di Terima</span>}

      {data.isApproved === false && <span>Di tolak</span>}
    </>
  );
};
