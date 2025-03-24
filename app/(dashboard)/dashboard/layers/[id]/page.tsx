/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash, Upload } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { FindUniqueQuery } from "@/queries/templateQuery";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { setContent } from "@/actions/templates";
import { useParams } from "next/navigation";
import { JsonValue } from "@prisma/client/runtime/library";

const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};
const parseJson = (value: JsonValue | undefined): any => {
  if (typeof value === "object") {
    return value;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error("Invalid JSON string:", error);
    }
  }
  return null;
};

const Page = () => {
  const params = useParams();
  const { data } = FindUniqueQuery(params.id as string);
  const [aspectRatio, setAspectRatio] = useState<string>("");
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [shapes, setShapes] = useState<any[]>([]);
  const [dragging, setDragging] = useState<number | null>(null);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);

  useEffect(() => {
    const jsonData = parseJson(data?.content);
    if (jsonData) {
      setCanvasSize(jsonData.canvas);
      setShapes(jsonData.element);
    }
  }, [data]);

  const handleSetAspectRatio = () => {
    const [width, height] = aspectRatio.split(":").map(Number);
    if (width && height) {
      setCanvasSize({ width: 500, height: (500 / width) * height });
    }
  };

  const addShape = (type: "rectangle" | "circle") => {
    setShapes([
      ...shapes,
      {
        type,
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        angle: 0,
        borderRadius: 0,
        layer: 1,
        color: getRandomColor()
      }
    ]);
  };

  const addImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setShapes([
        ...shapes,
        {
          type: "image",
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          angle: 0,
          layer: 1,
          src: e.target?.result
        }
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      addImage(file);
    }
  };

  const startDrag = (index: number) => {
    setDragging(index);
  };

  const onDrag = (e: React.MouseEvent) => {
    if (dragging !== null && canvasSize) {
      const canvas = e.currentTarget as HTMLDivElement;
      const rect = canvas.getBoundingClientRect(); // Get the container's position

      const newShapes = [...shapes];
      const shape = newShapes[dragging];

      const newX = e.clientX - rect.left - shape.width / 2; // Adjust relative to container
      const newY = e.clientY - rect.top - shape.height / 2;

      const maxX = canvasSize.width - shape.width;
      const maxY = canvasSize.height - shape.height;

      shape.x = Math.max(0, Math.min(maxX, newX));
      shape.y = Math.max(0, Math.min(maxY, newY));

      setShapes(newShapes);
    }
  };

  const stopDrag = () => {
    setDragging(null);
  };

  const updateShape = (key: string, value: number) => {
    if (selectedShape !== null) {
      const newShapes = [...shapes];
      newShapes[selectedShape][key] = value;
      setShapes(newShapes);
    }
  };

  const deleteShape = () => {
    const newShape = shapes.filter((_, i) => i !== selectedShape);
    setShapes(newShape);
    setSelectedShape(null);
  };

  const save = async () => {
    try {
      await setContent(
        {
          canvas: canvasSize,
          element: shapes
        },
        params.id as string
      );
      toast({
        title: "Success",
        description: "Template baru telah berhasil dibuat!"
      });
    } catch (err: any) {
      console.log(err.stack);
      toast({
        title: "Failed",
        description: "Server mengalami masalah!"
      });
      return null;
    }
  };
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/templates">
              Templates
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-bold tracking-tight">Layers</div>
          <p className="text-sm text-muted-foreground">
            Kelola layer dalam template
          </p>
        </div>
        <button
          onClick={() => save()}
          className="col-span-2 inline-flex justify-center items-center gap-1.5 rounded-md border-2 px-3 py-1 border-gray-900 text-white bg-gray-900 text-sm"
        >
          Save
        </button>
      </div>

      <Separator />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          {canvasSize && (
            <>
              <div
                className="outline outline-2 outline-blue-500 outline-offset-2"
                style={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  position: "relative",
                  margin: "20px auto"
                }}
                onMouseMove={onDrag}
                onMouseUp={stopDrag}
              >
                {shapes
                  .sort((a, b) => a.layer - b.layer)
                  .map((shape, index) => (
                    <div
                      key={index}
                      onMouseDown={() => {
                        startDrag(index);
                        setSelectedShape(index);
                      }}
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
                          shape.type === "image" ? "transparent" : shape.color,
                        backgroundImage:
                          shape.type === "image" ? `url(${shape.src})` : "none",
                        backgroundSize: "cover",
                        zIndex: shape.layer
                      }}
                    />
                  ))}
              </div>
              <span>
                {canvasSize.width} x {canvasSize.height}
              </span>
            </>
          )}
        </div>
        <div className="col-span-3">
          <h5 className="font-semibold mb-1.5">Properties</h5>
          <Separator />
          <div className="my-3">
            <Label htmlFor="name" className="text-right">
              Ukuran
            </Label>
            <div className="grid grid-cols-7 gap-2 mt-1">
              <Input
                id="name"
                name="aspectRatio"
                placeholder={`Enter aspect ratio (e.g., 16:9)`}
                className="col-span-5"
                value={aspectRatio}
                required
                onChange={(e) => setAspectRatio(e.target.value)}
              />
              <button
                onClick={handleSetAspectRatio}
                className="col-span-2 inline-flex justify-center items-center gap-1.5 rounded-md border-2 px-3 py-1 border-gray-900 text-white bg-gray-900 text-sm"
              >
                Set
              </button>
            </div>
          </div>
          <h5 className="font-semibold mb-1.5 mt-8">Element</h5>
          <Separator />
          <div className="my-3">
            <div className="mb-1.5">
              <button
                onClick={() => addShape("rectangle")}
                className="w-full inline-flex justify-center items-center gap-1.5 rounded-md border-2 px-3 py-1 border-gray-900 text-white bg-gray-900 text-sm"
              >
                <Plus></Plus> <span>Add Rectangle</span>
              </button>
            </div>
            <div className="mb-1.5">
              <button
                onClick={() => addShape("circle")}
                className="w-full inline-flex justify-center items-center gap-1.5 rounded-md border-2 px-3 py-1 border-gray-900 text-white bg-gray-900 text-sm"
              >
                <Plus></Plus> <span>Add Circle</span>
              </button>
            </div>
            <label
              htmlFor="fileInput"
              className="w-full inline-flex justify-center items-center gap-1.5 rounded-md border-2 px-3 py-1 border-gray-900 text-white bg-gray-900 text-sm"
            >
              <Upload></Upload> Upload File
            </label>
            <input
              id="fileInput"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>

          {selectedShape !== null && (
            <div>
              <h5 className="font-semibold mb-1.5 mt-8">Attribute</h5>
              <Separator />
              <div className="mt-2">
                <Label htmlFor="height" className="text-right">
                  Height
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={shapes[selectedShape].height}
                  onChange={(e) =>
                    updateShape("height", Number(e.target.value))
                  }
                />
              </div>
              <div className="mt-2">
                <Label htmlFor="width" className="text-right">
                  Width
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={shapes[selectedShape].width}
                  onChange={(e) => updateShape("width", Number(e.target.value))}
                />
              </div>
              <div className="mt-2">
                <Label htmlFor="angle" className="text-right">
                  Angle
                </Label>
                <Input
                  id="angle"
                  type="number"
                  value={shapes[selectedShape].angle}
                  onChange={(e) => updateShape("angle", Number(e.target.value))}
                />
              </div>
              {shapes[selectedShape].type !== "image" && (
                <div className="mt-2">
                  <Label htmlFor="radius" className="text-right">
                    Border Radius
                  </Label>
                  <Input
                    id="radius"
                    type="number"
                    value={shapes[selectedShape].borderRadius}
                    onChange={(e) =>
                      updateShape("borderRadius", Number(e.target.value))
                    }
                  />
                </div>
              )}
              <div className="mt-4">
                <button
                  onClick={() => deleteShape()}
                  className="w-full inline-flex justify-center items-center gap-1.5 rounded-md border-2 px-3 py-1 border-red-500 text-white bg-red-500 text-sm"
                >
                  <Trash /> <span>Delete</span>
                </button>
              </div>
              {/* <div className="mt-2">
                <Label htmlFor="layer" className="text-right">
                  Layer
                </Label>
                <Input
                  id="layer"
                  type="number"
                  value={shapes[selectedShape].layer}
                  onChange={(e) => updateShape("layer", Number(e.target.value))}
                />
              </div> */}
            </div>
          )}

          <h5 className="font-semibold mb-1.5 mt-8">Layers</h5>
          <Separator />
        </div>
      </div>
    </div>
  );
};

export default Page;
