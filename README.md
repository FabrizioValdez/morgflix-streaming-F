# LUMBRE — Plataforma de streaming (Next.js + Supabase)

Proyecto base: Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Supabase.

## 1. Requisitos

- Node.js 18.18 o superior
- Una cuenta gratuita en [supabase.com](https://supabase.com)
- Una cuenta gratuita en [vercel.com](https://vercel.com)
- Cuenta de GitHub (recomendado, para conectar el repo a Vercel)

## 2. Correrlo en local

```bash
npm install
cp .env.local.example .env.local   # luego completa las variables (paso 3)
npm run dev
```

Abre http://localhost:3000

## 3. Crear el proyecto de Supabase

1. Entra a https://supabase.com/dashboard → **New project**.
2. Cuando termine de crearse, ve a **Project Settings → API** y copia:
   - `Project URL` → pégalo en `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → pégalo en `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Ve a **SQL Editor → New query**, pega todo el contenido de `supabase/schema.sql`
   y dale **Run**. Esto crea las tablas: `profiles`, `titles`, `episodes`,
   `watch_progress`, `my_list`, con Row Level Security ya configurado, más
   3 títulos de ejemplo.
4. (Opcional) En **Authentication → Providers**, activa Email o Google/GitHub
   según cómo quieras que la gente inicie sesión.

## 4. Estructura del proyecto

```
src/
  app/
    layout.tsx        # fuentes (Bebas Neue + Inter) y metadata
    page.tsx           # renderiza la home
    globals.css
  components/
    HomeScreen.tsx      # interfaz completa: navbar, hero, filas de posters
  lib/
    supabase/
      client.ts         # cliente de Supabase para el navegador
      server.ts          # cliente de Supabase para Server Components
  middleware.ts          # refresca la sesión en cada request
supabase/
  schema.sql             # tablas + políticas RLS + datos de ejemplo
```

## 5. Conectar el catálogo real a la interfaz

Ahora mismo `HomeScreen.tsx` usa datos de ejemplo (`ROWS`) directo en el
componente. El siguiente paso es traerlos desde Supabase. Ejemplo dentro de
un Server Component:

```ts
// src/app/page.tsx
import { createClient } from "@/lib/supabase/server";
import HomeScreen from "@/components/HomeScreen";

export default async function Home() {
  const supabase = await createClient();
  const { data: titles } = await supabase
    .from("titles")
    .select("*")
    .order("created_at", { ascending: false });

  return <HomeScreen titles={titles ?? []} />;
}
```

(Vas a necesitar adaptar `HomeScreen` para recibir `titles` como prop en vez
del array `ROWS` fijo — puedo ayudarte con eso cuando quieras dar ese paso.)

## 6. Video real (HLS/DASH)

Supabase Storage no está pensado para servir video adaptativo. Cuando tengas
contenido real:

1. Sube el video a **Mux**, **Cloudflare Stream** o **Bunny.net**.
2. Guarda la URL del manifest (`.m3u8`) en la columna `video_url` de
   `titles` o `episodes`.
3. Usa un reproductor como [`hls.js`](https://github.com/video-dev/hls.js)
   o [`vidstack`](https://vidstack.io) en el componente de reproducción.

## 7. Desplegar en Vercel

1. Sube este proyecto a un repositorio de GitHub:
   ```bash
   git init
   git add .
   git commit -m "LUMBRE: proyecto inicial"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/lumbre-app.git
   git push -u origin main
   ```
2. En https://vercel.com/new, importa el repositorio.
3. En **Environment Variables**, agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Dale **Deploy**. Cada push a `main` vuelve a desplegar automáticamente.

## 8. Próximos pasos sugeridos

- [ ] Login/registro con Supabase Auth (formulario + `supabase.auth.signInWithPassword`)
- [ ] Página de detalle de título (`/titulo/[slug]`)
- [ ] Reproductor de video con `hls.js`
- [ ] Guardar progreso en `watch_progress` cada X segundos
- [ ] Botón "Mi lista" conectado a la tabla `my_list`
- [ ] Suscripciones de pago con Stripe
