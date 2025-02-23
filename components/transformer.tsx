/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const cropRectRef = useRef<any>(null);
  const cropTransformerRef = useRef<any>(null);

  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  const [_, setIsCropped] = useState(false);
  const prevIsCroppingRef = useRef(isCropping);
  const naturalDimsRef = useRef<{ width: number; height: number } | null>(null);
  const initialFactor = 2;

  const [imageProps, setImageProps] = useState({
    x: 100,
    y: 100,
    width: 0,
    height: 0
  });

  const imageRect = shapeRef.current
    ? shapeRef.current.getClientRect({ skipTransform: false })
    : {
        x: imageProps.x,
        y: imageProps.y,
        width: imageProps.width,
        height: imageProps.height
      };
  const stageWidth = 800;
  const stageHeight = 800;

  const handleCrop = () => {
    if (!cropRectRef.current || !shapeRef.current || !naturalDimsRef.current)
      return;
    let x = cropRectRef.current.x();
    let y = cropRectRef.current.y();
    let width = cropRectRef.current.width() * cropRectRef.current.scaleX();
    let height = cropRectRef.current.height() * cropRectRef.current.scaleY();

    const imageRect = shapeRef.current.getClientRect({ skipTransform: false });
    const originX = imageRect.x;
    const originY = imageRect.y;
    const originWidth = imageRect.width;
    const originHeight = imageRect.height;

    x = Math.max(x, originX);
    y = Math.max(y, originY);
    width = Math.min(width, originWidth - (x - originX));
    height = Math.min(height, originHeight - (y - originY));
    cropRectRef.current.setAttrs({
      x,
      y,
      width,
      height,
      scaleX: 1,
      scaleY: 1
    });
    if (cropTransformerRef.current) {
      cropTransformerRef.current.forceUpdate();
    }
    setCropX(x);
    setCropY(y);
    setCropWidth(width);
    setCropHeight(height);
  };

  useEffect(() => {
    if (photoUrl) {
      naturalDimsRef.current = {
        width: photoUrl.naturalWidth,
        height: photoUrl.naturalHeight
      };
      setImageProps({
        x: 100,
        y: 100,
        width: photoUrl.naturalWidth / initialFactor,
        height: photoUrl.naturalHeight / initialFactor
      });
    }
  }, [photoUrl]);

  useEffect(() => {
    if (isCropping) {
      setCropX(imageProps.x);
      setCropY(imageProps.y);
      setCropWidth(imageProps.width);
      setCropHeight(imageProps.height);
    }
  }, [isCropping, imageProps]);

  useEffect(() => {
    if (prevIsCroppingRef.current && !isCropping) {
      const imageNode = shapeRef.current;
      if (imageNode && naturalDimsRef.current) {
        const strokeOffset = 1;
        const displayedRect = imageNode.getClientRect({ skipTransform: false });
        const conversionFactorX =
          naturalDimsRef.current.width / displayedRect.width;
        const conversionFactorY =
          naturalDimsRef.current.height / displayedRect.height;
        const relativeCropX = cropX + strokeOffset - displayedRect.x;
        const relativeCropY = cropY + strokeOffset - displayedRect.y;
        const newCrop = {
          x: relativeCropX * conversionFactorX,
          y: relativeCropY * conversionFactorY,
          width: (cropWidth - strokeOffset * 2) * conversionFactorX,
          height: (cropHeight - strokeOffset * 2) * conversionFactorY
        };
        const canvas = document.createElement("canvas");
        canvas.width = newCrop.width;
        canvas.height = newCrop.height;
        const ctx = canvas.getContext("2d");
        const originalImage = imageNode.image();
        if (ctx && originalImage) {
          ctx.drawImage(
            originalImage,
            newCrop.x,
            newCrop.y,
            newCrop.width,
            newCrop.height,
            0,
            0,
            newCrop.width,
            newCrop.height
          );
          const dataURL = canvas.toDataURL();
          const newImg = new window.Image();
          newImg.src = dataURL;
          newImg.onload = () => {
            imageNode.image(newImg);
            imageNode.crop({
              x: 0,
              y: 0,
              width: newCrop.width,
              height: newCrop.height
            });
            const updatedWidth = newCrop.width / conversionFactorX;
            const updatedHeight = newCrop.height / conversionFactorY;
            imageNode.width(updatedWidth);
            imageNode.height(updatedHeight);
            imageNode.x(cropX);
            imageNode.y(cropY);
            setImageProps((prev) => ({
              ...prev,
              x: cropX,
              y: cropY,
              width: updatedWidth,
              height: updatedHeight
            }));
            setIsCropped(true);
            naturalDimsRef.current = {
              width: newCrop.width,
              height: newCrop.height
            };
            onChange(id, {
              x: cropX,
              y: cropY,
              width: updatedWidth,
              height: updatedHeight,
              crop: {
                x: 0,
                y: 0,
                width: newCrop.width,
                height: newCrop.height
              },
              scaleX: 1,
              scaleY: 1
            });
            if (imageNode.getLayer()) {
              imageNode.getLayer().batchDraw();
            }
          };
        }
      }
    }
    prevIsCroppingRef.current = isCropping;
  }, [
    isCropping,
    id,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    onChange,
    imageProps
  ]);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      setPhotoClicked(true);
      if (!isCropping && transformerRef.current) {
        transformerRef.current.nodes([shapeRef.current]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [isSelected, isCropping, setPhotoClicked]);

  useEffect(() => {
    if (isCropping && cropRectRef.current && cropTransformerRef.current) {
      cropTransformerRef.current.nodes([cropRectRef.current]);
      cropTransformerRef.current.getLayer().batchDraw();
    }
  }, [isCropping, cropX, cropY, cropWidth, cropHeight]);

  const imageElement = (
    <Image
      image={photoUrl}
      ref={shapeRef}
      draggable={!isCropping}
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={onDoubleClick}
      x={imageProps.x}
      y={imageProps.y}
      width={imageProps.width}
      height={imageProps.height}
      onDragEnd={(e) => {
        if (!isCropping) {
          const newX = e.target.x();
          const newY = e.target.y();
          setImageProps((prev) => ({ ...prev, x: newX, y: newY }));
          onChange(id, { x: newX, y: newY });
        }
      }}
      onTransformEnd={() => {
        if (!isCropping) {
          const node = shapeRef.current;
          const displayedRect = node.getClientRect({ skipTransform: false });
          node.scaleX(1);
          node.scaleY(1);
          setImageProps({
            x: displayedRect.x,
            y: displayedRect.y,
            width: Math.max(50, displayedRect.width),
            height: Math.max(50, displayedRect.height)
          });
          onChange(id, {
            x: displayedRect.x,
            y: displayedRect.y,
            width: Math.max(50, displayedRect.width),
            height: Math.max(50, displayedRect.height)
          });
        }
      }}
      onMouseEnter={() => {
        document.body.style.cursor = "pointer";
      }}
      onMouseLeave={() => {
        document.body.style.cursor = "default";
      }}
    />
  );

  return (
    <>
      {isCropping ? (
        <>
          {/* Tanpa clip sehingga seluruh foto tampil, meskipun melebihi batas canvas */}
          {imageElement}
          <Group>
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
            <Transformer
              ref={cropTransformerRef}
              rotateEnabled={false}
              enabledAnchors={[
                "top-left",
                "top-center",
                "top-right",
                "middle-left",
                "middle-right",
                "bottom-left",
                "bottom-center",
                "bottom-right"
              ]}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 50 || newBox.height < 50) return oldBox;
                let { x, y, width, height } = newBox;
                const maxX = imageRect.x + imageRect.width;
                const maxY = imageRect.y + imageRect.height;
                x = Math.max(imageRect.x, x);
                y = Math.max(imageRect.y, y);
                width = Math.min(width, maxX - x);
                height = Math.min(height, maxY - y);
                return { x, y, width, height, rotation: newBox.rotation };
              }}
            />
          </Group>
        </>
      ) : (
        <Group clip={{ x: 0, y: 0, width: stageWidth, height: stageHeight }}>
          {imageElement}
          {isSelected && (
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < 50)
                  return oldBox;
                return newBox;
              }}
            />
          )}
        </Group>
      )}
    </>
  );
};

export default PhotoWithTransformer;
