"use client";
import { useEffect, useState } from "react";
import { getStudioById, updateStudio } from "@/actions/studioAction";
import Swal from "sweetalert2";
import ReactQuill from "react-quill-new";
import { parseRupiah, formatRupiah } from "@/utils/Rupiah";
import "react-quill-new/dist/quill.snow.css";
import { uploadImage, deleteImage } from "@/utils/imageApi";

interface CreateStudioFormProps {
  refreshStudios: () => void;
  id: string;
}

export default function UpdateStudioForm({
  refreshStudios,
  id
}: CreateStudioFormProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [oldImage, setOldImage] = useState("");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setPrice(formatRupiah(rawValue));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStudio(id, {
        name,
        description,
        image,
        price: parseRupiah(price)
      });
      Swal.fire({
        title: "Success!",
        text: "Studio updated successfully!",
        icon: "success"
      });
      setIsOpen(false);
      refreshStudios();
    } catch (error) {
      alert("Failed to update studio.");
      console.error(error);
    }
  };

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (oldImage) {
      try {
        await deleteImage(oldImage);
      } catch (error) {
        console.error("Gagal hapus gambar lama:", error);
      }
    }

    try {
      const imageUrl = await uploadImage(file, "studio");
      setImage(imageUrl);
      setOldImage(imageUrl);
    } catch (error) {
      console.error("Upload gagal:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal mengupload gambar!",
        icon: "error"
      });
    }
};
  

  const fetchStudio = async () => {
    console.log("Fetching studio with id:", id);
    if (id) {
      const fetchedStudio = await getStudioById(id);
      if (fetchedStudio) {
        console.log("Fetched studio:", fetchedStudio);
        setName(fetchedStudio.name);
        setDescription(fetchedStudio.description ?? "");
        setImage(fetchedStudio.image ?? "");
        setOldImage(fetchedStudio.image ?? "");
        setPrice(formatRupiah(fetchedStudio.price.toString()) ?? "");
      }
    }
  };

  useEffect(() => {
    fetchStudio();
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative max-h-[80vh] overflow-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Perbarui Studio</h2>
              <p className="text-gray-500">Isi form untuk edit studio</p>
            </div>

            <form onSubmit={handleUpdate}>
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
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
                  Perbarui Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
