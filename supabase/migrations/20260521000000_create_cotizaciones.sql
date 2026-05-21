create extension if not exists pgcrypto;

create table if not exists public.cotizaciones (
  id uuid primary key default gen_random_uuid(),
  nombre_persona text not null,
  empresa text not null,
  whatsapp text not null,
  email text not null,
  tipo_cliente text not null,
  necesidad text not null,
  urgencia text not null default 'Estoy cotizando para planear',
  detalles text not null,
  created_at timestamptz not null default now()
);

alter table public.cotizaciones enable row level security;

comment on table public.cotizaciones is
  'Solicitudes enviadas desde el formulario de cotización del sitio.';
