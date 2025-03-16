import InstallSnippet from "@/components/install-snippet";
import SandBox from "@/components/sandbox";
import { Badge } from "@/components/ui/badge";
import PixelTrail from "@/fancy/components/background/pixel-trail";
import { Pixelify_Sans } from "next/font/google";

const pixelifySans = Pixelify_Sans({
  weight: "400",
  subsets: ["cyrillic"],
});

export default function Home() {
  return (
    <div
      className={`${pixelifySans.className} flex-col pt-10 md:pt-52 lg:px-20 overflow-hidden`}
    >
      <div className="absolute inset-0 z-0">
        <PixelTrail
          pixelSize={24}
          fadeDuration={500}
          pixelClassName="bg-white/20"
        />
      </div>
      <div className="flex justify-center items-center flex-col lg:flex-row px-10 sm:px-10 gap-10">
        <div className="flex flex-col">
          <Badge variant="outline" className="bg-green-800/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-mono">v0.0.15 Released</p>
            </div>
          </Badge>
          <div className="mt-5">
            <h1 className="text-4xl md:text-6xl font-bold">Pixel Motion</h1>
            <p className="text-sm md:text-2xl text-muted-foreground">
              A React component for animating sprites with pixelated motion
            </p>
          </div>
        </div>
        <div className="flex flex-col z-10 w-full">
          <InstallSnippet />
        </div>
      </div>
      <div className="mt-20 px-10">
        <SandBox />
      </div>
    </div>
  );
}
