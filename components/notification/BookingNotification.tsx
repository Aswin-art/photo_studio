/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef } from "react";
import { useTransactionContext } from "@/components/transaction/TransactionContext";
import Pusher from "pusher-js";
import { useToast } from "@/hooks/use-toast";

const BookingNotifications = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { triggerRefresh } = useTransactionContext();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    });

    const channel = pusher.subscribe("booking-channel");

    channel.bind("new-booking", (data: any) => {
      toast({
        title: "Reservasi Baru",
        description: `Terdapat Reservasi studio baru atas nama ${data.customerName}`,
        type: "background"
      });

      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.error("Audio tidak bisa diputar:", err);
        });
      }

      triggerRefresh();
    });

    return () => {
      pusher.unsubscribe("booking-channel");
    };
  }, [triggerRefresh]);

  return (
    <>
      <audio
        ref={audioRef}
        src="/mixkit-positive-notification-951.wav"
        preload="auto"
      />
    </>
  );
};

export default BookingNotifications;
