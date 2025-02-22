/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CldUploadWidget } from "next-cloudinary";

export default function ImageUploader() {
  const handleUpload = (result: any) => {
    const imagePath = result.info.secure_url;
    console.log("Uploaded image path:", imagePath);
  };

  return (
    <div className="mt-64">
      <CldUploadWidget uploadPreset="studio" onUpload={handleUpload}>
        {({ open }) => {
          return <button onClick={() => open()}>Upload an Image</button>;
        }}
      </CldUploadWidget>
    </div>
  );
}
