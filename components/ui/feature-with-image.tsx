import { Badge } from "@/components/ui/badge";
import Image from "next/image";

function Feature() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
          <Image
            src={"/image/studio.webp"}
            alt={"Studio Kami"}
            width={400}
            height={400}
            className=" rounded-md w-full aspect-video h-full flex-1"
          />
          <div className="flex gap-4 pl-0 lg:pl-20 flex-col  flex-1">
            <div>
              <Badge>Studio Kami</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-xl md:text-3xl lg:text-6xl tracking-tighter lg:max-w-xl font-regular text-left">
              Capture the Best Version of You
              </h2>
              <p className="text-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Abadikan setiap momen spesial dengan pengalaman fotografi 
                terbaik. Studio kami dirancang untuk memberikan pencahayaan  
                sempurna, kenyamanan maksimal, dan hasil berkualitas tinggi.  
                Jadikan setiap jepretan lebih dari sekadar foto ~ biarkan itu 
                menjadi kenangan yang tak terlupakan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
