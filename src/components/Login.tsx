"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://morgflix-streaming.onrender.com/api";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.email?.[0] || "Error al iniciar sesión.");
      }

      // 1. Guardar en localStorage para tu lógica del cliente
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 2. Crear la cookie auth_token para que el middleware la reconozca en el servidor
      document.cookie = `auth_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

      // 3. Redirigir al inicio
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0E0B0A] px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <h1
          className="text-center text-4xl mb-8"
          style={{
            color: "#FF6A3D",
            fontFamily: "var(--font-display)",
          }}
        >
          MorgFlix
        </h1>

        {/* Login */}
        <form
          onSubmit={handleLogin}
          className="bg-[#171210] border border-white/10 rounded-lg p-8"
        >
          <h2 className="text-2xl font-semibold text-[#F5EFE6] mb-6">
            Iniciar sesión
          </h2>

          {/* Usuario (email) */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm text-[#D8CFC3] mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
              className="w-full px-4 py-3 rounded bg-[#0E0B0A] border border-white/10 text-[#F5EFE6] outline-none focus:border-[#FF6A3D]"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm text-[#D8CFC3] mb-2"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded bg-[#0E0B0A] border border-white/10 text-[#F5EFE6] outline-none focus:border-[#FF6A3D]"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm mb-4">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded font-semibold transition-opacity disabled:opacity-50"
            style={{
              background: "#F5EFE6",
              color: "#0E0B0A",
            }}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </main>
  );
}