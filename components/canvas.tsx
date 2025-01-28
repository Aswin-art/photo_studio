/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import PhotoWithTransformer from "./transformer";
import Konva from "konva";
import { usePhotoStore } from "@/stores/usePhotoStore";

type Props = {
  templateImage: string;
  templateOpacity: number;
};

const Canvas = forwardRef(function Canvas(
  { templateImage, templateOpacity }: Props,
  ref
) {
  const [templateUrl] = useImage(templateImage, "anonymous");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [, setPhotoAttrs] = useState<any>({});

  const { photoImages, deletePhoto } = usePhotoStore();

  const stageRef = useRef<Konva.Stage | null>(null);

  const checkDeselect = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
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
    setSelectedId(null);
  };

  useImperativeHandle(ref, () => ({
    downloadImage: () => {
      if (stageRef.current) {
        const uri = stageRef.current.toDataURL({
          pixelRatio: 3
        });
        const link = document.createElement("a");
        link.href = uri;
        link.download = "result.png";
        link.click();
      }
    }
  }));

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
    <Stage
      ref={stageRef}
      width={800}
      height={800}
      className="bg-white shadow-lg"
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {photoImages.map((image) => {
          return (
            <PhotoWithTransformer
              key={image.id}
              id={image.id}
              imageSrc={image.src}
              isSelected={selectedId === image.id}
              onSelect={() => setSelectedId(image.id)}
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
  );
});

export default Canvas;
