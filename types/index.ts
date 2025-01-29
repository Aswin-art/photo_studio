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
}

export type Holiday = {
  id: number;
  date: Date;
  description: string | null;
}