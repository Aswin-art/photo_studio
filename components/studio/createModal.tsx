"use client";
import { useState } from "react";
import { createStudio } from "@/actions/studioAction";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import { formatRupiah, parseRupiah } from "@/utils/Rupiah";
import "react-quill-new/dist/quill.snow.css";
import { uploadImage, deleteImage } from "@/utils/imageApi";

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
      if (image) {
        await deleteImage(image);
        setImage("");
      }
  
      const imageUrl = await uploadImage(file, "studio");
      setImage(imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal mengupload gambar!",
        icon: "error"
      });
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
                <label className="block text-sm font-medium text-gray-700">Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2"
                />
                {image && (
                  <div className="mt-2">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_API}${image}`}
                      alt="Studio Image Preview"
                      className="w-[300px] h-auto rounded-md"
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
