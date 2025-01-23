"use client";
import { createStudio } from "@/actions/studioAction";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

interface UploadResult {
  info: {
    secure_url: string;
  };
}

export default function CreateStudioForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(name, description, image);
      await createStudio(name, description, image);
      alert("Studio created successfully!");
    } catch (error) {
      alert(`Failed to create studio: ${error}`);
    }
  };

  const handleUpload = (result: UploadResult) => {
    const imagePath = result.info.secure_url;
    setImage(imagePath);
    console.log("Uploaded image path:", imagePath);
  };

  return (
    <div className="mt-32">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Studio Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Image URL</label>
          <CldUploadWidget uploadPreset="foto_booth" onUpload={handleUpload}>
            {({ open }) => {
              return <button onClick={() => open()}>Upload an Image</button>;
            }}
          </CldUploadWidget>
        </div>
        <button type="submit" className="mt-10">Create Studio</button>
      </form>
    </div>
  );
}
