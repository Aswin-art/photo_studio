/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import { usePhotoStore } from "@/stores/usePhotoStore";
import React, { useRef, useEffect, useState } from "react";
import { Image, Transformer, Rect, Group } from "react-konva";
import useImage from "use-image";

type PhotoWithTransformerProps = {
  imageSrc: string;
  isSelected: boolean;
  isCropping?: boolean;
  onSelect: () => void;
  onDoubleClick?: () => void;
  onChange: (id: string, newAttrs: any) => void;
  id: string;
};

const PhotoWithTransformer = ({
  imageSrc,
  isSelected,
  isCropping = false,
  onSelect,
  onDoubleClick,
  onChange,
  id
}: PhotoWithTransformerProps) => {
  const { setPhotoClicked } = usePhotoStore();
  const [photoUrl] = useImage(imageSrc, "anonymous", "origin");
  const shapeRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  // Refs untuk crop rectangle dan crop transformer
  const cropRectRef = useRef<any>(null);
  const cropTransformerRef = useRef<any>(null);

  // State untuk area crop (posisi dan ukuran)
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);

  // Simpan nilai sebelumnya dari isCropping
  const prevIsCroppingRef = useRef(isCropping);
  useEffect(() => {
    if (prevIsCroppingRef.current && !isCropping) {
      // Saat mode crop berakhir, update image berdasarkan crop area
      onChange(id, {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
        scaleX: 1,
        scaleY: 1
      });
    }
    prevIsCroppingRef.current = isCropping;
  }, [isCropping, id, cropX, cropY, cropWidth, cropHeight, onChange]);

  useEffect(() => {
    if (isCropping) {
      const node = shapeRef.current;
      if (node) {
        setCropX(node.x());
        setCropY(node.y());
        setCropWidth(node.width() * node.scaleX());
        setCropHeight(node.height() * node.scaleY());
      }
    }
  }, [isCropping]);

  const handleImageMouseEnter = () => {
    document.body.style.cursor = "pointer";
  };

  const handleImageMouseLeave = () => {
    document.body.style.cursor = "default";
  };

  // Fungsi tambahan: implementasi crop sesuai referensi (tanpa mengubah algoritma lain)
  const handleCrop = () => {
    if (!cropRectRef.current || !shapeRef.current) return;
    let x = cropRectRef.current.x();
    let y = cropRectRef.current.y();
    let width = cropRectRef.current.width() * cropRectRef.current.scaleX();
    let height = cropRectRef.current.height() * cropRectRef.current.scaleY();
    const originWidth = shapeRef.current.width();
    const originHeight = shapeRef.current.height();
    if (x < 0) {
      width += x;
      x = 0;
    }
    if (x + width > originWidth) {
      width = originWidth - x;
    }
    if (y < 0) {
      height += y;
      y = 0;
    }
    if (y + height > originHeight) {
      height = originHeight - y;
    }
    cropRectRef.current.setAttrs({
      x,
      y,
      width,
      height,
      scaleX: 1,
      scaleY: 1
    });
    if (cropTransformerRef.current) {
      cropTransformerRef.current.absolutePosition(
        cropRectRef.current.absolutePosition()
      );
    }
    // (Jika ada grid atau clipping group, update di sini sesuai referensi)
  };

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      setPhotoClicked(true);
      if (!isCropping && transformerRef.current) {
        transformerRef.current.nodes([shapeRef.current]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [isSelected, isCropping, setPhotoClicked]);

  // Jika dalam mode crop, peroleh bounding box image sebagai referensi
  const imageRect = shapeRef.current
    ? shapeRef.current.getClientRect()
    : { x: 0, y: 0, width: 0, height: 0 };
  const stageWidth = 800;
  const stageHeight = 800;

  // Pasang crop transformer pada crop rectangle bila mode crop aktif
  useEffect(() => {
    if (isCropping && cropRectRef.current && cropTransformerRef.current) {
      cropTransformerRef.current.nodes([cropRectRef.current]);
      cropTransformerRef.current.getLayer().batchDraw();
    }
  }, [isCropping, cropX, cropY, cropWidth, cropHeight]);

  return (
    <>
      <Image
        image={photoUrl}
        ref={shapeRef}
        draggable={!isCropping}
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={onDoubleClick}
        x={100}
        y={100}
        width={photoUrl && photoUrl.naturalWidth / 2}
        height={photoUrl && photoUrl.naturalHeight / 2}
        crop={
          !isCropping && cropWidth > 0 && cropHeight > 0 && shapeRef.current
            ? {
                x: (cropX - shapeRef.current.x()) * 2,
                y: (cropY - shapeRef.current.y()) * 2,
                width: cropWidth * 2,
                height: cropHeight * 2
              }
            : undefined
        }
        onDragEnd={(e) => {
          if (!isCropping) {
            onChange(id, {
              x: e.target.x(),
              y: e.target.y()
            });
          }
        }}
        onTransformEnd={() => {
          if (!isCropping) {
            const node = shapeRef.current;
            const newWidth = node.width() * node.scaleX();
            const newHeight = node.height() * node.scaleY();
            onChange(id, {
              x: node.x(),
              y: node.y(),
              width: Math.max(50, newWidth),
              height: Math.max(50, newHeight)
            });
          }
        }}
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
      />
      {isCropping ? (
        <>
          {/* Transformer dan overlay untuk crop */}
          <Group>
            {/* Overlay di luar area crop */}
            <Rect
              x={0}
              y={0}
              width={stageWidth}
              height={cropY}
              fill="rgba(0,0,0,0.5)"
              listening={false}
            />
            <Rect
              x={0}
              y={cropY}
              width={cropX}
              height={cropHeight}
              fill="rgba(0,0,0,0.5)"
              listening={false}
            />
            <Rect
              x={cropX + cropWidth}
              y={cropY}
              width={stageWidth - (cropX + cropWidth)}
              height={cropHeight}
              fill="rgba(0,0,0,0.5)"
              listening={false}
            />
            <Rect
              x={0}
              y={cropY + cropHeight}
              width={stageWidth}
              height={stageHeight - (cropY + cropHeight)}
              fill="rgba(0,0,0,0.5)"
              listening={false}
            />
            {/* Crop rectangle sebagai guide resizable */}
            <Rect
              ref={cropRectRef}
              x={cropX}
              y={cropY}
              width={cropWidth}
              height={cropHeight}
              stroke="white"
              strokeWidth={2}
              dash={[4, 4]}
              draggable
              dragBoundFunc={(pos) => {
                const newX = Math.max(
                  imageRect.x,
                  Math.min(pos.x, imageRect.x + imageRect.width - cropWidth)
                );
                const newY = Math.max(
                  imageRect.y,
                  Math.min(pos.y, imageRect.y + imageRect.height - cropHeight)
                );
                return { x: newX, y: newY };
              }}
              onDragEnd={(e) => {
                setCropX(e.target.x());
                setCropY(e.target.y());
                handleCrop();
              }}
              onTransformEnd={(e) => {
                const node: any = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                node.width(node.width() * scaleX);
                node.height(node.height() * scaleY);
                node.scaleX(1);
                node.scaleY(1);
                setCropX(node.x());
                setCropY(node.y());
                setCropWidth(node.width());
                setCropHeight(node.height());
                handleCrop();
              }}
            />
            {/* Transformer untuk crop rectangle */}
            <Transformer
              ref={cropTransformerRef}
              rotateEnabled={false}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
                "middle-left",
                "middle-right"
              ]}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 50 || newBox.height < 50) {
                  return oldBox;
                }
                const maxX = imageRect.x + imageRect.width;
                const maxY = imageRect.y + imageRect.height;
                return {
                  ...newBox,
                  x: Math.max(imageRect.x, newBox.x),
                  y: Math.max(imageRect.y, newBox.y),
                  width: Math.min(newBox.width, maxX - newBox.x),
                  height: Math.min(newBox.height, maxY - newBox.y)
                };
              }}
            />
          </Group>
        </>
      ) : (
        isSelected && (
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < 50) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )
      )}
    </>
  );
};

export default PhotoWithTransformer;
