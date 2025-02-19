"use client";
import React, { useEffect, useState } from "react";
import { getStudios } from "@/actions/studioAction";
import { Studio } from "@/types";
import StudioList from "../booking/StudioList";

export default function Service() {
    const [studios, setStudios] = useState<Studio[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStudios = async () => {
        try {
        const data = await getStudios();
        setStudios(data);
        } catch (error) {
        console.error("Failed to fetch studios:", error);
        } finally {
        setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudios();
    }, []);

    return (
        <div className="w-full px-5 sm:px-10 md:px-16 lg:px-40">
            <section className="flex flex-col items-center gap-10 py-10 lg:py-20">
                <div className="space-y-7 text-center">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-medium md:text-5xl">Studio & Layanan</h1>
                        <p className="text-muted-foreground">Pilih studio dan layanan sesuai kebutuhan Anda.</p>
                    </div>
                </div>
                <StudioList isLoading={isLoading} studios={studios} buttonTitle="Booking Studio" />
            </section>
        </div>
    );
}
