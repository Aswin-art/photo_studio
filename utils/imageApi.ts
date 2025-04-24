// utils/imageApi.ts
export async function uploadImage(file: File, type: string, id?: number): Promise<string> {
    const formData = new FormData();
    formData.append("images[]", file);
    formData.append("type", type);
    if (id) formData.append("id", id.toString());
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_API}/api/image-upload`, {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
  
    return data.paths[0];
  }
  
  export async function deleteImage(path: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_API}/api/image-delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ path }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Delete failed");
    return data;
  }
  