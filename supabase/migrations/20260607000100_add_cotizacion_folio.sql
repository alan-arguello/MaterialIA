create sequence if not exists public.cotizaciones_folio_seq;

alter table public.cotizaciones
  add column if not exists cotizacion_folio bigint;

with max_existing as (
  select coalesce(max(cotizacion_folio), 0) as value
  from public.cotizaciones
),
numbered as (
  select
    id,
    (select value from max_existing)
      + row_number() over (order by created_at, id) as next_folio
  from public.cotizaciones
  where cotizacion_folio is null
)
update public.cotizaciones as cotizacion
set cotizacion_folio = numbered.next_folio
from numbered
where cotizacion.id = numbered.id;

select setval(
  'public.cotizaciones_folio_seq',
  greatest(coalesce(max(cotizacion_folio), 1), 1),
  max(cotizacion_folio) is not null
)
from public.cotizaciones;

alter table public.cotizaciones
  alter column cotizacion_folio set default nextval('public.cotizaciones_folio_seq'),
  alter column cotizacion_folio set not null;

alter sequence public.cotizaciones_folio_seq
  owned by public.cotizaciones.cotizacion_folio;

create unique index if not exists cotizaciones_cotizacion_folio_key
  on public.cotizaciones (cotizacion_folio);
