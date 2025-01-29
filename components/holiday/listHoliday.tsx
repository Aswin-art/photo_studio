"use client";

import { Holiday } from "@/types";
import DataTable from "../tables/data-table";
import { holidayColumns } from "@/components/holiday/table/holiday-columns";
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
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { format } from "date-fns";
import React, { useState } from "react";
import { createHoliday } from "@/actions/holidayAction";
import { useToast } from "@/hooks/use-toast";

interface ListHolidayProps {
  holiday: Holiday[];
  isLoading: boolean;
  refreshHolidays: () => void;
}

export default function ListHoliday({
  holiday,
  isLoading,
  refreshHolidays
}: ListHolidayProps) {
  const [date, setDate] = React.useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    date: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !formData.name) {
      alert("Please fill out all fields.");
      return;
    }
    setIsSubmitting(true);

    try {
      await createHoliday(date, formData.name);
      toast({
        title: "Success",
        type: "foreground"
      });
      setFormData({ name: "", date: "" });
      setDate(undefined);
      refreshHolidays();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        type: "background"
      });
      throw new Error(`failed to create holiday: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className={`flex gap-4 items-center`}>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Buat Jadwal Libur</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Buat Jadwal Libur</DialogTitle>
              <DialogDescription>
                Buat jadwal libur baru untuk menambahkan ke dalam kalender
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Tanggal
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Deskripsi
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={`Deskripsi libur`}
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
          onClick={refreshHolidays}
          variant={`outline`}
          className={`py-5`}
        >
          Refresh Data
        </Button>
      </div>
      {isLoading && <p>Loading...</p>}
      <DataTable
        columns={holidayColumns}
        data={holiday}
        searchColumn="description"
      />
    </div>
  );
}
