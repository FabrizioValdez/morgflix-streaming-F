-- ============================================================
-- LUMBRE · Esquema inicial de base de datos para Supabase
-- Pega este archivo completo en Supabase Dashboard → SQL Editor → Run
-- ============================================================

/*
-- ---------- PERFILES ----------
-- Un perfil por usuario autenticado (se crea automáticamente vía trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Los perfiles son visibles para su dueño"
  on public.profiles for select
  using (auth.uid() = id);

create policy "El usuario puede actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Crea automáticamente un perfil cuando alguien se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- CATÁLOGO ----------
create table if not exists public.titles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  synopsis text,
  kind text not null check (kind in ('movie', 'series')),
  genre text,
  release_year int,
  poster_url text,
  backdrop_url text,
  video_url text,               -- URL del manifest HLS/DASH (Mux, Cloudflare Stream, Bunny, etc.)
  is_original boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  title_id uuid not null references public.titles (id) on delete cascade,
  season int not null default 1,
  episode int not null,
  name text not null,
  duration_seconds int,
  video_url text,
  created_at timestamptz not null default now(),
  unique (title_id, season, episode)
);

alter table public.titles enable row level security;
alter table public.episodes enable row level security;

create policy "El catálogo es público para lectura"
  on public.titles for select using (true);

create policy "Los episodios son públicos para lectura"
  on public.episodes for select using (true);

-- ---------- PROGRESO DE VISUALIZACIÓN ----------
create table if not exists public.watch_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  title_id uuid not null references public.titles (id) on delete cascade,
  episode_id uuid references public.episodes (id) on delete cascade,
  progress_seconds int not null default 0,
  duration_seconds int,
  updated_at timestamptz not null default now(),
  primary key (user_id, title_id)
);

alter table public.watch_progress enable row level security;

create policy "El usuario ve solo su propio progreso"
  on public.watch_progress for select using (auth.uid() = user_id);

create policy "El usuario inserta solo su propio progreso"
  on public.watch_progress for insert with check (auth.uid() = user_id);

create policy "El usuario actualiza solo su propio progreso"
  on public.watch_progress for update using (auth.uid() = user_id);

-- ---------- MI LISTA ----------
create table if not exists public.my_list (
  user_id uuid not null references auth.users (id) on delete cascade,
  title_id uuid not null references public.titles (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (user_id, title_id)
);

alter table public.my_list enable row level security;

create policy "El usuario ve solo su propia lista"
  on public.my_list for select using (auth.uid() = user_id);

create policy "El usuario agrega solo a su propia lista"
  on public.my_list for insert with check (auth.uid() = user_id);

create policy "El usuario elimina solo de su propia lista"
  on public.my_list for delete using (auth.uid() = user_id);

-- ---------- DATOS DE PRUEBA (opcional) ----------
insert into public.titles (slug, name, synopsis, kind, genre, release_year, is_original)
values
  ('ceniza-azul', 'Ceniza Azul', 'Tras un apagón, una técnica descubre una red subterránea que nadie debía encontrar.', 'series', 'Drama', 2026, true),
  ('nocturno-7', 'Nocturno 7', 'Un thriller psicológico ambientado en un tren nocturno sin paradas.', 'movie', 'Thriller', 2025, true),
  ('polvo-estelar', 'Polvo Estelar', 'Una tripulación minera descubre una señal que no debería existir.', 'movie', 'Ciencia ficción', 2025, false)
on conflict (slug) do nothing;
-- 

*/


-- ============================================================
-- MORGFLIX · BASE DE DATOS INICIAL
-- Solo autenticación y perfiles
-- ============================================================


-- ============================================================
-- PERFILES
-- ============================================================

-- Información adicional del usuario.
-- La contraseña NO se guarda aquí.
-- Supabase Auth se encarga de las credenciales.
create table if not exists public.profiles (
    id uuid primary key
        references auth.users(id)
        on delete cascade,

    display_name text,

    avatar_url text,

    created_at timestamptz not null default now()
);


-- ============================================================
-- SEGURIDAD
-- ============================================================

-- Activar Row Level Security
alter table public.profiles enable row level security;


-- El usuario solamente puede consultar su propio perfil
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);


-- El usuario solamente puede actualizar su propio perfil
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);


-- ============================================================
-- CREAR PERFIL AUTOMÁTICAMENTE
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

    insert into public.profiles (
        id,
        display_name
    )
    values (
        new.id,
        coalesce(
            new.raw_user_meta_data ->> 'name',
            split_part(new.email, '@', 1)
        )
    );

    return new;

end;
$$;


-- Eliminar trigger anterior si existe
drop trigger if exists on_auth_user_created
on auth.users;


-- Crear perfil automáticamente cuando se registra un usuario
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();