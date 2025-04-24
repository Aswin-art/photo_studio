/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    price: "",
    isBackground: false,
    colorHex: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (name === "price") {
      const rawValue = value.replace(/\D/g, "");
      setFormData({ ...formData, price: formatRupiah(rawValue) });
    } else if (type === "radio") {
      setFormData({ ...formData, isBackground: value === "true"});
    } else if (name === "colorHex") {
      const hexValue = value.replace(/[^0-9A-Fa-f]/g, "");
      setFormData({ ...formData, colorHex: hexValue });
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
        parseRupiah(formData.price),
        formData.isBackground,
        formData.isBackground ? '#' + formData.colorHex : null
      );
      toast({
        title: "Berhasil",
        description: "Addon berhasil dibuat",
        type: "foreground"
      });
      setFormData({    
        name: "",
        price: "",
        isBackground: false,
        colorHex: ""
      });
      refreshAddons();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        type: "background"
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
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Buat Addon</DialogTitle>
              <DialogDescription>
                Masukkan detail addon yang baru.
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Apakah Custom Background?</Label>
                <RadioGroup
                  defaultValue={formData.isBackground ? "true" : "false"}
                  onValueChange={(value) => setFormData({ ...formData, isBackground: value === "true" })}
                  className="col-span-3 flex gap-4"
                >
                  <div className="flex gap-x-2">
                    <Label htmlFor="yes" className="mr-2">Ya</Label>
                    <RadioGroupItem value="true" id="yes" />
                    <Label htmlFor="no" className="mr-2">Tidak</Label>
                    <RadioGroupItem value="false" id="no" />
                  </div>
                </RadioGroup>
              </div>

              {formData.isBackground && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="colorHex" className="text-right">
                    Kode Heksa
                  </Label>
                  <div className="flex items-center gap-1 col-span-3 border border-gray-200 rounded-md shadow-sm">
                    <Label
                      htmlFor="colorHex"
                      className="text-center p-[10px] border-r border-gray-200"
                    >
                      #
                    </Label>
                    <Input
                      id="colorHex"
                      name="colorHex"
                      value={formData.colorHex}
                      onChange={handleInputChange}
                      placeholder={`000000`}
                      className="col-span-3 border-0 shadow-none"
                      minLength={3}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Button onClick={refreshAddons} variant={`outline`} className={`py-5`}>
          Refresh Data
        </Button>
      </div>
      {isLoading && <p>Loading...</p>}
      <DataTable columns={AddonColumns(refreshAddons)} data={addon} />
    </div>
  );
}
