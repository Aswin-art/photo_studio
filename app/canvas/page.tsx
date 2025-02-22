"use client";
import { checkChannelUser } from "@/actions/channels";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const router = useRouter();

  const handleCheckChannelCode = async () => {
    setIsLoading(true);
    if (!code) {
      toast({
        title: "Failed",
        description: "Harap masukkan kode channel anda!"
      });
    }

    const req = await checkChannelUser(code);

    if (!req) {
      setIsLoading(false);
      return toast({
        title: "Failed",
        description: "Kode channel yang anda masukkan salah!"
      });
    }

    if (req?.email == null || req?.phone == null) {
      setIsLoading(false);
      return toast({
        title: "Failed",
        description:
          "Maaf data channel anda belum lengkap, harap hubungi admin!"
      });
    }

    if (req?.Results.length > 1) {
      router.push("/results/" + req.Results[0].id);

      return;
    }

    if (req && req.Results.length <= 0) {
      router.push("/canvas/" + req.id);
      return toast({
        title: "Success",
        description: "Kode channel berhasil diverifikasi!"
      });
    }

    setIsLoading(false);
  };
  return (
    <div className="h-[100vh] w-full bg-[url('https://idseducation.com/wp-content/uploads/2017/06/Studio.jpg')] bg-cover bg-center bg-bottom">
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Masukkan Kode</DialogTitle>
            <DialogDescription>
              Harap masukkan kode dari channel anda!
            </DialogDescription>
          </DialogHeader>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
            placeholder="Masukkan kode..."
            required
          />
          <div className="flex gap-x-3 w-full">
            <Button className="w-full" onClick={() => router.push("/")}>
                  <ArrowLeft /> Back
            </Button>
            <Button className="w-full" disabled={isLoading} onClick={handleCheckChannelCode}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Loading...
                </>
              ) : (
                <>
                  Submit <ArrowRight />
                </>
              )}
            </Button>
          </div>
          <DialogFooter>
            <p className="text-muted-foreground text-sm">
              Minta kepada admin jika anda tidak memiliki kode channel
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
