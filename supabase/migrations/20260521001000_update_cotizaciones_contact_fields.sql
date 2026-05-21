alter table public.cotizaciones
  add column if not exists nombre_persona text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'cotizaciones'
      and column_name = 'nombre_empresa'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'cotizaciones'
      and column_name = 'empresa'
  ) then
    alter table public.cotizaciones rename column nombre_empresa to empresa;
  end if;
end $$;

alter table public.cotizaciones
  add column if not exists empresa text;

update public.cotizaciones
set nombre_persona = coalesce(nombre_persona, empresa, 'Sin nombre')
where nombre_persona is null;

update public.cotizaciones
set empresa = 'Sin empresa'
where empresa is null;

alter table public.cotizaciones
  alter column nombre_persona set not null,
  alter column empresa set not null;

alter table public.cotizaciones
  drop column if exists lada_pais;
