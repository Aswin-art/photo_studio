import { Navbar1 } from "@/components/blocks/shadcnblocks-com-navbar1"

const demoData = {
  logo: {
    url: "https://www.shadcnblocks.com",
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
      url: "/photo-access",
    },
  ]
};

function Navbar1Demo() {
  return <div className="w-full fixed top-0 left-0 right-0 z-20 bg-white"><Navbar1 {...demoData} /></div>;
}

export { Navbar1Demo };
