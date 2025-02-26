"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Foooter() {
  // const [isDarkMode, setIsDarkMode] = React.useState(false);
  // const [isChatOpen, setIsChatOpen] = React.useState(false);

  // React.useEffect(() => {
  //   if (isDarkMode) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [isDarkMode]);

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Image
              src={"/image/logo.png"}
              alt={"Studio Kami"}
              width={400}
              height={200}
              className=" rounded-md w-full h-8 flex-1 object-contain mb-4"
            />
            <p className="mb-6 text-muted-foreground text-center">
              The new standard of photo studio
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-center md:text-start">Quick Links</h3>
            <nav className="space-y-2 text-sm justify-items-center md:justify-items-start">
              <Link
                href="/"
                className="block transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/booking"
                className="block transition-colors hover:text-primary"
              >
                Booking
              </Link>
              <Link
                href="https://wa.me/6285770037336"
                className="block transition-colors hover:text-primary"
              >
                Contact Us
              </Link>
              <Link
                href="photo-access"
                className="block transition-colors hover:text-primary"
              >
                Photo Access
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-center md:text-start">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic justify-items-center md:justify-items-start">
              <p>Ruko Kraton Superblock, Kec. Krian</p>
              <p>Kabupaten Sidoarjo, Jawa Timur</p>
              <p>Phone: (+62) 857-7003-7336</p>
              <p>Email: prostudio098@gmail.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold text-center md:text-start">Follow Us</h3>
            <div className="mb-6 flex space-x-4 justify-center items-center md:justify-start md:align-baseline">
              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() =>
                        window.open(
                          "https://www.instagram.com/prostudio_id/",
                          "_blank"
                        )
                      }
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 prostudio. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Cookie Settings
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
