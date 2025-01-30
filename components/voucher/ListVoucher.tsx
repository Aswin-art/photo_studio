"use client";

import { Voucher } from "@/types";
import DataTable from "../tables/data-table";
import { VoucherColumns } from "./table/VoucherColumns"; 
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
import { createVoucher } from "@/actions/voucher";

interface ListVoucherProps {
  voucher: Voucher[];
  isLoading: boolean;
  refreshVouchers: () => void;
}

export default function ListVoucher({
  voucher,
  isLoading,
  refreshVouchers
}: ListVoucherProps) {
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    count: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log({name, value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.discount || !formData.count) {
        alert("Harap isi semua bidang.");
        return;
      }
      setIsSubmitting(true);

      try {
        await createVoucher(
          formData.name,
          Number(formData.discount.replace(",", ".")),
          Number(formData.count)
        );
        toast({
          title: "Berhasil",
          description: "Voucher berhasil dibuat",
          type: "foreground",
        });
        setFormData({ name: "", discount: "", count: "" });
        refreshVouchers();
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
            <Button>Buat Voucher</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Buat Voucher</DialogTitle>
              <DialogDescription>
                Masukkan detail voucher diskon yang baru.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama / Kode
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={`Nama / Kode Voucher`}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount" className="text-right">
                  Diskon
                </Label>
                <div className="flex items-center gap-2 col-span-3">
                    <Input
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder={`Persentase Diskon`}
                    className="col-span-3"
                    type="number"
                    required
                    />
                    <Label htmlFor="discount" className="text-center p-[10px] border border-gray-200 rounded-md">
                    %
                    </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Jumlah Voucher
                </Label>
                <Input
                  id="count"
                  name="count"
                  value={formData.count}
                  onChange={handleInputChange}
                  placeholder={`Jumlah Voucher`}
                  className="col-span-3"
                  type="number"
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
          onClick={refreshVouchers}
          variant={`outline`}
          className={`py-5`}
        >
          Refresh Data
        </Button>
      </div>
      {isLoading && <p>Loading...</p>}
      <DataTable
        columns={VoucherColumns(refreshVouchers)}
        data={voucher}
        searchColumn="name"
      />
    </div>
  );
}
