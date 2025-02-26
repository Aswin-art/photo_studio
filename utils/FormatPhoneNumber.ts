export function formatPhoneNumber(number: string) {
    const match = number.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (!match) return number;
  
    return [match[1], match[2], match[3]].filter(Boolean).join("-");
  }