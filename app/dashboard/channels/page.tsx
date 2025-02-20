/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { create } from "@/actions/channels";
import { toast } from "@/hooks/use-toast";
import { RetrieveQuery } from "@/queries/channelQuery";

const Page = () => {
  const photos: any[] = [];

  const { data, refetch } = RetrieveQuery();

  const handleUploadSuccess = async (results: any) => {
    if (results) {
      photos.push({
        image_url: results.url,
        public_id: results.public_id
      });
    } else {
      console.log(results);
    }
  };

  const handleInsertDataToDatabase = async () => {
    if (!photos || photos.length <= 0) {
      return toast({
        title: "Failed",
        description:
          "Data channel gagal dibuat, harap periksa data kembali sebelum submit!"
      });
    }

    try {
      const result = await create(photos as any[]);

      if (result) {
        refetch();
        toast({
          title: "Success",
          description: "Channel baru telah berhasil dibuat!"
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

        <CldUploadWidget
          options={{ sources: ["local"] }}
          uploadPreset="channels"
          onSuccess={(result) => {
            handleUploadSuccess(result?.info);
          }}
          onClose={() => handleInsertDataToDatabase()}
        >
          {({ open }) => {
            return (
              <Button onClick={() => open()}>
                <Plus />
                Tambah Channel
              </Button>
            );
          }}
        </CldUploadWidget>
      </div>

      <Separator />

      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
};

export default Page;
