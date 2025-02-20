"use client";
import React, { useEffect, useState } from "react";
import Wrapper from "@/components/wrapper";
import { getStudios } from "@/actions/studioAction";
import { Studio } from "@/types";
import StudioList from "@/components/booking/StudioList";

export default function Booking() {
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

  useEffect(() => {
    fetchStudios();
  }, []);

  return (
    <Wrapper>
      <div className="grid min-h-screen md:mt-[12px] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-1 flex-col gap-4 p-4 w-full">
          <h1 className="text-2xl font-semibold">Pilih Studio</h1>
          <StudioList isLoading={isLoading} studios={studios} />
        </div>
      </div>
    </Wrapper>
  );
}
