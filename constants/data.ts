import { User } from "@/types";

// User Data
export const users: User[] = [
  {
    id: "1",
    name: "Candice Schiner",
    email: null,
    image: null,
    role: "USER"
  },
  {
    id: "2",
    name: "John Doe",
    email: null,
    image: null,
    role: "ADMIN"
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: null,
    image: null,
    role: "USER"
  }
];

// Navbar Items
export const navItems = [
  {
    name: "Home",
    url: "/"
  },
  {
    name: "Booking",
    url: "/booking"
  },
  {
    name: "Contact US",
    url: "/contact-us"
  },
  {
    name: "Photo Access",
    url: "/photo-access"
  },
];
