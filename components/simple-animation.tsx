"use client";
import { PixelMotion } from "@ga1az/react-pixel-motion";

export default function SimpleAnimation() {
  return (
    <PixelMotion
      sprite="/guardbot1.svg"
      width={24}
      height={31}
      frameCount={3}
      fps={10}
      scale={5}
      shouldAnimate={true}
    />
  );
}
