"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import {  useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Wrapper from "@/components/wrapper";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";


const LoginForm = () => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: true,
        callbackUrl: "/dashboard"
      });
      if (response?.error) {
        toast({
            title: "Gagal",
            description: "Email atau password yang Anda masukkan salah. Coba lagi",
            type: "foreground"
        });
      } else {
        router.push("/dashboard");
      }
    } catch (e) {
      console.error(e);
      toast({
          title: "Gagal",
          description: "Email atau password yang Anda masukkan salah. Coba lagi",
          type: "foreground"
      });
    }
  }

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <Wrapper>
      <div className="grid mt-16 min-h-[calc(100vh-348px)] p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Selamat Datang Kembali!</CardTitle>
            <CardDescription className="text-center">Masukkan identitas Anda untuk masuk ke akun Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email" 
                    placeholder="hi@yourcompany.com" 
                    required 
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
};

export default LoginForm;
