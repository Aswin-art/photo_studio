"use server";
import { db } from "@/lib/db";

export async function getHolidays() {
  try {
    const holidays = await db.holiday.findMany({
      where: {
        date: {
          gte: new Date()
        }
      },
      orderBy: {
        date: "asc"
      }
    });
    return holidays;
  } catch (err) {
    throw new Error(`failed to get holidays: ${err}`);
  }
}

export async function createHoliday(date: Date, description: string) {
  try {
    const holiday = await db.holiday.create({
      data: {
        date,
        description
      }
    });
    return holiday;
  } catch (err) {
    throw new Error(`failed to create holiday: ${err}`);
  }
}

export async function deleteHoliday(id: number) {
  try {
    const holiday = await db.holiday.delete({
      where: {
        id
      }
    });
    return holiday;
  } catch (err) {
    console.log(err);
    throw new Error(`failed to delete holiday: ${err}`);
  }
}

export async function getHolidayById(id: number) {
  try {
    const holiday = await db.holiday.findUnique({
      where: {
        id
      }
    });
    return holiday;
  } catch (err) {
    throw new Error(`failed to get holiday: ${err}`);
  }
}

export async function updateHoliday(
  id: number,
  data: { date: Date; description: string }
) {
  try {
    const holiday = await db.holiday.update({
      where: { id },
      data
    });
    return holiday;
  } catch (err) {
    throw new Error(`Failed to update holiday: ${err}`);
  }
}

