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
import { getHolidays } from "@/actions/holidayAction";
import ListHoliday from "@/components/holiday/listHoliday";
import { Holiday } from "@/types";

export default function Page() {
  const [holiday, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
 
  const fetchHolidays = async () => {
    try {
      const data = await getHolidays();
      setHolidays(data);
    } catch (error) {
      console.error("Failed to fetch holiday:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHolidays = async () => {
    setIsLoading(true);
    await fetchHolidays();
  };

  useEffect(() => {
    fetchHolidays();
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
                <BreadcrumbPage>Holiday</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-semibold">Holiday</h1>
          {/* <CreateStudioForm refreshHolidays={refreshHolidays}/> */}
        </div>
        <ListHoliday
          holiday={holiday}
          isLoading={isLoading}
          refreshHolidays={refreshHolidays}
          />
        {/* <StudioList
          holiday={holiday}
          isLoading={isLoading}
          refreshHolidays={refreshHolidays}
        /> */}
      </div>
    </>
  );
}
