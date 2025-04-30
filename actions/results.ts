/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";
import { sendResult } from "@/lib/mail";

const checkIfAlreadyCreated = async (channel_id: string) => {
  try {
    const isCreated = await db.results.findFirst({
      where: {
        channel_id
      }
    });

    return isCreated;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const create = async (
  image_url: string,
  template_id: string,
  channel_id: string
) => {
  try {
    const alreadyCreated = await checkIfAlreadyCreated(channel_id);

    if (alreadyCreated) {
      return null;
    }

    const templateExists = await db.templates.findUnique({
      where: { id: template_id }
    });
    const channelExists = await db.channels.findUnique({
      where: { id: channel_id }
    });

    if (!templateExists || !channelExists) {
      throw new Error(
        "Relasi tidak ditemukan: template_id atau channel_id tidak valid"
      );
    }

    const results = await db.results.create({
      data: {
        templates: {
          connect: { id: template_id }
        },
        channels: {
          connect: { id: channel_id }
        },
        image_url
      }
    });

    return results;
  } catch (error) {
    console.log("Upload failed:", error);
    return null;
  }
};

export const find = async (id: string) => {
  try {
    const result = await db.results.findUnique({
      where: {
        id
      },
      include: {
        channels: {
          include: {
            ChannelImages: true
          }
        }
      }
    });

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const sentEmail = async (id: string) => {
  try {
    const result = await db.results.findUnique({
      where: {
        id
      },
      include: {
        channels: {
          include: {
            ChannelImages: true
          }
        }
      }
    });

    if (!result || !result.channels || !result.image_url) return null;

    const mail = await sendResult(
      result.channels.email ?? "",
      result.channels.ChannelImages as any[],
      result.image_url
    );

    return mail;
  } catch (err) {
    console.log(err);
    return null;
  }
};
