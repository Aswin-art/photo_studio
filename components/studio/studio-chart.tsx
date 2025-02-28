"use client";

// import { deleteStudio } from "@/actions/studioAction";
import Image from "next/image";
import { useState } from "react";
import { Studio } from "@/types";
import UpdateStudioForm from "./updateModal";
import { formatRupiah } from "@/utils/Rupiah";
import { deleteStudio } from "@/actions/studioAction";
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

export default function StudioCard({
  studio,
  refreshStudios
}: {
  studio: Studio;
  refreshStudios: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteStudio(id);
      refreshStudios();
    } catch (error) {
      alert("Failed to delete studio.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin ingin menghapus Studio?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Studio Anda akan dihapus secara permanen.
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
              onClick={() => handleDelete(studio.id)}
            >
              {loading ? "Loading..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {studio.image ? (
          <Image
            src={studio.image}
            alt={studio.name}
            width={400}
            height={400}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
            No Image
          </div>
        )}

        <div className="p-4 flex flex-col">
          <h2 className="text-lg font-bold">{studio.name}</h2>
          <h2 className="text-[16px] font-semibold">
            Rp{formatRupiah(studio.price.toString())}
          </h2>
          <p
            className="text-sm text-gray-600 mt-1"
            dangerouslySetInnerHTML={{
              __html: studio.description || "No description available."
            }}
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 w-full"
            >
              update
            </button>
            <button
            onClick={() => setOpen(true)}
            className={`px-4 py-2 text-sm font-medium text-white rounded ${
              isDeleting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          </div>
        </div>
      </div>

      {isUpdateModalOpen && (
        <UpdateStudioForm refreshStudios={refreshStudios} id={studio.id} />
      )}
    </>
  );
}
