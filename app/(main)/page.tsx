"use client";
import LandingHero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Service from "@/components/landing/Service";
import Gallery from "@/components/landing/Gallery";
import Testimoni from "@/components/landing/Testimoni";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-6 sm:gap-y-8 md:gap-y-10 max-w-[100vw] overflow-x-hidden">
      <LandingHero />
      <About />
      <Service />
      <Gallery />
      <Testimoni />
    </div>
  );
}
