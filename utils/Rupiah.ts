export const formatRupiah = (value: string | number): string => {
    const strValue = String(value);
    return strValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseRupiah = (value: string): number => {
    return Number(value.replace(/\./g, ""));
};
  