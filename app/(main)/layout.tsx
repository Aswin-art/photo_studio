"use client"; 
import Navbar from "@/components/navbar";
import React from "react";
import { usePathname } from 'next/navigation'; 
import Foooter from "@/components/ui/footer-section";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); 

  const hideNavbarOnRoutes = [
    '/booking/[id]',
  ];

  const showNavbar = !hideNavbarOnRoutes.some(route => {
    if (route.includes('[id]')) { 
      const routeBase = route.replace('[id]', ''); 
      return pathname?.startsWith(routeBase); 
    }
    return pathname === route; 
  });


  return (
    <>
      {showNavbar && <Navbar />}
      <>{children}</>
      <Foooter />
    </>
  );
};

export default Layout;