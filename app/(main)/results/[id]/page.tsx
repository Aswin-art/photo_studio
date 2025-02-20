"use client";
import { FindQuery } from "@/queries/resultQuery";
import { CldImage } from "next-cloudinary";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import FsLightbox from "fslightbox-react";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Wrapper from "@/components/wrapper";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sentEmail } from "@/actions/results";
import { toast } from "@/hooks/use-toast";

const Page = () => {
  const params = useParams();
  const { data, isLoading, isError } = FindQuery(Number(params.id));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxToggler, setLightboxToggler] = useState(false);
  const [lightboxResultToggler, setLightboxResultToggler] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

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

  return (
    <Wrapper>
      <div className="mt-40">
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
              <Button disabled={emailLoading} onClick={handleSentEmail}>
                {emailLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Loading...
                  </>
                ) : (
                  <>
                    <Mail /> Kirim Ke Email
                  </>
                )}
              </Button>
            </div>
            <div className="flex justify-center items-center mt-10">
              <CldImage
                width="700"
                height="0"
                sizes="100vw"
                src={data?.public_id ?? ""}
                alt="image-result"
                className="hover:cursor-pointer"
                onClick={() => setLightboxResultToggler((prev) => !prev)}
                draggable={false}
              />

              <FsLightbox
                toggler={lightboxResultToggler}
                sources={data?.image_url ? [data.image_url] : []}
              />
            </div>

            <h3 className="text-2xl mb-5 pt-20 font-bold">Daftar Semua Foto</h3>
            <Separator className="mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              {data?.channels?.ChannelImages?.map((image, index) => (
                <div className="relative" key={image.id}>
                  <CldImage
                    width="600"
                    height="600"
                    sizes="100vw"
                    src={image.public_id}
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
                  lightboxIndex !== null && data?.channels?.ChannelImages
                    ? [data.channels.ChannelImages[lightboxIndex].image_url]
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
