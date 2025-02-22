/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";

import dynamic from "next/dynamic";
import { Slider } from "@/components/ui/slider";
import { RetrieveQuery as TemplateQuery } from "@/queries/templateQuery";
import { FindQuery as ChannelImageQuery } from "@/queries/channelQuery";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useParams } from "next/navigation";
import { usePhotoStore } from "@/stores/usePhotoStore";
import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/wrapper";
import { useRouter } from "next/navigation";

const Canvas = dynamic(() => import("@/components/canvas"), {
  ssr: false
});

const Page = () => {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>({
    id: null,
    url: null
  });
  const [templateOpacityValue, setTemplateOpacityValue] = useState(0.5);
  const [toggleOpacityTemplate, setToggleOpacityTemplate] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const { addPhoto } = usePhotoStore();

  const { data: templates, isLoading: templateLoading } = TemplateQuery();
  const { data: photos, isLoading: photosLoading } = ChannelImageQuery(
    Number(params.id)
  );

  const canvasRef = useRef<any>(null);

  const handleUpload = async () => {
    if (canvasRef.current) {
      setLoadingUpload(true);
      await canvasRef.current.uploadImage();
      setLoadingUpload(false);
    } else {
      console.log("func not ready");
    }
  };

  const templateOpacity = useMemo(
    () => templateOpacityValue,
    [templateOpacityValue]
  );

  const insertSelectedImageToPhotos = () => {
    if (selectedImage) {
      addPhoto(selectedImage);
      setSelectedImage(null);
    }
  };

  useLayoutEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <div className="min-h-screen w-full">
      {!isMobile ? (
        <div className="grid grid-cols-12">
          <div className="hidden md:block col-span-12 md:col-span-4 shadow-2xl h-screen">
            <h3 className="font-bold text-2xl mb-5 text-center bg-primary text-white p-4">
              Pilih Asset Foto / Template
            </h3>
            <div className="p-2 h-[800px]">
              <Tabs defaultValue="photo" className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="photo">Pilih Foto</TabsTrigger>
                  <TabsTrigger value="template">Pilih Template</TabsTrigger>
                </TabsList>
                <TabsContent value="photo" className="h-full">
                  {photosLoading ? (
                    <div className="flex flex-col justify-center items-center gap-4 h-full">
                      <Loader2 className="animate-spin" />
                      <div className="text-muted-foreground">
                        Mencari daftar foto kamu...
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="h-full">
                      <div className="grid grid-cols-2 gap-2">
                        {photos?.ChannelImages.map((photo) => (
                          <Card
                            key={photo.id}
                            className={`cursor-pointer hover:border-primary transition-all p-1 ${
                              selectedImage === photo.image_url
                                ? "border-2 border-primary"
                                : ""
                            }`}
                            onClick={() => {
                              if (selectedImage === photo.image_url) {
                                setSelectedImage(null);
                              } else {
                                setSelectedImage(photo.image_url);
                              }
                            }}
                          >
                            <div className="relative h-auto">
                              <CldImage
                                width="960"
                                height="600"
                                sizes="100vw"
                                src={photo.public_id}
                                alt="image-cloud"
                                className="rounded-md"
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                  {selectedImage ? (
                    <div className="mt-auto">
                      <Button
                        className="w-full"
                        onClick={insertSelectedImageToPhotos}
                      >
                        Masukkan Foto
                      </Button>
                    </div>
                  ) : null}
                </TabsContent>
                <TabsContent value="template" className="h-full">
                  {templateLoading ? (
                    <div className="flex flex-col justify-center items-center gap-4 h-full">
                      <Loader2 className="animate-spin" />
                      <div className="text-muted-foreground">
                        Mencari template yang tersedia...
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="h-full">
                      <div className="grid grid-cols-2 gap-2">
                        {templates?.map((template) => (
                          <Card
                            key={template.id}
                            className={`cursor-pointer hover:border-primary transition-all p-1 ${
                              selectedTemplate.url === template.image_url
                                ? "border-2 border-primary"
                                : ""
                            }`}
                            onClick={() => {
                              if (template.image_url === selectedTemplate.url) {
                                setSelectedTemplate({
                                  url: null,
                                  id: null
                                });
                              } else {
                                setSelectedTemplate({
                                  url: template.image_url,
                                  id: template.id
                                });
                              }
                            }}
                          >
                            <div className="relative h-auto">
                              <CldImage
                                width="960"
                                height="600"
                                sizes="100vw"
                                src={template.public_id}
                                alt="image-cloud"
                                className="rounded-md"
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 p-2 bg-gray-50">
            <div className="flex flex-col justify-center items-center w-full h-full">
              <div className="flex w-full justify-between">
                <Button onClick={() => router.push("/")}>
                      <ArrowLeft /> Back
                </Button>
                <div className="flex w-full justify-end gap-4 mb-10">
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => setToggleOpacityTemplate((prev) => !prev)}
                    >
                      Ubah Opacity Template
                    </Button>
                    {toggleOpacityTemplate && (
                      <Slider
                        defaultValue={[templateOpacity]}
                        max={1}
                        step={0.1}
                        onValueChange={(value) =>
                          setTemplateOpacityValue(value[0])
                        }
                      />
                    )}
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={loadingUpload}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {loadingUpload ? (
                      <>
                        <Loader2 className="animate-spin" /> Loading...
                      </>
                    ) : (
                      <p>Selesai Mengedit</p>
                    )}
                  </Button>
                </div>
              </div>
              <Canvas
                ref={canvasRef}
                channelId={Number(params.id)}
                templateId={selectedTemplate.id}
                templateImage={selectedTemplate.url ?? ""}
                templateOpacity={templateOpacity}
              />
            </div>
          </div>
        </div>
      ) : (
        <Wrapper>
          <div className="grid grid-cols-1 ms:grid-cols-2 gap-4 w-full h-screen items-center justify-center">
            <div className="flex flex-col justify-center gap-4 order-2 md:order-1">
              <h3 className="font-bold text-3xl">Halaman Tidak Bisa Diakses</h3>
              <p className="text-muted-foreground w-[80%]">
                Halaman ini tidak dapat diakses pada resolusi mobile. Silakan
                gunakan perangkat dengan layar lebih besar untuk pengalaman
                terbaik.
              </p>
              <div className="relative">
                <Link href={"/"} className={buttonVariants()}>
                  <ArrowLeft /> Ke halaman utama
                </Link>
              </div>
            </div>
            <div className="relative h-[500px] w-full rounded-lg bg-blue-50 order-1 md:order-2">
              <Image
                src={"/images/feeling-sorry.png"}
                alt="sorry"
                fill
                sizes="100%"
                className="object-contain"
                draggable={false}
              />
            </div>
          </div>
        </Wrapper>
      )}
    </div>
  );
};

export default Page;
