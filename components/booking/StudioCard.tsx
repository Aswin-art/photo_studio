"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Studio } from "@/types";
import { formatRupiah } from "@/utils/Rupiah";
import { Button } from "@/components/ui/button"
import { useState } from "react";

export default function StudioCard({
  studio,
  buttonTitle
}: {
  studio: Studio;
  buttonTitle: string
}) {
    const [isSubmit, setIsSubmit] = useState(false);
    const router = useRouter();

    const handlePilihStudio = async () => {
        setIsSubmit(true);
        await router.push(`/booking/${studio.id}`);
        setIsSubmit(false);
    };

    return (
        <>
            <div className="flex flex-col border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {studio.image ? (
                    <Image
                    src={studio.image}
                    alt={studio.name}
                    width={400}
                    height={400}
                    className="w-full h-48 object-cover"
                    />
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                    </div>
                )}

                <div className="p-4 flex flex-col gap-y-1 flex-grow">
                    <h2 className="text-lg font-bold">{studio.name}</h2>
                    <h2 className="text-[16px] font-semibold">Rp{formatRupiah(studio.price.toString())}</h2>
                    {/* <span className="w-full border-t border-gray-300 my-2"></span> */}
                    <p className="text-sm text-gray-600 mt-1 text-justify line-clamp-4" dangerouslySetInnerHTML={{ __html: studio.description || 'No description available.' }} />
                    <div className="mt-auto">
                        <Button className="w-full mt-4" onClick={handlePilihStudio}>
                            {isSubmit ? 'Memuat...' : buttonTitle}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
