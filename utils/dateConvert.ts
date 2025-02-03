export const dateConvert = (date: Date): string => {
    const convertDate = new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

    return convertDate;
}