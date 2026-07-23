/* ============================================================
   ENJOY THE GAME — strato "cloud" (Supabase)
   ------------------------------------------------------------
   Mantiene invariato il resto dell'app: i componenti continuano a
   leggere ETG.Store.state in modo sincrono. Questo file:
     • se Supabase NON è configurato → non fa nulla (modalità demo locale)
     • se è configurato → spinge le iscrizioni nel database, e fornisce
       metodi async (findTeamByCodeAsync, joinTeamAsync, loadStaffAsync…)
       che i componenti usano. In demo, gli stessi metodi ricadono sulla
       logica locale, così l'interfaccia funziona in entrambi i casi.

   PRIVACY: i dati sensibili (minori, codici fiscali, firme) NON sono
   leggibili pubblicamente. Il pubblico può solo: inserire un'iscrizione,
   contare le squadre, cercare una squadra per codice e aggiungersi.
   La lista completa è protetta dal PIN dello staff (verificato lato server).
   ============================================================ */
(function(){
  var cfg = window.ETG_SUPABASE || {};
  var hasLib = !!(window.supabase && window.supabase.createClient);
  var enabled = !!(cfg.url && cfg.anonKey && hasLib);

  var Store = window.ETG && window.ETG.Store;
  if(!Store){ console.warn('[cloud] Store non pronto'); return; }

  var client = null;
  if(enabled){
    try { client = window.supabase.createClient(cfg.url, cfg.anonKey, {auth:{persistSession:false}}); }
    catch(e){ console.warn('[cloud] init fallita', e); enabled = false; }
  }

  /* ---- mappatura riga DB <-> oggetto app ---- */
  function fromRow(r){ return {
    id:r.id, type:r.type, createdAt:r.created_at, teamName:r.team_name,
    code:r.code, rosterSize:r.roster_size, captain:r.captain,
    players:r.players||[], formedByStaff:r.formed_by_staff
  };}
  function toRow(reg){ return {
    id:reg.id, type:reg.type, created_at:reg.createdAt||new Date().toISOString(),
    team_name:reg.teamName||null, code:reg.code||null, roster_size:reg.rosterSize||null,
    captain:reg.captain||null, players:reg.players||[], formed_by_staff:!!reg.formedByStaff
  };}

  /* ---- intercetta le scritture "create": ottimistica in locale + push su cloud ---- */
  var origCreateTeam = Store.createTeam.bind(Store);
  var origAddReg     = Store.addRegistration.bind(Store);

  Store.createTeam = function(opts){
    var reg = origCreateTeam(opts);
    if(reg && enabled){
      client.from('registrations').insert(toRow(reg)).then(function(res){
        if(res.error) console.warn('[cloud] createTeam', res.error.message);
      });
    }
    return reg;
  };
  Store.addRegistration = function(reg){
    var out = origAddReg(reg);
    if(out && enabled){
      client.from('registrations').insert(toRow(out)).then(function(res){
        if(res.error) console.warn('[cloud] addRegistration', res.error.message);
      });
    }
    return out;
  };

  /* ---- metodi async usati dai componenti (con fallback locale) ---- */

  // quante squadre iscritte (per il contatore X/16)
  Store.teamCountAsync = async function(){
    if(!enabled) return Store.teamCount();
    var r = await client.rpc('team_count');
    if(r.error){ console.warn('[cloud] team_count', r.error.message); return Store.teamCount(); }
    return r.data || 0;
  };

  // cerca squadra per codice — restituisce SOLO info minime (niente dati personali)
  Store.findTeamByCodeAsync = async function(code){
    if(!enabled){
      var r = Store.findTeamByCode(code);
      return r ? { id:r.id, teamName:r.teamName, rosterSize:r.rosterSize,
                   captainName:r.captain && r.captain.nome, playersCount:r.players.length } : null;
    }
    var res = await client.rpc('find_team_by_code', { p_code: code });
    if(res.error){ console.warn('[cloud] find_team_by_code', res.error.message); return null; }
    var row = res.data && res.data[0];
    return row ? { id:row.id, teamName:row.team_name, rosterSize:row.roster_size,
                   captainName:row.captain_name, playersCount:row.players_count } : null;
  };

  // un giocatore si aggiunge alla squadra tramite il codice
  Store.joinTeamAsync = async function(code, player){
    if(!enabled){
      var r = Store.findTeamByCode(code);
      if(!r) return { ok:false, reason:'notfound' };
      var res = Store.addPlayerToTeam(r.id, player);
      return res.ok
        ? { ok:true, teamName:r.teamName, rosterSize:r.rosterSize, playersCount:res.reg.players.length }
        : { ok:false, reason:res.reason };
    }
    var out = await client.rpc('join_team', { p_code: code, p_player: player });
    if(out.error){ console.warn('[cloud] join_team', out.error.message); return { ok:false, reason:'error' }; }
    var row = out.data && out.data[0];
    if(!row || !row.ok) return { ok:false, reason: row ? row.reason : 'error',
      teamName: row && row.team_name, rosterSize: row && row.roster_size, playersCount: row && row.players_count };
    return { ok:true, teamName:row.team_name, rosterSize:row.roster_size, playersCount:row.players_count };
  };

  // STAFF: carica tutte le iscrizioni (richiede il PIN, verificato lato server)
  Store.loadStaffAsync = async function(pin){
    if(!enabled) return { ok:true, local:true };
    var res = await client.rpc('staff_list', { p_pin: String(pin) });
    if(res.error){ console.warn('[cloud] staff_list', res.error.message); return { ok:false, error:res.error.message }; }
    Store.update(function(s){ s.registrations = (res.data || []).map(fromRow); });
    return { ok:true };
  };

  // STAFF: elimina una squadra/iscrizione
  Store.deleteRegistrationCloud = async function(pin, id){
    if(enabled){
      var res = await client.rpc('staff_delete', { p_pin:String(pin), p_id:id });
      if(res.error){ console.warn('[cloud] staff_delete', res.error.message); return { ok:false }; }
    }
    Store.deleteRegistration(id);
    return { ok:true };
  };

  // STAFF: corregge nome/cognome di un giocatore
  Store.renamePlayerCloud = async function(pin, regId, idx, nome, cognome){
    if(enabled){
      var res = await client.rpc('staff_rename_player', { p_pin:String(pin), p_id:regId, p_idx:idx, p_nome:nome, p_cognome:cognome });
      if(res.error){ console.warn('[cloud] staff_rename_player', res.error.message); return { ok:false }; }
    }
    return Store.renamePlayer(regId, idx, nome, cognome);
  };

  // STAFF: corregge il nome di una squadra
  Store.renameTeamCloud = async function(pin, regId, newName){
    if(enabled){
      var res = await client.rpc('staff_rename_team', { p_pin:String(pin), p_id:regId, p_name:newName });
      if(res.error){ console.warn('[cloud] staff_rename_team', res.error.message); return { ok:false }; }
    }
    return Store.renameTeam(regId, newName);
  };

  // STAFF: rimuove un singolo giocatore da una squadra (es. doppia iscrizione per errore)
  Store.removePlayerCloud = async function(pin, regId, idx){
    if(enabled){
      var res = await client.rpc('staff_remove_player', { p_pin:String(pin), p_id:regId, p_idx:idx });
      if(res.error){ console.warn('[cloud] staff_remove_player', res.error.message); return { ok:false }; }
    }
    return Store.removePlayerFromTeam(regId, idx);
  };

  // STAFF: forma una squadra dai singoli
  Store.formTeamCloud = async function(pin, teamName, soloIds, roster){
    var reg = Store.createTeamFromSolos(teamName, soloIds, roster); // ottimistico in locale
    if(reg && enabled){
      var payload = { id:reg.id, teamName:reg.teamName, code:reg.code, rosterSize:reg.rosterSize,
                      captain:reg.captain, players:reg.players, mergedSoloIds: soloIds };
      var res = await client.rpc('staff_form_team', { p_pin:String(pin), p_reg: payload });
      if(res.error) console.warn('[cloud] staff_form_team', res.error.message);
    }
    return { ok: !!reg, reg: reg };
  };

  // STAFF: verifica la password "organizzatori" del sorteggio (ri-sorteggio / annullamento).
  // Se la protezione non è configurata sul server, NON blocca (comportamento come prima).
  Store.verifyDrawPinAsync = async function(pin){
    if(!enabled) return { ok:true, demo:true };   // demo locale: nessun server da interrogare
    try{
      var r = await client.rpc('draw_pin_ok', { p_pin:String(pin||'') });
      if(r.error){ console.warn('[cloud] draw_pin_ok', r.error.message); return { ok:true, unconfigured:true }; }
      return { ok: r.data === true };
    }catch(e){ console.warn('[cloud] draw_pin_ok', e && e.message); return { ok:true, unconfigured:true }; }
  };

  /* ============================================================
     SINCRONIZZAZIONE TORNEO (calendario, risultati, tabellone, live)
     Lo staff (con PIN) SCRIVE; tutti gli altri LEGGONO in tempo reale.
     In demo (Supabase non configurato) tutto ricade sul locale.
     ============================================================ */

  // campi dello stato che rappresentano il "torneo" (le iscrizioni si sincronizzano a parte)
  function pickTournament(s){
    return { teams:s.teams||{}, matches:s.matches||[], schedule:s.schedule||{},
             d1win:s.d1win||{}, d2win:s.d2win||{}, d2groups:s.d2groups||{},
             drawnAt:s.drawnAt||null, live:s.live||null };
  }
  var applyingRemote = false;   // evita loop: quando applichiamo dati remoti non ripubblichiamo
  var syncStarted    = false;

  // applica lo stato ricevuto dal server (senza toccare le iscrizioni)
  function applyTournament(row){
    var t = (row && row.state) || {};
    applyingRemote = true;
    try{
      origUpdate(function(s){
        s.teams   = t.teams   || {};
        s.matches = t.matches || [];
        if(t.schedule) s.schedule = t.schedule;
        s.d1win   = t.d1win   || {};
        s.d2win   = t.d2win   || {};
        s.d2groups= t.d2groups|| {};
        s.drawnAt = t.drawnAt || undefined;
        s.live    = t.live    || null;
        s.published = !!(row && row.published);
      });
    } finally { applyingRemote = false; }
  }

  // PUSH: salva il torneo sul server (debounced). Solo staff autenticato.
  var pushTimer = null;
  function pushTournamentNow(){
    if(!enabled || !window.ETG.staffPin) return;
    var s = Store.state;
    client.rpc('tournament_save', {
      p_pin: String(window.ETG.staffPin),
      p_state: pickTournament(s),
      p_published: !!s.published
    }).then(function(res){ if(res.error) console.warn('[cloud] tournament_save', res.error.message); });
  }
  function pushTournament(){ if(!enabled || !window.ETG.staffPin) return;
    if(pushTimer) clearTimeout(pushTimer); pushTimer = setTimeout(pushTournamentNow, 400); }

  // LOAD: scarica il torneo dal server (versione staff se autenticato, altrimenti pubblica)
  Store.loadTournamentAsync = async function(){
    if(!enabled) return { ok:true, local:true };
    try{
      var res = window.ETG.staffPin
        ? await client.rpc('tournament_load_staff', { p_pin:String(window.ETG.staffPin) })
        : await client.rpc('tournament_get');
      if(res.error){ console.warn('[cloud] tournament load', res.error.message); return { ok:false }; }
      var row = Array.isArray(res.data) ? res.data[0] : res.data;
      if(row && row.state){ applyTournament(row); }
      else if(!window.ETG.staffPin){ // pubblico e niente riga pubblicata → nascondi
        applyingRemote = true; try{ origUpdate(function(s){ s.published = false; }); } finally { applyingRemote = false; }
      }
      return { ok:true };
    }catch(e){ console.warn('[cloud] tournament load', e && e.message); return { ok:false }; }
  };

  // avvia la sincronizzazione (load iniziale + realtime + polling di sicurezza)
  Store.startTournamentSync = function(){
    if(!enabled || syncStarted) return; syncStarted = true;
    Store.loadTournamentAsync();
    try{
      client.channel('etg-tournament')
        .on('postgres_changes', { event:'*', schema:'public', table:'tournament' }, function(){
          if(!window.ETG.staffPin) Store.loadTournamentAsync();   // lo staff è la fonte: non si auto-sovrascrive
        })
        .subscribe();
    }catch(e){ console.warn('[cloud] realtime non attivo', e && e.message); }
    // polling di sicurezza per il pubblico (se il realtime non è abilitato)
    setInterval(function(){ if(!window.ETG.staffPin) Store.loadTournamentAsync(); }, 15000);
  };

  // Aggancia il PUSH alle modifiche dello staff.
  // 1) metodi "torneo" che scrivono direttamente lo stato:
  ['drawGroups','clearDraw','generateDay2','generateBracket','moveMatch',
   'setMatchTimeOverride','setScheduleConfig','setPublished','setScore'].forEach(function(name){
    var orig = Store[name] ? Store[name].bind(Store) : null;
    if(!orig) return;
    Store[name] = function(){ var r = orig.apply(null, arguments); pushTournament(); return r; };
  });
  // 2) le modifiche "live"/risultati passano da Store.update (punteggi, time-out, fine partita):
  var origUpdate = Store.update.bind(Store);
  Store.update = function(fn){ origUpdate(fn); if(!applyingRemote) pushTournament(); };

  window.ETG.cloud = { enabled: enabled, client: client };
  if(enabled){
    console.info('[cloud] Supabase attivo — archivio centrale online.');
    // avvia la sincronizzazione del torneo appena il resto dell'app è pronto
    setTimeout(function(){ Store.startTournamentSync(); }, 0);
  } else {
    console.info('[cloud] modalità demo locale (Supabase non configurato).');
  }
})();
