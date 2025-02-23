"use client";

import * as React from "react";
import Image from "next/image";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  Camera, Calendar, Ticket, Receipt, CopyPlus, LayoutTemplate, TvMinimal
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise"
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup"
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free"
    }
  ],
  navMain: [
    {
      title: "Foto Editor",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Channels",
          url: "/dashboard/channels"
        },
        {
          title: "Templates",
          url: "/dashboard/templates"
        }
      ]
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#"
        },
        {
          title: "Explorer",
          url: "#"
        },
        {
          title: "Quantum",
          url: "#"
        }
      ]
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#"
        },
        {
          title: "Get Started",
          url: "#"
        },
        {
          title: "Tutorials",
          url: "#"
        },
        {
          title: "Changelog",
          url: "#"
        }
      ]
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#"
        },
        {
          title: "Team",
          url: "#"
        },
        {
          title: "Billing",
          url: "#"
        },
        {
          title: "Limits",
          url: "#"
        }
      ]
    }
  ],
  projects: [
    {
      name: "Studio",
      url: "/dashboard/studio",
      icon: Camera // Icon kamera untuk studio fotografi
    },
    {
      name: "Layanan Tambahan",
      url: "/dashboard/addon",
      icon: CopyPlus // Icon kamera untuk studio fotografi
    },
    {
      name: "Jadwal Foto",
      url: "/dashboard/holiday",
      icon: Calendar // Icon kalender untuk penjadwalan
    },
    {
      name: "Voucher",
      url: "/dashboard/voucher",
      icon: Ticket // Icon tiket untuk voucher
    },
    {
      name: "Transaksi",
      url: "/dashboard/transaction",
      icon: Receipt  // Icon kwitansi untuk transaksi
    },
    {
      name: "Channels",
      url: "/dashboard/channels",
      icon: TvMinimal
    },
    {
      name: "Templates",
      url: "/dashboard/templates",
      icon: LayoutTemplate
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // if (!user) return;
  const user = "admin";
  // const userData = {
  //   name: user.firstName as string,
  //   email: user.emailAddresses[0].emailAddress,
  //   avatar: user.imageUrl
  // };
  const userData = {
    name: "admin",
    email: "email",
    avatar: "user.imageUrl"
  };

  return (
    user && (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <Image
            src={"/image/logo.png"}
            alt={"Studio Kami"}
            width={400}
            height={200}
            className=" rounded-md w-28 h-full flex-1 object-contain self-center"
          />
        </SidebarHeader>
        <SidebarContent>
          {/* <NavMain items={data.navMain} /> */}
          <NavProjects projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={userData} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  );
}
