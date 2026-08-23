"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Plus, Check } from "lucide-react";
import { MovieItem } from "@/types/movie";

export default function Poster({ item }: { item: MovieItem }) {
  const [h1, h2] = item.hue ?? [220, 260];
  const [saved, setSaved] = useState(false);

  const watchTarget = item.slug ?? item.id;
  const posterSrc = item.posterUrl ?? item.bannerUrl;

  return (
    <div className="group relative shrink-0 w-52 cursor-pointer select-none">
      <div
        className="relative overflow-hidden rounded-md transition-transform duration-300 ease-out group-hover:scale-[1.06] group-hover:z-20"
        style={{
          aspectRatio: "16 / 9",
          background: `linear-gradient(
            135deg,
            hsl(${h1} 70% 14%) 0%,
            hsl(${h2} 65% 22%) 60%,
            hsl(${h1} 80% 30%) 100%
          )`,
        }}
      >
        {posterSrc && (
          <img
            src={posterSrc}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:opacity-80 transition-opacity"
          />
        )}

        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <p
            className="leading-tight"
            style={{
              color: "#F5EFE6",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.03em",
              fontSize: "16px",
            }}
          >
            {item.title}
          </p>

          {item.tag && (
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "#B8AC9E" }}
            >
              {item.tag}
            </p>
          )}
        </div>

        {typeof item.progress === "number" && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="h-full"
              style={{
                width: `${item.progress}%`,
                background: "#FF6A3D",
              }}
            />
          </div>
        )}

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 bg-black/30">
          <Link
            href={`/watch/${watchTarget}`}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            style={{ background: "#F5EFE6" }}
          >
            <Play size={16} fill="#0E0B0A" color="#0E0B0A" />
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSaved((s) => !s);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-transform hover:scale-110 active:scale-95"
            style={{
              borderColor: "rgba(245,239,230,0.5)",
              background: "rgba(14,11,10,0.4)",
            }}
          >
            {saved ? (
              <Check size={15} color="#F5EFE6" />
            ) : (
              <Plus size={15} color="#F5EFE6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}