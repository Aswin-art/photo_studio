"use client";
import { useParams, useRouter } from "next/navigation";
import { cookieUtils } from "@/utils/cookies";
import React, { useEffect, useState } from "react";
import BackNavbar from "@/components/backNavbar";
import { Studio } from "@/types";
import { convertBookingSession } from "@/utils/convertBookingSession";
import { formatRupiah } from "@/utils/Rupiah";
import { CalendarDays, Clock } from "lucide-react";
import { dateConvert } from "@/utils/dateConvert";
import { getStudioById } from "@/actions/studioAction";
import Wrapper from "@/components/wrapper";
import Image from "next/image";

export default function BookingPayment() {
  const { id } = useParams();
  const router = useRouter();
  const [studio, setStudio] = useState<Studio>();
  const name = cookieUtils.get("name") || "";
  const email = cookieUtils.get("email") || "";
  const phone = cookieUtils.get("phone") || "";
  const totalPrice = formatRupiah(Number(cookieUtils.get("totalPrice")));
  const bookingDate = dateConvert(new Date(cookieUtils.get("bookingDate")!));
  const bookingTime = convertBookingSession(
    Number(cookieUtils.get("bookingTime"))
  );
  const message =
    encodeURIComponent(`Halo Admin, saya ingin mengonfirmasi pembayaran booking studio. Berikut detailnya:
        - Nama: ${name}
        - Email: ${email}
        - Nomor Telepon: ${phone}
        - Jenis Studio: ${studio?.name}
        - Tanggal Booking: ${bookingDate}
        - Sesi Booking: ${bookingTime}
        
        Mohon verifikasi pembayaran saya.`);

  const whatsappLink = `https://wa.me/${6285770037336}?text=${message}`;

  const fetchStudios = async () => {
    try {
      const data = await getStudioById(Number(id));
      if (data) {
        setStudio(data);
      } else {
        console.error("No studio data found");
      }
    } catch (error) {
      console.error("Failed to fetch studios:", error);
    }
  };

  const clearBookingCookies = () => {
    const bookingCookies = [
      "bookingDate",
      "bookingTime",
      "name",
      "email",
      "phone",
      "totalPrice",
      "voucherId"
    ];

    bookingCookies.forEach((cookieName) => {
      cookieUtils.remove(cookieName);
    });
  };

  useEffect(() => {
    fetchStudios();
    if (!cookieUtils.get("bookingDate") || !cookieUtils.get("bookingTime")) {
      router.push(`/booking/${id}/`);
    } else if (
      !cookieUtils.get("name") ||
      !cookieUtils.get("email") ||
      !cookieUtils.get("phone") ||
      !cookieUtils.get("totalPrice")
    ) {
      router.push(`/booking/${id}/addon`);
    }
  }, []);

  return (
    <>
      <BackNavbar backPath="/booking" title="Pembayaran" />
      <Wrapper>
        <div className="flex flex-col min-h-[calc(100vh-208px)] md:min-h-screen md:mt-[12px] p-8 md:pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] justify-items-center items-center">
          <div className="w-full md:max-w-screen-sm md:pt-5 mt-16 md:mt-0">
            <div className="grid gird-cols-1 gap-4 md:gap-12 justify-items-center">
              <div className="p-6 flex flex-col gap-y-4 md:border-t md:rounded-t-md md:rounded-xl md:border md:bg-card md:text-card-foreground md:shadow w-full pt-6">
                <Image
                  src="/image/qris.png"
                  alt="QRIS Payment"
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover rounded-md"
                />
                <hr className="border-t border-gray-200" />
                <div className="flex justify-between">
                  <p className="text-gray-800">Total Biaya</p>
                  <p className="text-gray-800">Rp {totalPrice}</p>
                </div>
                <hr className="border-t border-gray-200 py-1" />
                <p className="text-gray-500 text-sm">
                  Tanggal dan sesi yang dipilih
                </p>
                <div className="flex gap-x-6 text-gray-600">
                  <div className="flex gap-x-2">
                    <CalendarDays />
                    <p className="text-gray-800">{bookingDate}</p>
                  </div>
                  <p>|</p>
                  <div className="flex gap-x-2">
                    <Clock />
                    <p className="text-gray-800">{bookingTime}</p>
                  </div>
                </div>
                <hr className="border-t border-gray-200 py-1" />
                <p className="text-gray-500 text-sm">Instruksi Pembayaran</p>
                <ol className="list-decimal pl-5 text-gray-700 space-y-2 text-justify">
                  <li>
                    Segera lakukan pembayaran melalui <strong>QRIS</strong>{" "}
                    sesuai total harga yang tertera.
                  </li>
                  <li>
                    Gunakan aplikasi yang mendukung QRIS, seperti{" "}
                    <span className="font-semibold">
                      GoPay, OVO, DANA, ShopeePay, atau mobile banking
                    </span>
                    .
                  </li>
                  <li>
                    Pastikan jumlah yang ditransfer{" "}
                    <strong>sesuai dengan total harga</strong> agar pembayaran
                    dapat diverifikasi dengan cepat.
                  </li>
                  <li>Simpan bukti pembayaran setelah transaksi berhasil.</li>
                  <li>
                    Setelah melakukan pembayaran, kirim bukti pembayaran melalui
                    WhatsApp ke nomor{" "}
                    <a
                      href="https://wa.me/6285770037336"
                      className="text-blue-500 underline"
                    >
                      085770037336
                    </a>
                    . Anda dapat mengirimnya secara manual dengan mencantumkan:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Nama lengkap: {`${name}`}</li>
                      <li>Email: {`${email}`}</li>
                      <li>Nomor telepon: {`${phone}`}</li>
                      <li>Jenis studio yang dipesan: {`${studio?.name}`}</li>
                      <li>Tanggal booking: {`${bookingDate}`}</li>
                      <li>Sesi booking: {`${bookingTime}`}</li>
                    </ul>
                  </li>
                  <li>
                    Atau, tekan tombol{" "}
                    <span className="font-semibold">
                      &quot;Konfirmasi Pembayaran&quot;
                    </span>{" "}
                    di bawah ini untuk langsung membuka WhatsApp dengan
                    informasi yang telah diisi otomatis. Anda hanya perlu
                    mengunggah bukti pembayaran.
                  </li>
                </ol>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={async (e) => {
                    e.preventDefault();
                    await new Promise((resolve) => {
                      clearBookingCookies();
                      setTimeout(resolve, 100);
                    });
                    window.location.href = whatsappLink;
                  }}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
                >
                  Konfirmasi Pembayaran
                </a>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}
