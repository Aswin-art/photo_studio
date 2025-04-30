// utils/imageApi.ts
export async function uploadImage(
  files: File | File[],
  type: string,
  id?: string
): Promise<string> {
  const formData = new FormData();
  const filesArray = Array.isArray(files) ? files : [files];

  filesArray.forEach((file) => {
    formData.append("images[]", file);
  });
  formData.append("type", type);
  if (id) formData.append("id", id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_IMAGE_API}/api/image-upload`,
    {
      method: "POST",
      body: formData
    }
  );

  console.log("res", res);

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");

  return data.paths[0];
}

export async function deleteImage(path: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_IMAGE_API}/api/image-delete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ path })
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Delete failed");
  return data;
}
