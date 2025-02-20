"use client";
import { destroy } from "@/actions/channels";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { RetrieveQuery } from "@/queries/channelQuery";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { refetch } = RetrieveQuery();

  const onConfirm = async () => {
    setLoading(true);
    const req = await destroy(data.id);

    if (req) {
      toast({
        title: "Success",
        description: "Berhasil menghapus data channel."
      });

      refetch();
    } else {
      toast({
        title: "Failed",
        description: "Gagal menghapus data channel."
      });
    }

    setOpen(false);
    setLoading(false);
  };

  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi tidak bisa dibatalkan, ini akan menghapus data channel dari
              server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={onConfirm}>
              {loading ? "Loading..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/channels/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
