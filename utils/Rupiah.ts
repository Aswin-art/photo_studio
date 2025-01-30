export const formatRupiah = (value: string): string => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseRupiah = (value: string): number => {
    return Number(value.replace(/\./g, ""));
};
  