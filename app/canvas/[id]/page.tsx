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
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { usePhotoStore } from "@/stores/usePhotoStore";
import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/wrapper";
import { toast } from "@/hooks/use-toast";

const Canvas = dynamic(() => import("@/components/canvas"), {
  ssr: false
});

const halvePx = (value: string, divider: number = 2): string => {
  const num = parseFloat(value); // Extract numeric part
  if (isNaN(num)) return value; // Return null if not a valid number
  return `${num / divider}px`; // Halve the number and add "px"
};

const Page = () => {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>();
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);
  const [templateOpacityValue, setTemplateOpacityValue] = useState(0.5);
  const [toggleOpacityTemplate, setToggleOpacityTemplate] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const { addPhoto, deletePhoto } = usePhotoStore();

  const { data: templates, isLoading: templateLoading } = TemplateQuery();
  const { data: photos, isLoading: photosLoading } = ChannelImageQuery(
    params.id as string
  );

  const canvasRef = useRef<any>(null);

  const handleFinishEdit = (image: string) => {
    if (selectedFrame != null) {
      selectedTemplate.content.element[selectedFrame].src = image;

      setSelectedFrame(null);
      deletePhoto("0");
    }
  };

  const handleUpload = async () => {
    if (canvasRef.current) {
      setLoadingUpload(true);
      await canvasRef.current.uploadImage();
      setLoadingUpload(false);
    } else {
      return toast({
        title: "Failed",
        description: "Ulangi lagi, fungsi belum siap!"
      });
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
    <div className="min-h-screen w-full h-[100vh]">
      {!isMobile ? (
        <div className="grid grid-cols-12">
          <div className="hidden md:block col-span-12 md:col-span-4 shadow-2xl h-screen">
            <h3 className="font-bold text-2xl mb-5 text-center bg-primary text-white p-4">
              Pilih Asset Foto / Template
            </h3>
            <div className="p-2 ">
              <Tabs defaultValue="photo" className="w-full">
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
                              <Image
                                width="960"
                                height="600"
                                sizes="100vw"
                                src={
                                  process.env.NEXT_PUBLIC_IMAGE_API +
                                  photo.image_url
                                }
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
                        {templates?.map(
                          (template, i) =>
                            template.content && (
                              <div
                                key={i}
                                className="flex justify-center w-full"
                                onClick={() => setSelectedTemplate(template)}
                              >
                                <div
                                  key={template}
                                  className=""
                                  style={{
                                    width: halvePx(
                                      template.content.canvas.width
                                    ),
                                    height: halvePx(
                                      template.content.canvas.height
                                    ),
                                    position: "relative"
                                  }}
                                >
                                  {template.content.element
                                    .sort((a, b) => a.layer - b.layer)
                                    .map((shape, index) => (
                                      <div
                                        key={index}
                                        style={{
                                          width: halvePx(shape.width),
                                          height: halvePx(shape.height),
                                          position: "absolute",
                                          left: halvePx(shape.x),
                                          top: halvePx(shape.y),
                                          transform: `rotate(${shape.angle}deg)`,
                                          borderRadius:
                                            shape.type === "circle"
                                              ? "50%"
                                              : `${shape.borderRadius / 2}px`,
                                          cursor: "grab",
                                          backgroundColor:
                                            shape.type === "image"
                                              ? "transparent"
                                              : shape.color,
                                          backgroundImage:
                                            shape.type === "image"
                                              ? `url(${shape.src})`
                                              : "none",
                                          backgroundSize: "cover",
                                          zIndex: shape.layer
                                        }}
                                      />
                                    ))}
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 p-2 ">
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex w-full justify-between">
                <Button onClick={() => router.push("/")}>
                  <ArrowLeft /> Back
                </Button>
                <div className="flex w-full justify-end gap-4">
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
            </div>
            <div className="grid grid-cols-12 gap-3 ">
              <div className="flex justify-center w-full col-span-9 pt-10">
                {selectedTemplate && selectedFrame == null && (
                  <div
                    className="outline outline-2 outline-blue-500 outline-offset-2"
                    style={{
                      width: selectedTemplate.content.canvas.width,
                      height: selectedTemplate.content.canvas.height,
                      position: "relative",
                      margin: "20px auto"
                    }}
                  >
                    {selectedTemplate.content.element
                      .sort((a, b) => a.layer - b.layer)
                      .map((shape, index) => (
                        <div
                          key={index}
                          style={{
                            width: shape.width,
                            height: shape.height,
                            position: "absolute",
                            left: shape.x,
                            top: shape.y,
                            transform: `rotate(${shape.angle}deg)`,
                            borderRadius:
                              shape.type === "circle"
                                ? "50%"
                                : `${shape.borderRadius}px`,
                            cursor: "grab",
                            backgroundColor:
                              shape.type === "image"
                                ? "transparent"
                                : shape.color,
                            backgroundImage:
                              shape.type === "image"
                                ? `url(${shape.src})`
                                : "none",
                            backgroundSize: "cover",
                            zIndex: shape.layer
                          }}
                        >
                          {shape.src && shape.type !== "image" ? (
                            <img
                              src={shape.src}
                              alt="shape"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius:
                                  shape.type === "circle"
                                    ? "50%"
                                    : `${shape.borderRadius}px`
                              }}
                            />
                          ) : null}
                        </div>
                      ))}
                  </div>
                )}
                {selectedFrame != null && selectedTemplate && (
                  <Canvas
                    ref={canvasRef}
                    channelId={params.id as string}
                    templateId={selectedTemplate.id}
                    templateImage={selectedTemplate.url ?? ""}
                    templateOpacity={templateOpacity}
                    frame={selectedTemplate.content.element[selectedFrame]}
                    handleFinish={handleFinishEdit}
                  />
                )}
              </div>
              {selectedTemplate && (
                <div className="col-span-3 bg-white px-3 py-2.5 pt-10">
                  {selectedTemplate.content.element.map((element, i: number) =>
                    element.type != "image" ? (
                      <div
                        key={i}
                        className="flex justify-center gap-4 my-4 cursor-pointer"
                        onClick={() => setSelectedFrame(i)}
                      >
                        {element.src ? (
                          <img
                            src={element.src}
                            loading="lazy"
                            alt="Frame Preview"
                            className="outline outline-2 outline-gray-500 outline-offset-2 rounded"
                            style={{
                              width: halvePx(element.width, 3),
                              height: halvePx(element.height, 3),
                              objectFit: "cover"
                            }}
                          />
                        ) : (
                          <div
                            className="outline outline-2 outline-gray-500 outline-offset-2 rounded flex justify-center items-center"
                            style={{
                              width: halvePx(element.width, 3),
                              height: halvePx(element.height, 3)
                            }}
                          >
                            <Plus />
                          </div>
                        )}
                      </div>
                    ) : null
                  )}
                </div>
              )}
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
