import { Navbar1 } from "@/components/blocks/shadcnblocks-com-navbar1"

const demoData = {
  logo: {
    url: "/",
    src: "/image/logo.png",
    alt: "ProStudio",
    title: "ProStudio",
  },
  menu: [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Booking",
      url: "/booking",
    },
    {
      title: "Contact Us",
      url: "/contact-us",
    },
    {
      title: "Photo Access",
      url: "/canvas",
    },
  ]
};

function Navbar1Demo() {
  return <div className="w-full z-20 bg-white"><Navbar1 {...demoData} /></div>;
}

export { Navbar1Demo };
