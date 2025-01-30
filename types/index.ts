export type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "ADMIN" | "USER" | null;
};

export type Studio = {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
}

export type Holiday = {
  id: number;
  date: Date;
  description: string | null;
}

export type Voucher = {
  id: number;
  name: string;
  discount: number;
  count: number;
}