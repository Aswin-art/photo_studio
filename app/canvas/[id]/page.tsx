/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";
import { Slider } from "@/components/ui/slider";
import { RetrieveQuery as TemplateQuery } from "@/queries/templateQuery";
import { FindQuery as ChannelImageQuery } from "@/queries/channelQuery";
import { Loader2 } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useParams } from "next/navigation";
import { usePhotoStore } from "@/stores/usePhotoStore";

const Canvas = dynamic(() => import("@/components/canvas"), {
  ssr: false
});

const Page = () => {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateOpacityValue, setTemplateOpacityValue] = useState(0.5);
  const [toggleOpacityTemplate, setToggleOpacityTemplate] = useState(false);

  const { addPhoto } = usePhotoStore();

  const { data: templates, isLoading: templateLoading } = TemplateQuery();
  const { data: photos, isLoading: photosLoading } = ChannelImageQuery(
    Number(params.id)
  );

  const canvasRef = useRef<any>(null);

  const handleDownload = () => {
    if (canvasRef.current) {
      canvasRef.current.downloadImage();
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

  return (
    <div className="min-h-screen w-full">
      <div className="grid grid-cols-12">
        <div className="hidden lg:block col-span-12 lg:col-span-4 shadow-lg h-screen">
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
                  <Loader2 className="animate-spin" />
                ) : (
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-2 gap-2">
                      {photos?.ChannelImages.map((photo, id) => (
                        <Card
                          key={id}
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
                          <div className="relative h-[200px]">
                            <CldImage
                              width="960"
                              height="600"
                              sizes="100vw"
                              src={photo.public_id}
                              alt="image-cloud"
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
                  <Loader2 className="animate-spin" />
                ) : (
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-2 gap-2">
                      {templates?.map((template, id) => (
                        <Card
                          key={id}
                          className={`cursor-pointer hover:border-primary transition-all p-1 ${
                            selectedTemplate === template.image_url
                              ? "border-2 border-primary"
                              : ""
                          }`}
                          onClick={() => {
                            if (template.image_url === selectedTemplate) {
                              setSelectedTemplate(null);
                            } else {
                              setSelectedTemplate(template.image_url);
                            }
                          }}
                        >
                          <div className="relative h-[200px]">
                            <CldImage
                              width="960"
                              height="600"
                              sizes="100vw"
                              src={template.public_id}
                              alt="image-cloud"
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
        <div className="col-span-12 lg:col-span-8 p-2">
          <div className="flex flex-col justify-center items-center w-full h-full bg-gray-50">
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
                    onValueChange={(value) => setTemplateOpacityValue(value[0])}
                  />
                )}
              </div>
              <Button
                onClick={handleDownload}
                className="bg-green-500 hover:bg-green-600"
              >
                Selesai Mengedit
              </Button>
            </div>
            <Canvas
              ref={canvasRef}
              templateImage={selectedTemplate ?? ""}
              templateOpacity={templateOpacity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
