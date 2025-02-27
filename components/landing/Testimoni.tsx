"use client";
import { AnimatedTestimonials } from "../ui/animated-testimonials";

export default function Testimoni() {
  const testimonials = [
    {
      quote:
        "Murah dan masuk dikantong pelajar. Terus hasilnya juga sesuai ekspektasi. Tempatnya juga enak luas dan semua fasilitas ada. Strip fotonya juga lucu-lucu templatenya.",
      name: "Alifia",
      designation: "Wiraswasta",
      src: "/pictures/testimonials/Alifia.webp"
    },
    {
      quote:
        "Hasil-hasilnya punya resolusi tinggi jadi beda lah sama kalo foto sendiri. Terus tone warnanya juga cakep. Oke banget si",
      name: "Izzah",
      designation: "Pelajar",
      src: "/pictures/testimonials/izzah.webp"
    },
    {
      quote:
        "Studionya lengkap banget propertinya juga lucu-lucu. Harganya gila murah banget kalo buat dapet fasilitas sebanyak ini hmm. Mungkin next time, ngajak keluarga buat foto disini.",
      name: "Vionna",
      designation: "Mahasiswa",
      src: "/pictures/testimonials/viona.webp"
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
