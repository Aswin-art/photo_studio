/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import cloudinary from "@/lib/cloudinary";
import { db } from "@/lib/db";

export const retrieve = async () => {
  try {
    const channels = await db.channels.findMany({
      include: {
        ChannelImages: true
      }
    });
    return channels;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const find = async (id: number) => {
  try {
    const channels = await db.channels.findUnique({
      where: {
        id
      },
      include: {
        ChannelImages: true
      }
    });

    return channels;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const generateChannelCode = async () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 7);
  const roomCode = `${timestamp}-${randomString}`;
  return roomCode;
};

export const insertImages = async (
  channel_id: number,
  images: any[]
): Promise<boolean> => {
  try {
    await Promise.all(
      images.map(async (image) => {
        await db.channelImages.create({
          data: {
            channel_id,
            image_url: image.image_url,
            public_id: image.public_id
          }
        });
      })
    );

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const create = async (images: any[]) => {
  try {
    const code = await generateChannelCode();

    const channels = await db.channels.create({
      data: {
        code
      }
    });

    if (channels) {
      const channelImages = await insertImages(channels.id, images);

      return channelImages;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const update = async (
  id: number,
  email?: string | null,
  phone?: string | null
) => {
  try {
    const channels = await db.channels.update({
      where: {
        id
      },
      data: {
        email,
        phone
      }
    });

    return channels;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const destroy = async (id: number) => {
  try {
    const channel = await db.channels.findUnique({
      where: {
        id
      },
      include: {
        ChannelImages: true
      }
    });

    if (!channel) {
      return null;
    }

    for (const image of channel.ChannelImages) {
      const public_id = image.public_id;

      try {
        await cloudinary.uploader.destroy(
          public_id,
          {
            invalidate: true
          },
          (error, result) => {
            if (error) {
              console.log(error);

              return null;
            } else {
              console.log(result);

              return true;
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    await db.channels.delete({
      where: {
        id
      }
    });

    return channel;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteChannelImage = async (public_id: string) => {
  try {
    const cloudinaryResult = await cloudinary.uploader.destroy(public_id, {
      invalidate: true
    });

    if (cloudinaryResult.result !== "ok") {
      console.log("masuk sini");
      console.log(cloudinaryResult);
      return null;
    }

    const image = await db.channelImages.findFirst({
      where: {
        public_id
      }
    });

    if (image) {
      const deleteAction = await db.channelImages.delete({
        where: {
          id: image.id
        }
      });

      return deleteAction;
    } else {
      return null;
    }
  } catch (err: any) {
    console.log("error", err.result);
    return null;
  }
};
