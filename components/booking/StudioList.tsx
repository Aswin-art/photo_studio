"use client";
import StudioCard from "./StudioCard";
import { Studio } from "@/types";

interface StudioListProps {
  studios: Studio[];
  isLoading: boolean;
  buttonTitle?: string;
}

export default function StudioList({
  studios,
  isLoading,
  buttonTitle = "Pilih Studio"
}: StudioListProps) {

  if (isLoading) {
    return <p>Memuat Studio...</p>;
  }

  if (studios.length === 0) {
    return <p>Tidak ada studio yang tersedia.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {studios.map((studio) => (
        <StudioCard
          key={studio.id}
          studio={studio}
          buttonTitle={buttonTitle}
        />
      ))}
    </div>
  );
}
