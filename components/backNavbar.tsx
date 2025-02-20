"use client";
import React from "react";
import Link from "next/link";
import Wrapper from "./wrapper";
import { ArrowLeft } from "lucide-react";

interface BackNavbarProps {
  backPath: string;
  title: string;
}

const BackNavbar: React.FC<BackNavbarProps> = ({ backPath, title }) => {
  return (
    <div className="w-full fixed top-0 left-0 right-0 z-20 p-4">
      <Wrapper>
        <div className="flex justify-between items-center gap-4 rounded-xl p-4 border bg-background border-input">
          <aside className="flex gap-2 items-center">
            <Link href={backPath} className="font-bold text-xl">
              <ArrowLeft />
            </Link>
            <p className="text-xl font-semibold ml-4">{title}</p>
          </aside>
        </div>
      </Wrapper>
    </div>
  );
};

export default BackNavbar;
