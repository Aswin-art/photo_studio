import cloudinary from '@/lib/cloudinary';

export async function uploadImage(file: File) {
  try {
    // Convert file to base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(base64Data as string, {
      folder: 'your-folder-name', // Change this to your preferred folder name
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}