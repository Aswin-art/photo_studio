import { parseISO, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const dateConvert = (date: Date): string => {
    const convertDate = new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Jakarta",
      });

    return convertDate;
}

export const dateToStorage = (date: Date): string => {
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  return localDate.toISOString();
}


export const formatDateToWIB = (utcDateString: string | Date): string => {
  const timeZone = "Asia/Jakarta";

  const localDate = toZonedTime(utcDateString, timeZone);

  return format(localDate, "yyyy-MM-dd");
};