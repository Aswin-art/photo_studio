"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { deleteOldChannels } from "@/actions/channels";

const LandingHero = dynamic(() => import("@/components/landing/Hero"), {
  ssr: false
});
const About = dynamic(() => import("@/components/landing/About"), {
  ssr: false
});
const Service = dynamic(() => import("@/components/landing/Service"), {
  ssr: false
});
const Gallery = dynamic(() => import("@/components/landing/Gallery"), {
  ssr: false
});
const Testimoni = dynamic(() => import("@/components/landing/Testimoni"), {
  ssr: false
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    deleteOldChannels();
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="h-[358px] w-full justify-items-center content-center justify-center align-middle flex gap-x-4">
        <Loader2 className="animate-spin self-center" size={20} />
        <p className="self-center">Loading ....</p>
      </div>
    );

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
