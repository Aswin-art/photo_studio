"use client";
import { FocusCards } from "../ui/focus-cards";

export default function Gallery() {
    const cards = [
        {
          title: "Elegan dalam Monokrom",
          src: "/pictures/photo-1.webp",
        },
        {
          title: "Sahabat Selamanya",
          src: "/pictures/photo-2.webp",
        },
        {
          title: "Kenangan Manis masa SMA",
          src: "/pictures/photo-4.webp",
        },
        {
          title: "Kompak & Berkelas",
          src: "/pictures/photo-13.webp",
        },
        {
          title: "Hangatnya Kebersamaan Keluarga",
          src: "/pictures/photo-18.webp",
        },
        {
          title: "Keluarga selalu satu hati",
          src: "/pictures/photo-17.webp",
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
