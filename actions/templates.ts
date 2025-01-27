/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import cloudinary from "@/lib/cloudinary";
import { db } from "@/lib/db";

export const retrieve = async () => {
  try {
    const templates: any[] = await db.templates.findMany();

    return templates;
  } catch (err: any) {
    console.error("Error during retrieval:", err.message || err);
    return [];
  }
};

export const update = async (id: number, label?: string) => {
  try {
    const template = await db.templates.update({
      where: {
        id
      },
      data: {
        label: label ?? ""
      }
    });

    return template;
  } catch (err: any) {
    console.log(err);
    return null;
  }
};

export const create = async (images: any[]) => {
  try {
    await Promise.all(
      images.map(async (image) => {
        await db.templates.create({
          data: {
            image_url: image.image_url,
            public_id: image.public_id
          }
        });
      })
    );

    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const destroy = async (id: number) => {
  try {
    const templates = await db.templates.findUnique({
      where: {
        id
      }
    });

    if (templates) {
      await cloudinary.uploader.destroy(
        templates.public_id,
        {
          invalidate: true
        },
        async (error, result) => {
          if (error) {
            console.log(error);

            return null;
          } else {
            await db.templates.delete({
              where: {
                id
              }
            });
            console.log("Resource deleted successfully:", result);

            return true;
          }
        }
      );
    }

    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
