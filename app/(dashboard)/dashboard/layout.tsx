import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import BookingNotifications from "@/components/notification/BookingNotification";
import { TransactionProvider } from "@/components/transaction/TransactionContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <TransactionProvider>
        <BookingNotifications />
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </TransactionProvider>
    </SidebarProvider>
  );
};

export default Layout;
