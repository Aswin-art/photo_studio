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

type Props = {
  photoImages: string[] | [];
  templateImage: string;
  templateOpacity: number;
};

const Canvas = forwardRef(function Canvas(
  { photoImages, templateImage, templateOpacity }: Props,
  ref
) {
  const [templateUrl] = useImage(templateImage, "anonymous");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [, setPhotoAttrs] = useState<any>({});

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
    // const updatedPhotos = photoImages.filter(
    //   (_, index) => `photo-${index}` !== id
    // );
    console.log(id);
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
        handleDeletePhoto(selectedId); // Delete selected photo on backspace
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
        {photoImages.map((image, index) => {
          const photoId = `photo-${index}`;
          return (
            <PhotoWithTransformer
              key={photoId}
              id={photoId}
              imageSrc={image}
              isSelected={selectedId === photoId}
              onSelect={() => setSelectedId(photoId)}
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
