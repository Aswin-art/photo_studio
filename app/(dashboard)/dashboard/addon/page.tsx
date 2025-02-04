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
import { getAddons } from "@/actions/addonAction";
import ListAddon from "@/components/addons/ListAddon";
import { Addon } from "@/types";

export default function Page() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
 
  const fetchAddons = async () => {
    try {
      const data = await getAddons();
      setAddons(data);
      console.log(data)
    } catch (error) {
      console.error("Failed to fetch addons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAddons = async () => {
    setIsLoading(true);
    await fetchAddons();
  };

  useEffect(() => {
    fetchAddons();
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
                <BreadcrumbPage>Layanan Tambahan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-semibold">Layanan Tambahan</h1>
        </div>
          <ListAddon addon={addons} isLoading={isLoading} refreshAddons={refreshAddons} />
      </div>
    </>
  );
}
