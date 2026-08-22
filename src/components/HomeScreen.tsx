"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Info, Search, Bell, ChevronLeft, ChevronRight, Plus, Check, LogOut } from "lucide-react";

type RowItem = {
  id: string;
  title: string;
  tag: string;
  hue: [number, number];
  progress?: number;
};

type RowData = {
  title: string;
  items: RowItem[];
};

const ROWS: RowData[] = [
  {
    title: "Continuar viendo",
    items: [
      { id: "c1", title: "Evangelion Cap1", tag: "Anime", hue: [16, 60], progress: 62 },
      { id: "c2", title: "Evangelion Cap2", tag: "Anime", hue: [280, 320], progress: 30 },
    ],
  },
];

function Poster({ item }: { item: RowItem }) {
  const [h1, h2] = item.hue;
  const [saved, setSaved] = useState(false);
  return (
    <div className="group relative shrink-0 w-52 cursor-pointer select-none" style={{ scrollSnapAlign: "start" }}>
      <div
        className="relative overflow-hidden rounded-md transition-transform duration-300 ease-out group-hover:scale-[1.06] group-hover:z-20"
        style={{
          aspectRatio: "16 / 9",
          background: `linear-gradient(135deg, hsl(${h1} 70% 14%) 0%, hsl(${h2} 65% 22%) 60%, hsl(${h1} 80% 30%) 100%)`,
          boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "radial-gradient(120% 100% at 50% 100%, rgba(255,106,61,0.35), transparent 60%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p
            className="leading-tight"
            style={{ color: "#F5EFE6", fontFamily: "var(--font-display)", letterSpacing: "0.03em", fontSize: "16px" }}
          >
            {item.title}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "#B8AC9E" }}>
            {item.tag}
          </p>
        </div>
        {typeof item.progress === "number" && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="h-full" style={{ width: `${item.progress}%`, background: "#FF6A3D" }} />
          </div>
        )}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#F5EFE6" }}
            aria-label={`Reproducir ${item.title}`}
          >
            <Play size={16} fill="#0E0B0A" color="#0E0B0A" style={{ marginLeft: 2 }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSaved((s) => !s);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center border"
            style={{ borderColor: "rgba(245,239,230,0.5)", background: "rgba(14,11,10,0.4)" }}
            aria-label={saved ? "Quitar de mi lista" : "Añadir a mi lista"}
          >
            {saved ? <Check size={15} color="#F5EFE6" /> : <Plus size={15} color="#F5EFE6" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ title, items }: RowData) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 640, behavior: "smooth" });
  };
  return (
    <section className="relative mb-9 px-4 sm:px-8">
      <h2 className="mb-3 text-[19px] font-semibold" style={{ color: "#F5EFE6", letterSpacing: "0.01em" }}>
        {title}
      </h2>
      <div className="relative">
        <button
          onClick={() => scrollBy(-1)}
          className="hidden sm:flex absolute -left-2 top-0 bottom-0 z-30 w-10 items-center justify-center"
          style={{ background: "linear-gradient(90deg, #0E0B0A 20%, transparent)" }}
          aria-label="Anterior"
        >
          <ChevronLeft size={22} color="#F5EFE6" />
        </button>
        <div
          ref={ref}
          className="flex gap-2.5 overflow-x-auto pb-2"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {items.map((it) => (
            <Poster key={it.id} item={it} />
          ))}
        </div>
        <button
          onClick={() => scrollBy(1)}
          className="hidden sm:flex absolute -right-2 top-0 bottom-0 z-30 w-10 items-center justify-center"
          style={{ background: "linear-gradient(270deg, #0E0B0A 20%, transparent)" }}
          aria-label="Siguiente"
        >
          <ChevronRight size={22} color="#F5EFE6" />
        </button>
      </div>
    </section>
  );
}

