/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import cloudinary from "@/lib/cloudinary";
import { db } from "@/lib/db";

export const retrieve = async () => {
  try {
    const templates: any[] = await db.templates.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return templates;
  } catch (err: any) {
    console.error("Error during retrieval:", err.message || err);
    return [];
  }
};

export const update = async (id: string, label?: string) => {
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

export const setContent = async (jsonText: any, id: string) => {
  await db.templates.update({
    where: {
      id
    },
    data: {
      label: "tes",
      content: jsonText
    }
  });
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

export const findUnique = async (id: string) => {
  try {
    const template = await db.templates.findUnique({
      where: { id }
    });

    return template;
  } catch (err) {
    console.error(
      "Error during retrieval:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
};

export const destroy = async (id: string) => {
  try {
    const templates = await db.templates.findUnique({
      where: {
        id
      }
    });

    if (!templates) {
      return null;
    }
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
          console.log(result.result);

          return true;
        }
      }
    );

    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};
