// ===============================================
// NITR CAMPUSCARE — SELF-HOSTED CLIENT INITIALIZER
// ===============================================

// Supabase compatibility bridge to self-hosted Node.js + SQLite backend
var supabaseClient = (typeof window !== 'undefined' && window.supabaseClient)
    ? window.supabaseClient
    : null;

if (typeof window !== 'undefined') {
    if (!supabaseClient && window.CampusCareAPI) {
        supabaseClient = window.supabaseClient;
    }
    window.supabaseClient = supabaseClient;
}

