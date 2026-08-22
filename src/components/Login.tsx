"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Muestra el mensaje de error del backend (ej. credenciales inválidas o error 422)
        throw new Error(data.message || data.errors?.name?.[0] || "Error al iniciar sesión.");
      }

      // Guardar sesión devuelta por Laravel
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Login correcto → Redirigir a HomeScreen
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

          {/* Usuario (name) */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm text-[#D8CFC3] mb-2"
            >
              Usuario
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa tu usuario"
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