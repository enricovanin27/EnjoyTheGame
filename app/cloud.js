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

  window.ETG.cloud = { enabled: enabled, client: client };
  if(enabled) console.info('[cloud] Supabase attivo — archivio centrale online.');
  else console.info('[cloud] modalità demo locale (Supabase non configurato).');
})();
