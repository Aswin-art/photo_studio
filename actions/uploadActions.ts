'use server';

import cloudinary from '@/lib/cloudinary';

export async function uploadImageServer(base64Data: string) {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'your-folder-name',
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Server upload error:', error);
    throw new Error('Failed to upload image on server');
  }
}