/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";
import { subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const retrieve = async () => {
  try {
    const channels = await db.channels.findMany({
      include: {
        ChannelImages: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return channels;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const find = async (id: string) => {
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

export const generateChannelCode = async (): Promise<string> => {
  while (true) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 7);
    const roomCode = `${timestamp}-${randomString}`;

    const existingChannel = await db.channels.findUnique({
      where: { code: roomCode }
    });

    if (!existingChannel) {
      return roomCode;
    }
  }
};

export const insertImages = async (
  channel_id: string,
  images: any[]
): Promise<boolean> => {
  try {
    await Promise.all(
      images.map(async (image) => {
        await db.channelImages.create({
          data: {
            channel_id,
            image_url: image.image_url
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

export const create = async () => {
  try {
    const code = await generateChannelCode();

    const channels = await db.channels.create({
      data: {
        code
      }
    });

    return channels;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const update = async (
  id: string,
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

export const deleteOldChannels = async () => {
  try {
    const oneWeekAgoJakarta = subDays(new Date(), 7);
    const oneWeekAgoUTC = toZonedTime(oneWeekAgoJakarta, "Asia/Jakarta");

    const channels = await db.channels.findMany({
      where: {
        createdAt: {
          lt: oneWeekAgoUTC
        }
      }
    });

    await Promise.all(
      channels.map(async (channel) => {
        await destroy(channel.id);
      })
    );

    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const destroy = async (id: string) => {
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

export const deleteChannelImage = async (id: string) => {
  try {
    const deleteAction = await db.channelImages.delete({
      where: {
        id
      }
    });

    return deleteAction;
  } catch (err: any) {
    console.log("error", err.result);
    return null;
  }
};

export const checkChannelUser = async (code: string) => {
  try {
    const channel = await db.channels.findFirst({
      where: {
        code
      },
      include: {
        Results: true
      }
    });

    return channel;
  } catch (err) {
    console.log(err);
    return null;
  }
};
