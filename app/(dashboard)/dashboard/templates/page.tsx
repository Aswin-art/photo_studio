/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { columns } from "@/components/tables/template-table/columns";
import DataTable from "@/components/tables/template-table/data-table";
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
import React from "react";
import { toast } from "@/hooks/use-toast";
import { RetrieveQuery } from "@/queries/templateQuery";
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
import { uploadImage } from "@/utils/imageApi";

const Page = () => {
  const [photos, setPhotos] = React.useState<any>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const { data, refetch } = RetrieveQuery();

  const handleUploadSuccess = async (files: any) => {
    if (files.length > 0) {
      return setPhotos(files);
    }

    return toast({
      title: "Failed",
      description: "Upload minimal 1 gambar!"
    });
  };

  const handleInsertDataToDatabase = async () => {
    if (!photos || photos.length <= 0) {
      return toast({
        title: "Failed",
        description:
          "Data template gagal dibuat, harap periksa data kembali sebelum submit!"
      });
    }

    try {
      const result = await uploadImage(photos, "Templates");

      if (result) {
        refetch();
        toast({
          title: "Success",
          description: "Template baru telah berhasil dibuat!"
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed",
        description: "Server mengalami masalah!"
      });
      return null;
    }

    setOpen(false);
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
            <BreadcrumbLink href="/dashboard/templates">
              Templates
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold tracking-tight">Templates</div>
          <p className="text-sm text-muted-foreground">
            Kelola semua data template disini.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload Template Baru</DialogTitle>
                <DialogDescription>
                  Minimal upload 1 gambar yang ingin dijadikan template.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-4">
                  <Input
                    id="images"
                    type="file"
                    multiple
                    className="col-span-3"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const fileArray = Array.from(files);
                        handleUploadSuccess(fileArray);
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleInsertDataToDatabase}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
};

export default Page;
