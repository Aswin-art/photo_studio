/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { columns } from "@/components/tables/channel-table/columns";
import DataTable from "@/components/tables/channel-table/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RetrieveQuery } from "@/queries/channelQuery";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { create } from "@/actions/channels";
import { uploadImage } from "@/utils/imageApi";

const Page = () => {
  const { data, refetch } = RetrieveQuery();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | File[] | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFile(fileArray);
    }
  };

  const handleInsertDataToDatabase = async () => {
    if (!selectedFile) {
      return toast({
        title: "Failed",
        description: "Silakan pilih file gambar sebelum submit!"
      });
    }

    setIsUploading(true);
    try {
      const channel = await create();

      if (channel) {
        const req = await uploadImage(
          selectedFile,
          "ChannelImages",
          channel.id
        );

        if (req) {
          refetch();
          toast({
            title: "Success",
            description: "Channel baru telah berhasil dibuat!"
          });
          setIsOpen(false);
          setSelectedFile(null);
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed",
        description: "Server mengalami masalah saat upload!"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/channels">Channels</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold tracking-tight">Channels</div>
          <p className="text-sm text-muted-foreground">
            Kelola semua data channel disini.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)}>
              <Plus /> Tambah Channel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Gambar Channel</DialogTitle>
              <DialogDescription>Upload minimal 1 gambar.</DialogDescription>
            </DialogHeader>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              disabled={isUploading}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedFile(null);
                }}
                disabled={isUploading}
              >
                Batal
              </Button>
              <Button
                onClick={handleInsertDataToDatabase}
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? "Uploading..." : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
};

export default Page;
