"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Error al parsear el usuario");
      }
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleLogout = () => {
    // 1. Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Eliminar la cookie auth_token del servidor
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";

    // 3. Limpiar estado local del usuario
    setUser(null);

    // 4. Refrescar la ruta actual para actualizar el estado sin cambiar de página
    router.refresh();
  };

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4"
      style={{
        background: scrolled
          ? "#0E0B0A"
          : "linear-gradient(180deg, rgba(14,11,10,0.9), transparent)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "none",
      }}
    >
      <div className="flex items-center gap-8">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            color: "#FF6A3D",
          }}
        >
          MorgFlix
        </span>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#">Series</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Search size={19} />
        <Bell size={19} />

        {user ? (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-black uppercase"
              style={{
                background:
                  "linear-gradient(135deg, #FF6A3D, #F2C94C)",
              }}
            >
              {user.name.charAt(0)}
            </div>

            <button onClick={handleLogout} title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link href="/login">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{
                background:
                  "linear-gradient(135deg, #FF6A3D, #F2C94C)",
              }}
            >
              ?
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}