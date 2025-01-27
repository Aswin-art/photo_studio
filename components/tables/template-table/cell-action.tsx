"use client";
import { destroy } from "@/actions/templates";
import { update } from "@/actions/templates";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RetrieveQuery } from "@/queries/templateQuery";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [label, setLabel] = useState("");
  const { toast } = useToast();

  const { refetch } = RetrieveQuery();

  const handleUpdateLabel = async () => {
    setLoadingLabel(true);
    const req = await update(data.id, label);

    if (req) {
      toast({
        title: "Success",
        description: "Berhasil mengupdate label template!"
      });
      refetch();
      setLabel("");
      setOpenUpdate(false);
    } else {
      toast({
        title: "Failed",
        description: "Gagal mengupdate label template!"
      });
    }

    setLoadingLabel(false);
  };

  const onConfirm = async () => {
    setLoading(true);
    const req = await destroy(data.id);

    if (req) {
      toast({
        title: "Success",
        description: "Berhasil menghapus data template."
      });

      refetch();
    } else {
      toast({
        title: "Failed",
        description: "Gagal menghapus data template."
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
              Aksi tidak bisa dibatalkan, ini akan menghapus data template dari
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

      <AlertDialog open={openUpdate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Label Template</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col gap-2">
                <Label>Nama Label</Label>
                <Input
                  placeholder="Masukkan nama label..."
                  value={label}
                  disabled={loadingLabel}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loadingLabel}
              onClick={() => setOpenUpdate(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loadingLabel}
              onClick={handleUpdateLabel}
            >
              {loadingLabel ? "Loading..." : "Submit"}
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

          <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
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
