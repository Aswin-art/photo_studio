export type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "ADMIN" | "USER" | null;
};

export type Studio = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
}

export type Holiday = {
  id: string;
  date: Date;
  description: string | null;
}

export type Voucher = {
  id: string;
  name: string;
  discount: number | null;
  count: number;
}

export type Addon = {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerAddon = {
  id: string;
  transactionId: string;
  addonId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  addon: Addon;
};

export type Transaction = {
  id: string;
  studioId: string;
  voucherId: string | null;
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

export type Session = {
  sesi: number;
  isAvailable: boolean;
}

export type DailySession = {
  message: string | null;
  sessions: Session[] | [];
}

export interface AddonQuantity {
  id: string;
  quantity: number;
  price: number;
}

export interface AddonCardProps {
  id: string;
  title: string;
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}