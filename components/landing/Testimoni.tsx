"use client";
import { AnimatedTestimonials } from "../ui/animated-testimonials";

export default function Testimoni() {
  const testimonials = [
    {
      quote:
        "Kami sangat senang bisa mengabadikan momen kelulusan bersama sahabat di studio ini! Hasil fotonya luar biasa dan pelayanan sangat ramah.",
      name: "Aulia & Rina",
      designation: "Mahasiswa",
      src: "/pictures/testimonials/photo-2.webp"
    },
    {
      quote:
        "Momen kelulusan ini sangat berarti bagi keluarga kami, dan studio ini membantu kami mengabadikannya dengan sempurna. Hasil fotonya sangat berkesan!",
      name: "Bapak Arya & Keluarga",
      designation: "Keluarga Wisuda",
      src: "/pictures/testimonials/photo-8.webp"
    },
    {
      quote:
        "Foto keluarga kecil kami jadi kenangan indah! Studio ini sangat nyaman, dan fotografernya sabar saat mengambil foto anak kami yang aktif.",
      name: "Dewi & Riko",
      designation: "Keluarga Bahagia",
      src: "/pictures/testimonials/photo-3.webp"
    },
    {
      quote:
        "Kami ingin mengabadikan momen spesial sebagai pasangan, dan hasil fotonya sangat memuaskan! Studio ini memiliki konsep yang modern dan estetis.",
      name: "Dika & Sinta",
      designation: "Pasangan Muda",
      src: "/pictures/testimonials/photo-5.webp"
    },
    {
      quote:
        "Kami sering foto bersama, tapi di studio ini hasilnya benar-benar memuaskan. Suasana nyaman dan harga terjangkau!",
      name: "Rina, Eka, & Putri",
      designation: "Sahabat Sejati",
      src: "/pictures/testimonials/photo-6.webp"
    },
    {
      quote:
        "Tema baju SMA kami bikin nostalgia banget! Studio ini punya banyak konsep menarik, cocok untuk kenangan bersama sahabat.",
      name: "Rizky & Geng SMA",
      designation: "Nostalgia SMA",
      src: "/pictures/testimonials/photo-4.webp"
    },
    {
      quote:
        "Sesi prewedding kami sangat menyenangkan! Studio ini memberikan banyak pilihan tema dan hasilnya sangat memuaskan.",
      name: "Bayu & Ninda",
      designation: "Prewedding",
      src: "/pictures/testimonials/photo-14.webp"
    },
    {
      quote:
        "Foto keluarga dengan konsep casual terasa sangat natural. Studio ini benar-benar membuat momen sederhana menjadi berharga!",
      name: "Hendra & Keluarga",
      designation: "Foto Keluarga",
      src: "/pictures/testimonials/photo-15.webp"
    }
  ];

  return (
    <div className="w-full px-5 sm:px-10 md:px-16 lg:px-40">
      <section className="flex flex-col items-center py-10 lg:py-20">
        <div className="space-y-7 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-medium md:text-5xl">What They Say</h1>
            <p className="text-muted-foreground">
              Real stories from our happy clients
            </p>
          </div>
        </div>
        <AnimatedTestimonials testimonials={testimonials} />
      </section>
    </div>
  );
}
