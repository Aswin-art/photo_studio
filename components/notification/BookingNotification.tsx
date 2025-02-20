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

  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  useEffect(() => {
    if (typeof window === "undefined" || !pusherKey || !pusherCluster) return;

    const pusher = new Pusher(pusherKey, { cluster: pusherCluster });
    const channel = pusher.subscribe("booking-channel");

    channel.bind("new-booking", (data: any) => {
      toast({
        title: "Reservasi Baru",
        description: `Terdapat Reservasi studio baru atas nama ${data.customerName}`,
        type: "background"
      });

      audioRef.current?.play().catch((err) => {
        console.error("Audio tidak bisa diputar:", err);
      });

      triggerRefresh();
    });

    return () => {
      pusher.unsubscribe("booking-channel");
      pusher.disconnect();
    };
  }, [triggerRefresh, pusherKey, pusherCluster, toast]);

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
