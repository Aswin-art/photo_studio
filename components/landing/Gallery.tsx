"use client";
import { FocusCards } from "../ui/focus-cards";

export default function Gallery() {
    const cards = [
        {
          title: "",
          src: "/pictures/4.webp",
        },
        {
          title: "",
          src: "/pictures/3.webp",
        },
        {
          title: "",
          src: "/pictures/testimonials/izzah.webp",
        },
        {
          title: "",
          src: "/pictures/2.webp",
        },
        {
          title: "",
          src: "/pictures/5.webp",
        },
        {
          title: "",
          src: "/pictures/photo-4.webp",
        },
      ];
    return (
        <div className="w-full px-5 sm:px-10 md:px-16 lg:px-40">
            <section className="flex flex-col items-center gap-10 py-20 lg:py-40">
                <div className="space-y-7 text-center">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-medium md:text-5xl">Captured Moments</h1>
                        <p className="text-muted-foreground">Cherish every memory with stunning photos</p>
                    </div>
                </div>
                <FocusCards cards={cards} />
            </section>
        </div>
    );
}
