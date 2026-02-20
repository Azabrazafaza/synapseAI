"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "icon-only" | "icon-text";
  className?: string;
}

const sizeMap = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 48, text: "text-2xl" },
};

export function BrandLogo({
  size = "md",
  variant = "icon-text",
  className,
}: BrandLogoProps) {
  const { icon: iconSize, text: textSize } = sizeMap[size];
  const [imageError, setImageError] = useState(false);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative" style={{ width: iconSize, height: iconSize }}>
        {!imageError ? (
          <Image
            src="/logo.png"
            alt="SynapseAI"
            width={iconSize}
            height={iconSize}
            className="object-contain"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold" style={{ fontSize: iconSize * 0.4 }}>
            S
          </div>
        )}
      </div>
      {variant === "icon-text" && (
        <span className={cn("font-semibold text-foreground", textSize)}>
          SynapseAI
        </span>
      )}
    </div>
  );
}
