"use client";

import { PixelMotion } from "@ga1az/react-pixel-motion";
import soldier from "@/public/soldier.webp";
import { useState } from "react";

export default function SoldierAttack() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  return (
    <div className="flex flex-col gap-4 items-center justify-center relative">
      <div className="flex gap-2 items-center justify-center font-bold font-mono border rounded-md px-3">
        <p className="">Frame:</p>
        <span className="text-green-500">{frame}</span>
      </div>
      <div className="absolute bottom-0 right-0 text-sm text-gray-500/30">
        Art By: Riley Gombart
      </div>
      <div className="flex flex-col gap-2 items-center justify-center w-full">
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="border border-green-500 rounded-md px-3 py-1 w-36"
          disabled={isPlaying}
        >
          {isPlaying ? "Attacking..." : "Attack!"}
        </button>
        <PixelMotion
          sprite={soldier}
          width={30}
          height={31}
          startFrame={0}
          frameCount={15}
          fps={35}
          shouldAnimate={isPlaying}
          loop={false}
          scale={10}
          onAnimationEnd={() => {
            setIsPlaying(false);
          }}
          onFrameChange={(frameIndex: number) => {
            setFrame(frameIndex);
          }}
        />
      </div>
    </div>
  );
}
