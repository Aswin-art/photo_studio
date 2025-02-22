"use client";

import dynamic from "next/dynamic";
const LandingHero = dynamic(() => import('@/components/landing/Hero'), { ssr: false })
const About = dynamic(() => import('@/components/landing/About'), { ssr: false })
const Service = dynamic(() => import('@/components/landing/Service'), { ssr: false })
const Gallery = dynamic(() => import('@/components/landing/Gallery'), { ssr: false })
const Testimoni = dynamic(() => import('@/components/landing/Testimoni'), { ssr: false })

export default function Home() {
  return (
    <div className="flex flex-col gap-y-6 sm:gap-y-8 md:gap-y-10 pt-[72px] max-w-[100vw] overflow-x-hidden">
      <LandingHero />
      <About />
      <Service />
      <Gallery />
      <Testimoni />
    </div>
  );
}
