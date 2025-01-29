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
import { ArrowRight, Loader2 } from "lucide-react";
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

    if (req) {
      router.push("/canvas/" + req.id);
      toast({
        title: "Success",
        description: "Kode channel berhasil diverifikasi!"
      });
      setCode("");
    } else {
      toast({
        title: "Failed",
        description: "Kode channel yang anda masukkan salah!"
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
          <Button disabled={isLoading} onClick={handleCheckChannelCode}>
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
