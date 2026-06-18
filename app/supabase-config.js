/* ============================================================
   ENJOY THE GAME — configurazione Supabase
   ------------------------------------------------------------
   Per attivare l'archivio centrale (online), incolla qui i due
   valori che trovi nel tuo progetto Supabase:
     Dashboard → Project Settings → API
       • Project URL        → url
       • anon  public  key  → anonKey

   Finché questi due campi restano VUOTI, l'app funziona in
   "modalità demo" salvando i dati solo sul dispositivo (come prima).
   Appena li compili, le iscrizioni iniziano ad arrivare nel
   database condiviso e lo staff le vede da qualsiasi telefono.
   ============================================================ */
window.ETG_SUPABASE = {
  url: "https://lwzmpulabngzxxbglgui.supabase.co",      // es. "https://abcdxyz.supabase.co"
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3em1wdWxhYm5nenh4YmdsZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0Mzg2NDAsImV4cCI6MjA5NjAxNDY0MH0.x32Roy6H5JM12UsM_M84nP2nzMoFcmKNx29jfvY-Kmw"   // es. "eyJhbGciOi..."
};
