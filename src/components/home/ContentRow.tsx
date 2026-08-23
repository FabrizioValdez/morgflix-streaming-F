"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Poster from "./Poster";
import { RowData } from "@/types/movie";

export default function ContentRow({ title, items }: RowData) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    ref.current?.scrollBy({
      left: dir * 640,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative mb-9 px-4 sm:px-8">
      <h2
        className="mb-3 text-[19px] font-semibold"
        style={{
          color: "#F5EFE6",
          letterSpacing: "0.01em",
        }}
      >
        {title}
      </h2>

      <div className="relative">

        <button
          onClick={() => scrollBy(-1)}
          className="hidden sm:flex absolute -left-2 top-0 bottom-0 z-30 w-10 items-center justify-center"
          aria-label="Anterior"
        >
          <ChevronLeft size={22} color="#F5EFE6" />
        </button>

        <div
          ref={ref}
          className="flex gap-2.5 overflow-x-auto pb-2"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
        >
          {items.map((item) => (
            <Poster key={item.id} item={item} />
          ))}
        </div>

        <button
          onClick={() => scrollBy(1)}
          className="hidden sm:flex absolute -right-2 top-0 bottom-0 z-30 w-10 items-center justify-center"
          aria-label="Siguiente"
        >
          <ChevronRight size={22} color="#F5EFE6" />
        </button>

      </div>
    </section>
  );
}