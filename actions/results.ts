/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";
import { sendResult } from "@/lib/mail";

const checkIfAlreadyCreated = async (channel_id: number) => {
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
  public_id: string,
  image_url: string,
  template_id: number,
  channel_id: number
) => {
  try {
    const alreadyCreated = await checkIfAlreadyCreated(channel_id);

    if (alreadyCreated) {
      return null;
    }

    const results = await db.results.create({
      data: {
        template_id,
        channel_id,
        public_id,
        image_url
      }
    });

    return results;
  } catch (error) {
    console.log("Upload failed:", error);
    return null;
  }
};

export const find = async (id: number) => {
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

export const sentEmail = async (id: number) => {
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

    if (!result) return null;

    // TODO: Panggil fungsi kirim email
    const mail = await sendResult(
      result.channels?.email ?? "",
      result.channels?.ChannelImages as any[]
    );

    return mail;
  } catch (err) {
    console.log(err);
    return null;
  }
};
