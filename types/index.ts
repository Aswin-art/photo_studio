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

export type Addon = {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerAddon = {
  id: number;
  transactionId: number;
  addonId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  addon: Addon;
};

export type Transaction = {
  id: number;
  studioId: number;
  voucherId: number | null;
  studio: Studio;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  bookingDate: Date;
  bookingTime: number;
  customeraddon: CustomerAddon[] | null;
  voucher: Voucher | null;
  totalPrice: number;
  isApproved: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};