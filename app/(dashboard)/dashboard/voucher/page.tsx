'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { voucher } from "@prisma/client";
import { getVouchers } from "@/actions/voucher"; 
import ListVoucher from "@/components/voucher/ListVoucher";


export default function Page() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
 
  const fetchVouchers = async () => {
    try {
      const data = await getVouchers();
      setVouchers(data);
      console.log(data)
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshVouchers = async () => {
    setIsLoading(true);
    await fetchVouchers();
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">PhotoStudio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Voucher</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-semibold">Voucher</h1>
        </div>
          <ListVoucher voucher={vouchers} isLoading={isLoading} refreshVouchers={refreshVouchers} />
      </div>
    </>
  );
}
