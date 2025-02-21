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

  // State untuk area crop (dalam koordinat stage)
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  // Flag untuk menandai crop sudah di‑bake
  const [isCropped, setIsCropped] = useState(false);
  const prevIsCroppingRef = useRef(isCropping);
  // Simpan ukuran natural (ukuran asli) dari gambar atau hasil crop sebelumnya
  const naturalDimsRef = useRef<{ width: number; height: number } | null>(null);
  // Faktor awal konversi: awalnya ditampilkan 1/2 dari ukuran natural
  const initialFactor = 2;

  // State untuk properti gambar (posisi dan dimensi tampilan)
  const [imageProps, setImageProps] = useState({
    x: 100,
    y: 100,
    width: 0,
    height: 0
  });

  // Saat photoUrl sudah tersedia, simpan ukuran natural dan inisialisasi imageProps
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

  // Saat masuk mode crop, update crop rectangle berdasarkan imageProps
  useEffect(() => {
    if (isCropping) {
      // Tidak mereset crop jika sudah di‑crop,
      // sehingga state hasil crop sebelumnya (ukuran dan posisi) tetap dipertahankan
      setCropX(imageProps.x);
      setCropY(imageProps.y);
      setCropWidth(imageProps.width);
      setCropHeight(imageProps.height);
    }
  }, [isCropping, imageProps]);

  // Saat keluar mode crop, "bake" crop ke gambar baru menggunakan offscreen canvas
  useEffect(() => {
    if (prevIsCroppingRef.current && !isCropping) {
      const imageNode = shapeRef.current;
      if (imageNode && naturalDimsRef.current) {
        const strokeOffset = 1;
        // Gunakan bounding box aktual dari node (memperhitungkan rotasi dan scaling)
        const displayedRect = imageNode.getClientRect({ skipTransform: false });
        const conversionFactor =
          naturalDimsRef.current.width / displayedRect.width;
        const relativeCropX = cropX + strokeOffset - displayedRect.x;
        const relativeCropY = cropY + strokeOffset - displayedRect.y;
        const newCrop = {
          x: relativeCropX * conversionFactor,
          y: relativeCropY * conversionFactor,
          width: (cropWidth - strokeOffset * 2) * conversionFactor,
          height: (cropHeight - strokeOffset * 2) * conversionFactor
        };
        // Buat offscreen canvas untuk mendapatkan gambar baru dari area crop
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
            // Update node dengan image baru
            imageNode.image(newImg);
            // Hapus properti crop agar transformasi resize berjalan normal
            imageNode.crop({
              x: 0,
              y: 0,
              width: newCrop.width,
              height: newCrop.height
            });
            // Update ukuran node sesuai dengan gambar baru (tampilan berdasarkan dimensi tampilan baru)
            const updatedWidth = newCrop.width / conversionFactor;
            const updatedHeight = newCrop.height / conversionFactor;
            imageNode.width(updatedWidth);
            imageNode.height(updatedHeight);
            // Tetapkan posisi baru sesuai dengan crop rectangle
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
            // Perbarui natural dims untuk sesi crop selanjutnya
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

  // Memperbarui boundary crop dengan menggunakan bounding box aktual dari gambar
  const handleCrop = () => {
    if (!cropRectRef.current || !shapeRef.current || !naturalDimsRef.current)
      return;
    let x = cropRectRef.current.x();
    let y = cropRectRef.current.y();
    let width = cropRectRef.current.width() * cropRectRef.current.scaleX();
    let height = cropRectRef.current.height() * cropRectRef.current.scaleY();

    // Gunakan bounding box aktual sebagai batas crop
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
    if (isSelected && shapeRef.current) {
      setPhotoClicked(true);
      if (!isCropping && transformerRef.current) {
        transformerRef.current.nodes([shapeRef.current]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [isSelected, isCropping, setPhotoClicked]);

  // Gunakan bounding box aktual untuk batas gambar
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
            // Dapatkan bounding box aktual dari node
            const displayedRect = node.getClientRect({ skipTransform: false });
            node.scaleX(1);
            node.scaleY(1);
            setImageProps({
              x: displayedRect.x,
              y: displayedRect.y,
              width: Math.max(50, displayedRect.width),
              height: Math.max(50, displayedRect.height)
            });
            // Perbarui naturalDims hanya jika gambar belum di‑crop
            if (!isCropped) {
              naturalDimsRef.current = {
                width: displayedRect.width * initialFactor,
                height: displayedRect.height * initialFactor
              };
            }
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
      {isCropping ? (
        <Group>
          {/* Overlay */}
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
          {/* Crop rectangle */}
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
      ) : (
        isSelected && (
          <Transformer
            ref={transformerRef}
            rotateEnabled={false}
            boundBoxFunc={(oldBox, newBox) => {
              if (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < 50)
                return oldBox;
              return newBox;
            }}
          />
        )
      )}
    </>
  );
};

export default PhotoWithTransformer;
