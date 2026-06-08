create extension if not exists pgcrypto;

create table if not exists public.codigos_afiliado (
  id uuid primary key default gen_random_uuid(),
  codigo text not null,
  nombre_afiliado text not null,
  descuento_porcentaje numeric(5, 2) not null,
  created_at timestamptz not null default now(),
  constraint codigos_afiliado_codigo_format
    check (codigo ~ '^[A-Z0-9-]{3,32}$'),
  constraint codigos_afiliado_descuento_porcentaje_check
    check (descuento_porcentaje > 0 and descuento_porcentaje <= 50)
);

create unique index if not exists codigos_afiliado_codigo_key
  on public.codigos_afiliado (codigo);

alter table public.codigos_afiliado enable row level security;

comment on table public.codigos_afiliado is
  'Codigos de afiliado y descuento disponibles para el formulario de cotizacion.';

alter table public.cotizaciones
  add column if not exists codigo_afiliado_id uuid,
  add column if not exists codigo_afiliado text,
  add column if not exists nombre_afiliado text,
  add column if not exists descuento_porcentaje numeric(5, 2) not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cotizaciones_codigo_afiliado_id_fkey'
      and conrelid = 'public.cotizaciones'::regclass
  ) then
    alter table public.cotizaciones
      add constraint cotizaciones_codigo_afiliado_id_fkey
      foreign key (codigo_afiliado_id)
      references public.codigos_afiliado (id)
      on delete set null;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cotizaciones_descuento_porcentaje_check'
      and conrelid = 'public.cotizaciones'::regclass
  ) then
    alter table public.cotizaciones
      add constraint cotizaciones_descuento_porcentaje_check
      check (descuento_porcentaje >= 0 and descuento_porcentaje <= 50)
      not valid;

    alter table public.cotizaciones
      validate constraint cotizaciones_descuento_porcentaje_check;
  end if;
end $$;
