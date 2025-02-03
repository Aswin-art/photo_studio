"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getStudioById } from "@/actions/studioAction";
import { Studio } from "@/types";
import BackNavbar from "@/components/backNavbar";
import Wrapper from "@/components/wrapper";
import { Calendar } from "@/components/ui/calendar";
import { getDailySessions } from "@/actions/bookingAction";
import { convertBookingSession } from "@/utils/convertBookingSession";
import { DailySession, Session } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import { dateConvert } from "@/utils/dateConvert";
import { formatRupiah } from "@/utils/Rupiah";
import { cookieUtils } from "@/utils/cookies";

export default function Booking() {
    const { id } = useParams();
    const [studio, setStudio] = useState<Studio>();
    const [isLoading, setIsLoading] = useState(true);
    const [date, setDate] = React.useState<Date | undefined>(
        cookieUtils.get('bookingDate') ? new Date(cookieUtils.get('bookingDate')!) : new Date()
    );
    const [selectedSession, setSelectedSession] = useState<number | null>(
        Number(cookieUtils.get('bookingTime')) ?? null
    );
    const [dailySessions, setDailySessions] = useState<DailySession>({
        sessions: [],
        message: null,
    });
    const [showAllSessions, setShowAllSessions] = useState(false);  
    const isButtonDisabled = !date || !selectedSession;
    const INITIAL_SESSIONS_TO_SHOW = 10;
    const router = useRouter();

    const handleContinue = () => {
        cookieUtils.set('bookingDate', date?.toISOString());
        cookieUtils.set('bookingTime', selectedSession);
        router.push(`/booking/${id}/addon`);
    };

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
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDailySession = async () => {
        try {
            const data = await getDailySessions(Number(id), date?.toISOString() || "");
            setDailySessions(data);
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDailySession();
        setSelectedSession(null);
    }, [date])

    useEffect(() => {
       fetchStudios();
    }, []);
    
    return (
        <>
            <BackNavbar backPath="/booking" title="Jadwal Booking"/>
            <Wrapper>
                <div className="flex flex-col min-h-[calc(100vh-208px)] md:min-h-screen md:mt-[12px] p-8 md:pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] justify-items-center items-center">
                    <div className="w-full md:max-w-screen-lg md:pt-5 mt-16 md:mt-0">
                        <div className="grid gird-cols-1 md:grid-cols-2 gap-4 md:gap-12 justify-items-center">
                            <div className="flex flex-col items-center gap-y-6 w-full">
                                <div className="flex h-fit w-fit">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border shadow"
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:hidden">
                                    {dailySessions && dailySessions.sessions && dailySessions.sessions.length === 0 && dailySessions.message ? (
                                        <p className="text-gray-800 col-span-3">{dailySessions.message}</p>
                                    ) : dailySessions && dailySessions.sessions && dailySessions.sessions.length > 0 ? (
                                        <>
                                            {dailySessions.sessions
                                                .slice(0, showAllSessions ? undefined : INITIAL_SESSIONS_TO_SHOW)
                                                .map((session: Session, index: number) => (
                                                    <Button
                                                        key={index}
                                                        variant={session.sesi === selectedSession ? "default" : "outline"}
                                                        onClick={() => setSelectedSession(session.sesi)}
                                                        size={"lg"}
                                                        disabled={!session.isAvailable}
                                                    >
                                                        {convertBookingSession(session.sesi)}
                                                    </Button>
                                                ))}
                                            {!showAllSessions && dailySessions.sessions.length > INITIAL_SESSIONS_TO_SHOW && (
                                                <Button
                                                    variant="ghost"
                                                    className="col-span-full mt-2"
                                                    onClick={() => setShowAllSessions(true)}
                                                >
                                                    Tampilkan Lebih Banyak
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-800 col-span-3">
                                            {isLoading ? "Loading sessions..." : "No sessions available for this day."}
                                        </p>
                                    )}
                                </div>
                                <Card className="w-full pt-6 md:flex flex-col hidden">
                                    <CardContent>
                                        <div className="flex flex-col gap-y-4">
                                            <p className="text-gray-500 text-sm">Tanggal dan sesi booking yang dipilih</p>
                                            <div className="flex gap-x-6 text-gray-600">
                                                <div className="flex gap-x-2">
                                                    <CalendarDays/>
                                                    <p className="text-gray-800">{date ? dateConvert(date) : "Anda belum memilih tanggal"}</p>
                                                </div>
                                                <p>|</p>
                                                <div className="flex gap-x-2">
                                                    <Clock/>
                                                    <p className="text-gray-800">{selectedSession ? convertBookingSession(selectedSession) : "Anda belum Sesi"}</p>
                                                </div>
                                            </div>
                                            <hr className="border-t border-gray-200" />
                                            <div className="flex justify-between">
                                                <p className="text-gray-800">Total Biaya</p>
                                                <p className="text-gray-800">Rp{studio ? formatRupiah(studio.price) : "N/A"}</p>
                                            </div>
                                            <Button className="w-full" disabled={isButtonDisabled} onClick={handleContinue}>Selanjutnya</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="hidden md:flex md:flex-col items-center w-full">
                                <Card className="w-full pt-6">
                                    <CardContent>
                                        <div className="flex flex-col gap-y-2">
                                            <p className="text-gray-600 mb-4">Pilih sesi</p>
                                            <div className="grid grid-cols-3 gap-2 md:gap-4">
                                                {dailySessions && dailySessions.sessions && dailySessions.sessions.length === 0 && dailySessions.message ? (
                                                    <p className="text-gray-800 col-span-3">{dailySessions.message}</p>
                                                ) : dailySessions && dailySessions.sessions && dailySessions.sessions.length > 0 ? (
                                                    dailySessions.sessions.map((session: Session, index: number) => (
                                                        <Button
                                                            key={index}
                                                            variant={session.sesi === selectedSession ? "default" : "outline"}
                                                            onClick={() => setSelectedSession(session.sesi)}
                                                            // className={"text-gray-700"}
                                                            disabled={!session.isAvailable}
                                                        >
                                                            {convertBookingSession(session.sesi)}
                                                        </Button>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-800 col-span-3">
                                                        {isLoading ? "Loading sessions..." : "No sessions available for this day."}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
            <div className="flex flex-col md:hidden gap-y-4 p-5 border-t border-gray-300 rounded-t-lg shadow-md">
                <p className="text-gray-500 text-sm">Tanggal dan sesi booking yang dipilih</p>
                <div className="flex gap-x-6 text-gray-600">
                    <div className="flex gap-x-2">
                        <CalendarDays/>
                        <p className="text-gray-800">{date ? dateConvert(date) : "Anda belum memilih tanggal"}</p>
                    </div>
                    <p>|</p>
                    <div className="flex gap-x-2">
                        <Clock/>
                        <p className="text-gray-800">{selectedSession ? convertBookingSession(selectedSession) : "Anda belum Sesi"}</p>
                    </div>
                </div>
                <hr className="border-t border-gray-200" />
                <div className="flex justify-between">
                    <p className="text-gray-800">Total Biaya</p>
                    <p className="text-gray-800">Rp{studio ? formatRupiah(studio.price) : "N/A"}</p>
                </div>
                <Button className="w-full" disabled={isButtonDisabled} onClick={handleContinue}>Selanjutnya</Button>
            </div>
        </>
    );
}

