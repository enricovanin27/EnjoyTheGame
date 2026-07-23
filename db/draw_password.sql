-- ============================================================
--  ENJOY THE GAME — password "organizzatori" per il SORTEGGIO
-- ------------------------------------------------------------
--  Aggiunge una password DEDICATA (diversa dal PIN dello staff) richiesta per
--  RI-SORTEGGIARE o ANNULLARE il sorteggio dei gironi. Così i normali membri
--  dello staff possono gestire punteggi e orari, ma non possono cancellare per
--  sbaglio il torneo.
--
--  Da eseguire UNA VOLTA nel pannello Supabase (SQL Editor → New query → Run).
--  Presuppone la tabella `app_config(key, value)` già usata per il PIN staff.
-- ============================================================

-- Verifica la password del sorteggio.
--  • Se NON è stata impostata (nessuna riga 'draw_pin') → ritorna TRUE:
--    nessuna protezione attiva (comportamento come prima).
--  • Appena imposti la password (vedi sotto) → richiede quella password.
create or replace function public.draw_pin_ok(p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v text;
begin
  select value::text into v from public.app_config where key = 'draw_pin';
  if v is null then
    return true;               -- password non impostata → nessuna protezione
  end if;
  v := btrim(v, '"');          -- tollera testo o jsonb ("1234")
  return v = p_pin;
end
$$;

grant execute on function public.draw_pin_ok(text) to anon;

-- ------------------------------------------------------------
--  IMPOSTARE / CAMBIARE la password del sorteggio
-- ------------------------------------------------------------
--  Modo consigliato (a prova di tipo): Supabase → Table Editor → tabella
--  `app_config` → Insert row → key = draw_pin , value = LA-TUA-PASSWORD.
--
--  In alternativa via SQL, togli il commento a UNA delle due righe qui sotto
--  a seconda del tipo della colonna `value` (testo oppure jsonb) e metti la
--  tua password al posto di CAMBIA-QUESTA:
--
--  -- se `value` è di tipo text:
--  -- insert into public.app_config(key, value) values ('draw_pin', 'CAMBIA-QUESTA')
--  --   on conflict (key) do update set value = excluded.value;
--
--  -- se `value` è di tipo jsonb:
--  -- insert into public.app_config(key, value) values ('draw_pin', to_jsonb('CAMBIA-QUESTA'::text))
--  --   on conflict (key) do update set value = excluded.value;
--
--  Per DISATTIVARE la protezione: elimina la riga 'draw_pin' da app_config.
