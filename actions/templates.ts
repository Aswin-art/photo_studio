/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

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
            image_url: image.image_url
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

    const deleteImage = await fetch(
      process.env.NEXT_PUBLIC_BE_API + "/api/image-delete",
      {
        method: "POST",
        body: JSON.stringify({
          path: templates.image_url
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (deleteImage.ok) {
      const deleteTemplate = await db.templates.delete({
        where: {
          id
        }
      });

      return deleteTemplate;
    } else {
      console.log("Failed to delete image from server");
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
