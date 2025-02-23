/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useParams, useRouter } from "next/navigation";
import { cookieUtils } from "@/utils/cookies";
import React, { useEffect, useState } from "react";
import AddonCard from "@/components/booking/AddonCard";
import Wrapper from "@/components/wrapper";
import { getStudioById } from "@/actions/studioAction";
import { getAddons } from "@/actions/addonAction";
import { Studio, Addon, AddonQuantity } from "@/types";
import { Card } from "@/components/ui/card";
import { dateConvert } from "@/utils/dateConvert";
import { convertBookingSession } from "@/utils/convertBookingSession";
import { formatRupiah } from "@/utils/Rupiah";
import { CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { getVoucherById, getVoucherByName } from "@/actions/voucher";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createBooking } from "@/actions/bookingAction";

export default function BookingAddon() {
  const { id } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const [studio, setStudio] = useState<Studio>();
  const [addon, setAddon] = useState<Addon[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInvalidVoucher, setIsInvalidVoucher] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addonQuantities, setAddonQuantities] = useState<AddonQuantity[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    id: string;
    name: string;
    discount: number;
  } | null>(null);
  const [bookingDate, setBookingDate] = React.useState<Date | undefined>(
    cookieUtils.get("bookingDate")
      ? new Date(cookieUtils.get("bookingDate")!)
      : new Date()
  );
  const [bookingTime, setBookingTime] = useState<number | null>(
    Number(cookieUtils.get("bookingTime")) ?? null
  );

  const fetchStudios = async () => {
    try {
      const data = await getStudioById(id as string);
      if (data) {
        setStudio(data);
      } else {
        console.error("No studio data found");
      }
    } catch (error) {
      console.error("Failed to fetch studios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddon = async () => {
    try {
      const data = await getAddons();
      if (data) {
        setAddon(data);
      } else {
        console.error("No Addon data found");
      }
    } catch (error) {
      console.error("Failed to fetch addons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (addonId: string, quantity: number) => {
    setAddonQuantities((prev) =>
      prev.map((item) => (item.id === addonId ? { ...item, quantity } : item))
    );
  };

  const handleApplyVoucher = async () => {
    if (!selectedVoucher.trim()) {
      toast({
        title: "Gagal",
        description: "Silakan masukkan kode voucher",
        type: "foreground"
      });
      return;
    }

    try {
      const voucher = await getVoucherByName(selectedVoucher);

      if (voucher) {
        cookieUtils.set("voucherId", voucher.id.toString());
        setAppliedVoucher({
          id: voucher.id,
          name: voucher.name,
          discount: voucher.discount ?? 0
        });

        if (appliedVoucher) {
          setIsInvalidVoucher(false);
          toast({
            title: "Berhasil",
            description: `Voucher ${appliedVoucher.name} digantikan dengan ${voucher.name}`,
            type: "foreground"
          });
        } else {
          setIsInvalidVoucher(false);
          toast({
            title: "Berhasil",
            description: `Voucher ${voucher.name} berhasil diterapkan`,
            type: "foreground"
          });
        }
      } else {
        setIsInvalidVoucher(true);
        toast({
          title: "Gagal",
          description: "Voucher tidak valid atau sudah habis",
          type: "foreground"
        });
      }
    } catch (error) {
      setIsInvalidVoucher(true);
      console.error("Error applying voucher:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menerapkan voucher",
        type: "foreground"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!name.trim() || !email.trim() || !phone.trim()) {
        toast({
          title: "Error",
          description: "Semua field harus diisi",
          type: "foreground"
        });
        return;
      }

      const storedBookingDate: string = cookieUtils.get("bookingDate")!;
      const storedBookingTime: number = Number(cookieUtils.get("bookingTime"));

      if (!storedBookingDate || !storedBookingTime) {
        toast({
          title: "Error",
          description: "Data booking tidak lengkap",
          type: "foreground"
        });
        return;
      }

      const selectedAddons = addonQuantities
        .filter((addon) => addon.quantity > 0)
        .map((addon) => ({
          addonId: addon.id,
          quantity: addon.quantity
        }));

      const booking = await createBooking(
        id as string,
        storedBookingDate,
        storedBookingTime,
        {
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim()
        },
        appliedVoucher?.id,
        selectedAddons.length > 0 ? selectedAddons : undefined
      );

      if (booking) {
        cookieUtils.set("name", name);
        cookieUtils.set("email", email);
        cookieUtils.set("phone", phone);
        cookieUtils.set("totalPrice", calculateTotal());

        router.push(`/booking/${id}/payment`);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat booking",
        type: "foreground"
      });
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  const calculateTotal = () => {
    const addonsTotal = addonQuantities.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const subtotal = (studio?.price || 0) + addonsTotal;

    if (appliedVoucher) {
      const discount = subtotal * (appliedVoucher.discount / 100);
      return subtotal - discount;
    }

    return subtotal;
  };

  const handleContinue = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const voucherId = cookieUtils.get("voucherId") as string;
    if (voucherId) {
      const fetchVoucher = async () => {
        try {
          const voucher = await getVoucherById(voucherId);
          if (voucher) {
            setAppliedVoucher({
              id: voucher.id,
              name: voucher.name,
              discount: voucher.discount ?? 0
            });
          }
        } catch (error) {
          console.error("Error fetching voucher:", error);
          cookieUtils.remove("voucherId");
        }
      };
      fetchVoucher();
    }
  }, []);

  useEffect(() => {
    fetchStudios();
    fetchAddon();
  }, []);

  useEffect(() => {
    if (!cookieUtils.get("bookingDate") || !cookieUtils.get("bookingTime")) {
      router.push(`/booking/${id}/`);
    }
  }, []);

  useEffect(() => {
    if (addon) {
      setAddonQuantities(
        addon.map((item) => ({
          id: item.id,
          quantity: 0,
          price: item.price
        }))
      );
    }
  }, [addon]);

  return (
    <>
      <Wrapper>
        <div className="flex flex-col min-h-[calc(100vh-208px)] md:min-h-screen md:mt-[72px] p-8 md:pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] justify-items-center items-center">
          <div className="w-full md:max-w-screen-lg md:pt-5 mt-16 md:mt-0">
            <div className="grid gird-cols-1 md:grid-cols-2 gap-4 md:gap-12 justify-items-center">
              <div className="flex flex-col">
                {studio?.image ? (
                  <Image
                    src={studio.image}
                    alt={studio.name}
                    width={400}
                    height={400}
                    className="w-full h-auto object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
                <div className="flex flex-col items-center -mt-20">
                  <div className="w-full md:w-11/12 flex flex-col items-center rounded-xl md:border bg-card md:text-card-foreground md:shadow">
                    <div className="flex flex-col gap-y-2 p-4">
                      <h2 className="text-lg font-bold">{studio?.name}</h2>
                      <hr className="border-t border-gray-200" />
                      <p
                        className="text-sm text-gray-600 mt-1 text-justify"
                        dangerouslySetInnerHTML={{
                          __html:
                            studio?.description || "No description available."
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-fit w-full hidden md:flex">
                <Card className="w-full pt-6">
                  <div className="p-6 pt-0 flex flex-col gap-y-4">
                    <p className="text-gray-600 text-sm">
                      Pilih layanan Tambahan
                    </p>
                    <div className="flex flex-col gap-y-2">
                      {addon ? (
                        addon.map((item) => (
                          <AddonCard
                            key={item.id}
                            id={item.id}
                            title={item.name}
                            price={item.price}
                            quantity={
                              addonQuantities.find((aq) => aq.id === item.id)
                                ?.quantity || 0
                            }
                            onQuantityChange={(quantity) =>
                              handleQuantityChange(item.id, quantity)
                            }
                          />
                        ))
                      ) : (
                        <p className="text-gray-800">
                          {isLoading
                            ? "Loading addons..."
                            : "Tidak ada layanan tambahan yang tersedia."}
                        </p>
                      )}
                    </div>
                    <hr className="border-t border-gray-200 py-1" />
                    <p className="text-gray-500 text-sm">
                      Tanggal dan sesi yang dipilih
                    </p>
                    <div className="flex gap-x-6 text-gray-600">
                      <div className="flex gap-x-2">
                        <CalendarDays />
                        <p className="text-gray-800">
                          {dateConvert(bookingDate!)}
                        </p>
                      </div>
                      <p>|</p>
                      <div className="flex gap-x-2">
                        <Clock />
                        <p className="text-gray-800">
                          {convertBookingSession(bookingTime!)}
                        </p>
                      </div>
                    </div>
                    <hr className="border-t border-gray-200" />
                    <p className="text-gray-500 text-sm">Voucher</p>
                    <div className="flex gap-x-2">
                      <Input
                        type="text"
                        placeholder="Masukan kode promo"
                        value={selectedVoucher}
                        onChange={(e) => setSelectedVoucher(e.target.value)}
                      />
                      <Button variant={"outline"} onClick={handleApplyVoucher}>
                        {appliedVoucher ? "Ganti Voucher" : "Terapkan"}
                      </Button>
                    </div>
                    {appliedVoucher && !isInvalidVoucher && (
                      <div className="mt-2 text-sm text-green-600">
                        Voucher {appliedVoucher.name} diterapkan (
                        {appliedVoucher.discount}% discount)
                      </div>
                    )}
                    {isInvalidVoucher && (
                      <div className="mt-2 text-sm text-red-600">
                        Voucher tidak valid atau sudah habis
                      </div>
                    )}
                    <hr className="border-t border-gray-200" />
                    <div className="flex justify-between">
                      <p className="text-gray-800">Total Biaya</p>
                      <p className="text-gray-800">
                        Rp {formatRupiah(calculateTotal())}
                      </p>
                    </div>
                    <Button className="w-full" onClick={handleContinue}>
                      Selanjutnya
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
      <div className="p-6 flex flex-col gap-y-4 border-t rounded-t-md md:hidden">
        <p className="text-gray-600 text-sm">Pilih layanan Tambahan</p>
        <div className="flex flex-col gap-y-2">
          {addon ? (
            addon.map((item) => (
              <AddonCard
                key={item.id}
                id={item.id}
                title={item.name}
                price={item.price}
                quantity={
                  addonQuantities.find((aq) => aq.id === item.id)?.quantity || 0
                }
                onQuantityChange={(quantity) =>
                  handleQuantityChange(item.id, quantity)
                }
              />
            ))
          ) : (
            <p className="text-gray-800">
              {isLoading
                ? "Loading addons..."
                : "Tidak ada layanan tambahan yang tersedia."}
            </p>
          )}
        </div>
        <hr className="border-t border-gray-200 py-1" />
        <p className="text-gray-500 text-sm">Tanggal dan sesi yang dipilih</p>
        <div className="flex gap-x-6 text-gray-600">
          <div className="flex gap-x-2">
            <CalendarDays />
            <p className="text-gray-800">{dateConvert(bookingDate!)}</p>
          </div>
          <p>|</p>
          <div className="flex gap-x-2">
            <Clock />
            <p className="text-gray-800">
              {convertBookingSession(bookingTime!)}
            </p>
          </div>
        </div>
        <hr className="border-t border-gray-200" />
        <p className="text-gray-500 text-sm">Voucher</p>
        <div className="flex gap-x-2">
          <Input
            type="text"
            placeholder="Masukan kode promo"
            value={selectedVoucher}
            onChange={(e) => setSelectedVoucher(e.target.value)}
          />
          <Button variant={"outline"} onClick={handleApplyVoucher}>
            {appliedVoucher ? "Ganti Voucher" : "Terapkan"}
          </Button>
        </div>
        <hr className="border-t border-gray-200" />
        <div className="flex justify-between">
          <p className="text-gray-800">Total Biaya</p>
          <p className="text-gray-800">Rp {formatRupiah(calculateTotal())}</p>
        </div>
        <Button className="w-full" onClick={handleContinue}>
          Selanjutnya
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Biodata Pelanggan</DialogTitle>
          </DialogHeader>
          <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Masukkan Nama Anda`}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`Masukkan Email Anda`}
                className="col-span-3"
                type="email"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Nomor HP
              </Label>
              <Input
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={`Masukkan Nama Anda`}
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