export default function HomeScreen() {
  const [scrolled, setScrolled] = useState(false);
  const [sweep, setSweep] = useState(false);

  // Estado para el usuario autenticado
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    const t = setTimeout(() => setSweep(true), 300);

    // Verificar si existe token y datos del usuario en localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error al parsear el usuario", e);
      }
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div style={{ background: "#0E0B0A", minHeight: "100vh" }}>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        @keyframes emberSweep {
          0% { transform: translateX(-30%) rotate(8deg); opacity: 0; }
          15% { opacity: 0.55; }
          55% { opacity: 0.25; }
          100% { transform: translateX(130%) rotate(8deg); opacity: 0; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 0.92; }
          50% { opacity: 1; }
          72% { opacity: 0.96; }
        }
        .ember-flicker { animation: flicker 6s ease-in-out infinite; }
      `}</style>

      {/* NAVBAR */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 transition-colors duration-300"
        style={{
          background: scrolled ? "#0E0B0A" : "linear-gradient(180deg, rgba(14,11,10,0.9), transparent)",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="flex items-center gap-8">
          <span
            className="ember-flicker"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "26px",
              letterSpacing: "0.06em",
              color: "#FF6A3D",
              textShadow: "0 0 18px rgba(255,106,61,0.5)",
            }}
          >
            MorgFlix
          </span>
          <nav className="hidden md:flex items-center gap-6 text-[14px]" style={{ color: "#D8CFC3" }}>
            <a className="hover:text-white transition-colors" href="#">Series</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Search size={19} color="#D8CFC3" className="cursor-pointer hover:opacity-80" />
          <Bell size={19} color="#D8CFC3" className="cursor-pointer hover:opacity-80" />

          {/* AVATAR Y AUTENTICACIÓN */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Inicial del usuario */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-black uppercase"
                style={{ background: "linear-gradient(135deg, #FF6A3D, #F2C94C)" }}
                title={user.name}
              >
                {user.name.charAt(0)}
              </div>

              {/* Botón para cerrar sesión */}
              <button
                onClick={handleLogout}
                className="p-1 hover:opacity-80 transition-opacity"
                title="Cerrar sesión"
              >
                <LogOut size={18} color="#D8CFC3" />
              </button>
            </div>
          ) : (
            /* Usuario NO autenticado: muestra el signo '?' y redirige a /login */
            <Link href="/login">
              <div
                className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center text-xs font-bold text-black"
                style={{ background: "linear-gradient(135deg, #FF6A3D, #F2C94C)" }}
              >
                ?
              </div>
            </Link>
          )}
        </div>
      </header>

      {/* HERO */}
      <div className="relative w-full overflow-hidden" style={{ height: "90vh" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/evangelion.jpg')",
          }}
        />
        {sweep && (
          <div
            className="absolute inset-y-0 w-1/3"
            style={{
              background: "linear-gradient(75deg, transparent, rgba(255,158,90,0.18), transparent)",
              animation: "emberSweep 2.6s ease-out forwards",
            }}
          />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, #0E0B0A 2%, transparent 42%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(14,11,10,0.75) 0%, transparent 55%)" }} />

        <div className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-8 pb-16 max-w-xl">
          <span className="text-[13px] font-semibold mb-3 tracking-wide" style={{ color: "#F2C94C" }}>
            ORIGINAL MORGFLIX · ANIME
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 8vw, 84px)",
              lineHeight: 0.95,
              color: "#F5EFE6",
              letterSpacing: "0.01em",
            }}
          >
            EVANGELION
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "#D8CFC3" }}>
            Tras el cataclismo global del Segundo Impacto, la organización secreta NERV recluta a adolescentes para pilotar monstruos biomecánicos llamados EVAs. Su misión: destruir a los letales Ángeles que amenazan con extinguir a la humanidad.
          </p>
          <div className="flex items-center gap-3 mt-7">
            <button className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-[15px]" style={{ background: "#F5EFE6", color: "#0E0B0A" }}>
              <Play size={18} fill="#0E0B0A" /> Reproducir
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-[15px] border"
              style={{ background: "rgba(120,110,100,0.25)", color: "#F5EFE6", borderColor: "rgba(245,239,230,0.15)" }}
            >
              <Info size={18} /> Más información
            </button>
          </div>
        </div>
      </div>

      {/* ROWS */}
      <main className="relative z-10 -mt-10 pb-20">
        {ROWS.map((row) => (
          <Row key={row.title} title={row.title} items={row.items} />
        ))}
      </main>

      <footer className="px-4 sm:px-8 py-10 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p style={{ color: "#6B6259", fontSize: "13px" }}>
          MORGFLIX
        </p>
      </footer>
    </div>
  );
}