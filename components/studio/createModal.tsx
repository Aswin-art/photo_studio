"use client";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults
} from "next-cloudinary";
import { useState } from "react";
import { createStudio } from "@/actions/studioAction";
import Image from "next/image";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import { formatRupiah, parseRupiah } from "@/utils/Rupiah";
import "react-quill-new/dist/quill.snow.css";

export default function CreateStudioForm({
  refreshStudios
}: {
  refreshStudios: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setPrice(formatRupiah(rawValue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name || !description || !image || !price) {
        throw new Error("All fields are required.");
      }
      await createStudio(name, description, image, parseRupiah(price));
      Swal.fire({
        title: "Berhasil!",
        text: "Studio berhasil dibuat!",
        icon: "success"
      });
      setIsOpen(false);
      refreshStudios();
      setName("");
      setDescription("");
      setPrice("");
      setImage("");
    } catch (error) {
      alert(`Failed to create studio: ${error}`);
    }
  };

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info as { secure_url: string };

    if (info && info.secure_url) {
      setImage(info.secure_url);
      console.log("Uploaded image path:", info.secure_url);
    } else {
      console.error("Upload result does not contain a valid image URL.");
    }
  };

  return (
    <>
      <button
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        onClick={() => setIsOpen(true)}
      >
        Buat Studio
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative max-h-[80vh] overflow-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Buat Studio</h2>
              <p className="text-gray-500">
                Isi form untuk membuat studio baru
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Studio
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Harga
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  className="mt-1 border border-gray-300 rounded-md"
                  theme="snow"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Gambar
                </label>
                <CldUploadWidget
                  uploadPreset="studio"
                  onSuccess={(result) => handleUpload(result)}
                >
                  {({ open }) => {
                    return (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="px-3 mt-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                      >
                        Upload an Image
                      </button>
                    );
                  }}
                </CldUploadWidget>
                {image && (
                  <div className="mt-2">
                    <Image
                      src={image}
                      alt="Studio Image"
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Buat Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
