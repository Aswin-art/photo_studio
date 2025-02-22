/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import useImage from "use-image";
import PhotoWithTransformer from "./transformer";
import Konva from "konva";
import { usePhotoStore } from "@/stores/usePhotoStore";
import { create } from "@/actions/results";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Check, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Props = {
  templateImage: string;
  templateOpacity: number;
  channelId: number;
  templateId: number;
};

const Canvas = forwardRef(function Canvas(
  { templateImage, templateOpacity, channelId, templateId }: Props,
  ref
) {
  const [templateUrl] = useImage(templateImage, "anonymous");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [croppingId, setCroppingId] = useState<string | null>(null);
  const [, setPhotoAttrs] = useState<any>({});
  const templateIdRef = useRef(templateId);

  const { photoImages, deletePhoto, isPhotoClicked, setPhotoClicked } =
    usePhotoStore();

  const stageRef = useRef<Konva.Stage | null>(null);
  const router = useRouter();

  const checkDeselect = (e: any) => {
    if (e.target === e.target.getStage()) {
      if (croppingId !== null) {
        setCroppingId(null);
      } else {
        setPhotoClicked(false);
        setSelectedId(null);
      }
    }
  };

  const handlePhotoChange = (id: string, newAttrs: any) => {
    setPhotoAttrs((prev: any) => ({
      ...prev,
      [id]: newAttrs
    }));
  };

  const handleDeletePhoto = (id: string) => {
    deletePhoto(id);
    setPhotoClicked(false);
    setSelectedId(null);
    setCroppingId(null);
  };

  useImperativeHandle(
    ref,
    () => ({
      uploadImage: async () => {
        if (!templateIdRef.current) {
          toast({
            title: "Failed",
            description: "Mohon untuk memilih template terlebih dahulu!"
          });
          return null;
        }
        if (stageRef.current) {
          const uri = stageRef.current.toDataURL({
            pixelRatio: 3
          });
          const base64Response = await fetch(uri);
          const blob = await base64Response.blob();

          const formData = new FormData();
          formData.append("file", blob);
          formData.append("upload_preset", "results");
          formData.append("folder", "results");
          formData.append(
            "api_key",
            process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ?? ""
          );

          try {
            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
              {
                method: "POST",
                body: formData
              }
            );

            if (!response.ok) {
              throw new Error(
                `Cloudinary upload failed: ${response.statusText}`
              );
            }

            const data = await response.json();
            const res = await create(
              data.public_id,
              data.url,
              templateIdRef.current,
              channelId
            );
            router.push("/results/" + res?.id);
          } catch (error) {
            toast({
              title: "Failed",
              description: "Tidak bisa menyimpan foto!"
            });
            console.log("Upload failed:", error);
            return null;
          }
        }
      }
    }),
    []
  );

  useEffect(() => {
    templateIdRef.current = templateId;
  }, [templateId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && selectedId) {
        handleDeletePhoto(selectedId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedId]);

  return (
    <div className="grid grid-cols-12 gap-2">
      <Stage
        ref={stageRef}
        width={800}
        height={800}
        className="bg-gray-200 shadow-2xl col-span-11"
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {croppingId && (
            <Rect
              x={0}
              y={0}
              width={800}
              height={800}
              fill="black"
              opacity={0.5}
              onClick={checkDeselect}
            />
          )}

          {photoImages.map((image) => {
            return (
              <PhotoWithTransformer
                key={image.id}
                id={image.id}
                imageSrc={image.src}
                isSelected={selectedId === image.id}
                isCropping={croppingId === image.id}
                onSelect={() => {
                  setSelectedId(image.id);
                  if (croppingId && croppingId !== image.id) {
                    setCroppingId(null);
                  }
                }}
                onDoubleClick={() => setCroppingId(image.id)}
                onChange={handlePhotoChange}
              />
            );
          })}

          {templateUrl && (
            <Image
              image={templateUrl}
              x={0}
              y={0}
              width={800}
              height={800}
              listening={false}
              opacity={templateOpacity}
            />
          )}
        </Layer>
      </Stage>

      <div className="flex flex-col gap-4">
        {isPhotoClicked && (
          <Button
            onClick={() => handleDeletePhoto(selectedId as string)}
            className="col-span-1 bg-red-500 p-0 text-white w-10 h-10 flex items-center justify-center shadow-lg hover:bg-red-600 transition duration-200"
          >
            <Trash2 size={32} />
          </Button>
        )}

        {croppingId && (
          <Button
            onClick={() => setCroppingId(null)}
            className="bg-blue-500 p-0 text-white w-8 h-8 flex items-center justify-center shadow-lg hover:bg-blue-600 transition duration-200"
          >
            <Check size={20} />
          </Button>
        )}
      </div>
    </div>
  );
});

export default Canvas;
