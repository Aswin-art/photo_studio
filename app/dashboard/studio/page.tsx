import { deleteStudio, getStudios } from "@/actions/studioAction";
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
import Link from "next/link";
import Image from "next/image";
import React from "react";

export default async function Page() {
  const studios = await getStudios();

  // const handleDelete = async (id: number) => {
  //   await deleteStudio(id);
  //   alert(`Deleted studio with ID: ${id}`);
  // };
  function handleDelete(id: number) {
    deleteStudio(id);
    alert(`Deleted studio with ID: ${id}`);
  }

  return (
    <>
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-semibold">Studio</h1>
          <Link
            href="/dashboard/studio/create"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded"
          >
            Create Studio
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <div
              key={studio.id}
              className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Studio Image */}
              {studio.image ? (
                <Image
                  src={studio.image}
                  alt={studio.name}
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}

              {/* Studio Content */}
              <div className="p-4 flex flex-col">
                <h2 className="text-lg font-semibold">{studio.name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {studio.description || "No description available."}
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(studio.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
