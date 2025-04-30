/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FindQuery } from "@/queries/resultQuery";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import FsLightbox from "fslightbox-react";
import { ArrowLeft, Download, Loader2, Mail } from "lucide-react";
import Wrapper from "@/components/wrapper";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sentEmail } from "@/actions/results";
import { toast } from "@/hooks/use-toast";
import JSZip from "jszip";
import Image from "next/image";

const Page = () => {
  const params = useParams();
  const { data, isLoading, isError } = FindQuery(params.id as string);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxToggler, setLightboxToggler] = useState(false);
  const [lightboxResultToggler, setLightboxResultToggler] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const openLightbox = (index: number) => {
    if (data?.channels?.ChannelImages[index]?.image_url) {
      setLightboxIndex(index);
      setLightboxToggler((prev) => !prev);
    }
  };

  const handleSentEmail = async () => {
    if (!data) {
      return toast({
        title: "Failed",
        description: "Data tidak tersedia, tidak dapat mengirim email!"
      });
    }

    setEmailLoading(true);

    try {
      const req = await sentEmail(data.id);

      if (req) {
        toast({
          title: "Success",
          description:
            "Foto berhasil dikirim melalui email, silahkan cek email Anda!"
        });
      } else {
        toast({
          title: "Failed",
          description:
            "Foto gagal dikirim melalui email, silahkan hubungi admin!"
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim email. Coba lagi nanti!"
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!data) return;

    setDownloadLoading(true);

    const imageUrls: string[] = [];

    if (data.image_url) {
      imageUrls.push(process.env.NEXT_PUBLIC_IMAGE_API + data.image_url);
    }

    if (data.channels && data.channels.ChannelImages) {
      data.channels.ChannelImages.forEach((image: any) => {
        if (image.image_url) {
          imageUrls.push(process.env.NEXT_PUBLIC_IMAGE_API + image.image_url);
        }
      });
    }

    if (imageUrls.length === 0) return;

    if (imageUrls.length === 1) {
      try {
        const response = await fetch(imageUrls[0]);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "image_main.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading image", error);
      }
    } else {
      const zip = new JSZip();
      for (const [index, url] of imageUrls.entries()) {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const fileName =
            index === 0 ? "image_main.jpg" : `image_${index}.jpg`;
          zip.file(fileName, blob);
        } catch (error) {
          console.error("Error fetching image for zip", error);
        }
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        const blobUrl = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "images.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      });
    }

    setDownloadLoading(false);
  };

  return (
    <Wrapper>
      <div className="my-40">
        {isError && (
          <div className="flex flex-col gap-4 justify-center items-center min-h-[500px] w-full">
            <p className="text-2xl">Maaf data foto tidak dapat ditemukan...</p>
            <Link href={"/canvas"} className={buttonVariants()}>
              <ArrowLeft /> Kembali Edit Foto
            </Link>
          </div>
        )}
        {!isError && isLoading ? (
          <div className="flex justify-center items-center min-h-[500px] w-full">
            <Loader2 className="animate-spin" size={52} />
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <h3 className="font-bold text-2xl">Hasil Foto Editan</h3>
              <div className="flex gap-2">
                <Button disabled={emailLoading} onClick={handleSentEmail}>
                  {emailLoading ? (
                    <>
                      <Loader2 className="animate-spin" /> Loading...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2" /> Kirim Ke Email
                    </>
                  )}
                </Button>
                <Button
                  disabled={downloadLoading}
                  onClick={handleDownloadImage}
                >
                  {downloadLoading ? (
                    <>
                      <Loader2 className="animate-spin" /> Loading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2" size={18} /> Download Gambar
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="flex justify-center items-center mt-10">
              {data?.image_url && (
                <>
                  <Image
                    unoptimized
                    width="700"
                    height="0"
                    sizes="100vw"
                    src={
                      data?.image_url && process.env.NEXT_PUBLIC_IMAGE_API
                        ? process.env.NEXT_PUBLIC_IMAGE_API + data.image_url
                        : ""
                    }
                    alt="image-result"
                    className="hover:cursor-pointer"
                    onClick={() => setLightboxResultToggler((prev) => !prev)}
                    draggable={false}
                  />

                  <FsLightbox
                    toggler={lightboxResultToggler}
                    sources={
                      data?.image_url && process.env.NEXT_PUBLIC_IMAGE_API
                        ? [process.env.NEXT_PUBLIC_IMAGE_API + data.image_url]
                        : []
                    }
                  />
                </>
              )}
            </div>

            <h3 className="text-2xl mb-5 pt-20 font-bold">Daftar Semua Foto</h3>
            <Separator className="mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              {data?.channels?.ChannelImages?.map((image, index) => (
                <div className="relative" key={image.id}>
                  <Image
                    width="600"
                    height="600"
                    sizes="100vw"
                    src={process.env.NEXT_PUBLIC_IMAGE_API + image.image_url}
                    alt="image-cloud"
                    className="hover:cursor-pointer"
                    onClick={() => openLightbox(index)}
                    draggable={false}
                  />
                </div>
              ))}
              <FsLightbox
                toggler={lightboxToggler}
                sources={
                  lightboxIndex !== null &&
                  data?.channels?.ChannelImages &&
                  process.env.NEXT_PUBLIC_IMAGE_API
                    ? [
                        process.env.NEXT_PUBLIC_IMAGE_API +
                          data.channels.ChannelImages[lightboxIndex].image_url
                      ]
                    : []
                }
              />
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default Page;
