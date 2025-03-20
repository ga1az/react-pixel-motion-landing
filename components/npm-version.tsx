"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export default function NpmVersion() {
  const [version, setVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://registry.npmjs.org/@ga1az/react-pixel-motion", {
      next: {
        revalidate: 60 * 60 * 1, // 1 hour
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVersion(data["dist-tags"].latest);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      {loading ? (
        <Skeleton className="w-10 h-4" />
      ) : (
        <p className="text-xs font-mono">v{version} Released</p>
      )}
    </>
  );
}
