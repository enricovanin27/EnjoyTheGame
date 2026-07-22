-- ============================================================
--  ENJOY THE GAME — sincronizzazione TORNEO su Supabase
--  (calendario dei gironi, orari, risultati, tabellone, live)
-- ------------------------------------------------------------
--  Da eseguire UNA VOLTA nel pannello Supabase:
--    Dashboard → SQL Editor → New query → incolla tutto → Run
--
--  Presuppone che esista già la tabella `app_config(key, value)`
--  con la riga key='staff_pin' (creata dal setup iniziale dello
--  staff). Il PIN viene verificato SEMPRE lato server, mai in chiaro
--  nel codice dell'app.
-- ============================================================

-- Una sola riga: tutto lo stato del torneo come JSON.
create table if not exists public.tournament (
  id         int primary key default 1,
  state      jsonb       not null default '{}'::jsonb,
  published  boolean     not null default false,
  updated_at timestamptz not null default now(),
  constraint tournament_singleton check (id = 1)
);

alter table public.tournament enable row level security;

-- Il PUBBLICO può LEGGERE la riga solo quando è pubblicata.
-- (Serve anche a filtrare gli aggiornamenti realtime per gli anonimi.)
drop policy if exists tournament_public_read on public.tournament;
create policy tournament_public_read on public.tournament
  for select to anon using (published = true);

-- Verifica del PIN staff leggendo app_config.
-- Tollera sia value di tipo text ("1234") sia jsonb ("\"1234\"").
create or replace function public._staff_pin_ok(p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v text;
begin
  select value::text into v from public.app_config where key = 'staff_pin';
  if v is null then
    return false;
  end if;
  v := btrim(v, '"');            -- rimuove eventuali virgolette del JSON
  return v = p_pin;
end
$$;

-- PUBBLICO: ottieni il torneo (solo se pubblicato).
create or replace function public.tournament_get()
returns table(state jsonb, published boolean, updated_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select t.state, t.published, t.updated_at
  from public.tournament t
  where t.id = 1 and t.published = true;
$$;

-- STAFF: ottieni il torneo SEMPRE, anche se non pubblicato (richiede PIN).
create or replace function public.tournament_load_staff(p_pin text)
returns table(state jsonb, published boolean, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._staff_pin_ok(p_pin) then
    raise exception 'unauthorized';
  end if;
  return query
    select t.state, t.published, t.updated_at
    from public.tournament t
    where t.id = 1;
end
$$;

-- STAFF: salva/aggiorna il torneo (richiede PIN).
create or replace function public.tournament_save(p_pin text, p_state jsonb, p_published boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._staff_pin_ok(p_pin) then
    raise exception 'unauthorized';
  end if;
  insert into public.tournament (id, state, published, updated_at)
  values (1, coalesce(p_state, '{}'::jsonb), coalesce(p_published, false), now())
  on conflict (id) do update
    set state      = excluded.state,
        published  = excluded.published,
        updated_at = now();
end
$$;

-- Permessi: il pubblico (anon) può SOLO chiamare queste funzioni.
-- Scrivere/leggere non pubblicato richiede comunque il PIN (verificato dentro).
grant execute on function public.tournament_get()                       to anon;
grant execute on function public.tournament_load_staff(text)            to anon;
grant execute on function public.tournament_save(text, jsonb, boolean)  to anon;

-- (Opzionale ma consigliato) aggiornamento LIVE senza ricaricare la pagina.
-- Se dà errore "already member", ignoralo: è già attivo.
do $$
begin
  begin
    alter publication supabase_realtime add table public.tournament;
  exception when others then
    raise notice 'realtime: %', sqlerrm;
  end;
end $$;
