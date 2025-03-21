"use client";
import StudioCard from "@/components/studio/studio-chart";
import { Studio } from "@/types";

interface StudioListProps {
  studios: Studio[];
  isLoading: boolean;
  refreshStudios: () => void;
}

export default function StudioList({
  studios,
  isLoading,
  refreshStudios
}: StudioListProps) {
  if (isLoading) {
    return <p>Loading studios...</p>;
  }

  if (studios.length === 0) {
    return <p>No studios available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {studios.map((studio) => (
        <StudioCard
          key={studio.id}
          studio={studio}
          refreshStudios={refreshStudios}
        />
      ))}
    </div>
  );
}
