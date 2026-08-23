"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { MovieItem } from "@/types/movie";

interface HeroProps {
  featuredMovie?: MovieItem;
}

export default function Hero({ featuredMovie }: HeroProps) {
  const [sweep, setSweep] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSweep(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Si featuredMovie existe, toma sus valores de la BD.
  // Si no viene featuredMovie, usa 'pelicula-horizontal-1080p' que es el slug real registrado en tu DB.
  const title = featuredMovie?.title || "EVANGELION";
  const description =
    featuredMovie?.description ||
    "Tras el cataclismo global del Segundo Impacto, la organización secreta NERV recluta a adolescentes para pilotar monstruos biomecánicos llamados EVAs.";
  const bgImage = featuredMovie?.bannerUrl || "/images/evangelion.jpg";
  
  // AQUÍ ESTÁ EL CAMBIO CLAVE: Usa el slug o id real de la base de datos
  const slug = featuredMovie?.slug ?? featuredMovie?.id ?? "pelicula-horizontal-1080p";

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "90vh" }}
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url('${bgImage}')`,
        }}
      />

      {/* Animación emberSweep */}
      {sweep && (
        <div
          className="absolute inset-y-0 w-1/3 pointer-events-none"
          style={{
            background:
              "linear-gradient(75deg, transparent, rgba(255,158,90,0.18), transparent)",
            animation: "emberSweep 2.6s ease-out forwards",
          }}
        />
      )}

      {/* Degradado inferior */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(0deg, #0E0B0A 2%, transparent 42%)",
        }}
      />

      {/* Degradado lateral */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(14,11,10,0.85) 0%, transparent 60%)",
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-8 pb-16 max-w-2xl">
        <span
          className="text-[13px] font-semibold mb-3 tracking-wide uppercase"
          style={{ color: "#F2C94C" }}
        >
          MORGFLIX · DESTACADO
        </span>

        <h1
          className="uppercase"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(42px, 7vw, 80px)",
            lineHeight: 0.95,
            color: "#F5EFE6",
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </h1>

        <p
          className="mt-4 text-[15px] leading-relaxed line-clamp-3 max-w-xl"
          style={{ color: "#D8CFC3" }}
        >
          {description}
        </p>

        {/* Botones de Acción */}
        <div className="flex items-center gap-3 mt-7">
          <Link
            href={`/watch/${slug}`}
            className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-[15px] transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "#F5EFE6",
              color: "#0E0B0A",
            }}
          >
            <Play size={18} fill="#0E0B0A" />
            Reproducir
          </Link>

          <button
            className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-[15px] border transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "rgba(120,110,100,0.25)",
              color: "#F5EFE6",
              borderColor: "rgba(245,239,230,0.15)",
            }}
          >
            <Info size={18} />
            Más información
          </button>
        </div>
      </div>
    </div>
  );
}