"use server";
import { db } from "@/lib/db";
import { startOfDay } from 'date-fns';
import { formatDateToWIB } from "@/utils/dateConvert";

export async function getHolidays() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const holidays = await db.holiday.findMany({
      where: {
        date: {
          gte: startOfDay(today)
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
    const targetDate = new Date(formatDateToWIB(date));
    const holiday = await db.holiday.create({
      data: {
        date: targetDate,
        description,
        updatedAt: new Date()
      }
    });
    return holiday;
  } catch (err) {
    throw new Error(`failed to create holiday: ${err}`);
  }
}

export async function deleteHoliday(id: string) {
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

export async function getHolidayById(id: string) {
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
  id: string,
  data: { date: Date; description: string }
) {
  try {
    const targetDate = new Date(formatDateToWIB(data.date));
    const holiday = await db.holiday.update({
      where: { id },
      data: {
        date: targetDate,
        description: data.description
      }
    });
    return holiday;
  } catch (err) {
    throw new Error(`Failed to update holiday: ${err}`);
  }
}

