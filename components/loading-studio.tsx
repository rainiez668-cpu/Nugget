"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const messages = [
  "Dusting off the brief...",
  "Sorting rules from opportunities...",
  "Listening for jury signals...",
  "Hatching three concept directions...",
  "Laying out the board...",
];

export function LoadingStudio() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % messages.length),
      600,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="rounded-4xl border border-ink/10 bg-ink p-8 text-center text-white shadow-soft">
      <div className="relative mx-auto grid h-24 w-24 place-items-center">
        <span className="absolute inset-0 rounded-full border-2 border-gold animate-[pulse-ring_1.4s_ease-out_infinite]" />
        <span className="grid h-16 w-16 place-items-center rounded-[24px] bg-gold text-ink">
          <Sparkles className="h-7 w-7" />
        </span>
      </div>
      <h2 className="display mt-5 text-3xl">Mining for the good bit.</h2>
      <p className="mt-2 text-white/60">{messages[index]}</p>
      <div className="mx-auto mt-6 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 animate-pulse rounded-full bg-gold" />
      </div>
    </div>
  );
}
