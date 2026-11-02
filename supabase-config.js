// ===============================================
// NITR CAMPUSCARE — SELF-HOSTED CLIENT INITIALIZER
// ===============================================

// Supabase compatibility bridge to self-hosted Node.js + SQLite backend
var supabaseClient = (typeof window !== 'undefined' && (window.supabaseClient || (window.CampusCareAPI && window.CampusCareAPI.supabase)))
    ? (window.supabaseClient || (window.CampusCareAPI && window.CampusCareAPI.supabase))
    : null;

if (typeof window !== 'undefined') {
    if (!window.supabaseClient && window.CampusCareAPI) {
        window.supabaseClient = window.CampusCareAPI.supabase || supabaseClient;
    }
    supabaseClient = window.supabaseClient || supabaseClient;
}

