/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import { usePhotoStore } from "@/stores/usePhotoStore";
import React, { useRef } from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

const PhotoWithTransformer = ({
  imageSrc,
  isSelected,
  onSelect,
  onChange,
  id
}: {
  imageSrc: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (id: string, newAttrs: any) => void;
  id: string;
}) => {
  const { setPhotoClicked } = usePhotoStore();
  const [photoUrl] = useImage(imageSrc, "anonymous", "origin");
  const shapeRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  const handleImageMouseEnter = () => {
    document.body.style.cursor = "pointer";
  };

  const handleImageMouseLeave = () => {
    document.body.style.cursor = "default";
  };

  React.useEffect(() => {
    if (isSelected && shapeRef.current) {
      setPhotoClicked(true);
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        image={photoUrl}
        ref={shapeRef}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        x={100}
        y={100}
        width={500}
        height={500}
        onDragEnd={(e) => {
          onChange(id, {
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const newWidth = node.width() * node.scaleX();
          const newHeight = node.height() * node.scaleY();

          onChange(id, {
            x: node.x(),
            y: node.y(),
            width: Math.max(50, newWidth),
            height: Math.max(50, newHeight)
          });
        }}
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < 50) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default PhotoWithTransformer;
