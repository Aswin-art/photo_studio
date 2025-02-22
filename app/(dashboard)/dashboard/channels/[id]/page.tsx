/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { FindQuery } from "@/queries/channelQuery";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Loader2, Plus, Trash } from "lucide-react";
import { deleteChannelImage, insertImages, update } from "@/actions/channels";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Wajib berupa email"
    })
    .nullable(),
  phone: z.string().nullable(),
  code: z.string()
});

const Page = () => {
  const params = useParams();
  const photos: any[] = [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const formLoading = form.formState.isLoading;

  const [loadingDelete, setLoadingDelete] = useState(false);

  const { data, isLoading, refetch } = FindQuery(Number(params.id));

  const handleUploadSuccess = async (results: any) => {
    if (results) {
      photos.push({
        image_url: results.url,
        public_id: results.public_id
      });
    } else {
      console.log("Unexpected result format:", results);
    }
  };

  const handleInsertDataToDatabase = async () => {
    if (!photos || photos.length <= 0) {
      return toast({
        title: "Failed",
        description: "Data gambar gagal ditambahkan!"
      });
    }

    try {
      const result = await insertImages(Number(params.id), photos as any[]);
      console.log(result);

      if (result) {
        refetch();
        toast({
          title: "Success",
          description: "Data gambar berhasil ditambahkan!"
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

  const handleDeleteImage = async (public_id: string) => {
    setLoadingDelete(true);
    const deleteImage = await deleteChannelImage(public_id);

    if (deleteImage) {
      toast({
        title: "Success",
        description: "Berhasil menghapus gambar!"
      });
      refetch();
      setLoadingDelete(false);
    } else {
      toast({
        title: "Failed",
        description: "Gagal menghapus gambar!"
      });
      setLoadingDelete(false);
    }
  };

  const handleUpdateChannel = async (values: z.infer<typeof formSchema>) => {
    const updateChannel = await update(
      Number(params.id),
      values.email,
      values.phone
    );

    if (updateChannel) {
      toast({
        title: "Success",
        description: "Berhasil mengupdate channel!"
      });

      refetch();
    } else {
      toast({
        title: "Failed",
        description:
          "Gagal mengupdate channel, perhatikan data sebelum di submit!"
      });
    }
  };

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/channels">
                Detail Channel
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/channels/${params.id}`}>
                Detail
              </BreadcrumbLink>
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
        </div>

        <Separator />

        {!isLoading && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateChannel)}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Channel</FormLabel>
                      <FormControl>
                        <Input disabled={true} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Pengguna</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Masukkan email pengguna..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon Pengguna</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Masukkan nomor telepon..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="font-bold text-xl">Daftar Gambar</p>
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
                      <Button type="button" onClick={() => open()}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Gambar
                      </Button>
                    );
                  }}
                </CldUploadWidget>
              </div>

              <Separator />

              <div className="relative grid grid-cols-2 gap-4">
                {data?.ChannelImages.map((image) => (
                  <div key={image.id} className="relative">
                    <CldImage
                      width="960"
                      height="600"
                      sizes="100vw"
                      src={image.public_id}
                      alt="image-cloud"
                      className="hover:opacity-75 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                      <Button
                        className="bg-white text-red-500 hover:bg-red-500 hover:text-white"
                        size={"lg"}
                        type="button"
                        disabled={loadingDelete}
                        onClick={() => handleDeleteImage(image.public_id)}
                      >
                        {loadingDelete ? (
                          <div className="flex gap-2 items-center justify-center">
                            <Loader2 className="animate-spin" size={20} />{" "}
                            Loading...
                          </div>
                        ) : (
                          <div className="flex gap-2 items-center justify-center">
                            <Trash size={20} /> Hapus
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Link
                  href={"/dashboard/channels"}
                  className={buttonVariants({
                    variant: "outline"
                  })}
                >
                  Kembali
                </Link>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Loading..." : "Simpan"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </ScrollArea>
  );
};

export default Page;
