"use client";
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
import StudioList from "@/components/studio/studio-list";
import CreateStudioForm from "@/components/studio/createModal";
import { getStudios } from "@/actions/studioAction";
import { Studio } from "@/types";

export default function Page() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudios = async () => {
    try {
      const data = await getStudios();
      setStudios(data);
    } catch (error) {
      console.error("Failed to fetch studios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStudios = async () => {
    setIsLoading(true);
    await fetchStudios();
  };

  useEffect(() => {
    fetchStudios();
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
                <BreadcrumbPage>Studio</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-semibold">Studio</h1>
          <CreateStudioForm refreshStudios={refreshStudios} />
        </div>
        <StudioList
          studios={studios}
          isLoading={isLoading}
          refreshStudios={refreshStudios}
        />
      </div>
    </>
  );
}
