"use client";

import { Addon } from "@/types";
import { createAddon } from "@/actions/addonAction";
import DataTable from "../tables/data-table";
import { AddonColumns } from "./table/AddonColumns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatRupiah, parseRupiah } from "@/utils/Rupiah";

interface ListAddonProps {
  addon: Addon[];
  isLoading: boolean;
  refreshAddons: () => void;
}

export default function ListAddon({
  addon,
  isLoading,
  refreshAddons
}: ListAddonProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === "price") {
      const rawValue = value.replace(/\D/g, "");
      setFormData({ ...formData, price: formatRupiah(rawValue) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Harap isi semua bidang.");
      return;
    }
    setIsSubmitting(true);

    try {
      await createAddon(
        formData.name,
        parseRupiah(formData.price)
      );
      toast({
        title: "Berhasil",
        description: "Addon berhasil dibuat",
        type: "foreground",
      });
      setFormData({ name: "", price: "" });
      refreshAddons();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        type: "background",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className={`flex gap-4 items-center`}>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Buat Addon</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Buat Addon</DialogTitle>
              <DialogDescription>
                Masukkan detail addon diskon yang baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={`Nama / Kode Addon`}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Harga
                </Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Rp 0"
                  className="col-span-3"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button
          onClick={refreshAddons}
          variant={`outline`}
          className={`py-5`}
        >
          Refresh Data
        </Button>
      </div>
      {isLoading && <p>Loading...</p>}
      <DataTable
        columns={AddonColumns(refreshAddons)}
        data={addon}
        searchColumn="name"
      />
    </div>
  );
}
