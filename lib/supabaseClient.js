// lib/supabaseClient.js
// Supabase integration service with graceful local offline adapter for Luxignia CRM

let supabase = null;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('your-project'));
};

export const getSupabaseClient = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabase) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn('Supabase SDK not loaded, operating in local luxury offline mode');
    }
  }
  return supabase;
};

// Unified Data Access Layer (DAL)
export const crmService = {
  isLive: isSupabaseConfigured(),

  async fetchRecords(table, fallbackData = []) {
    const client = await getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from(table).select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn(`Error querying Supabase table ${table}, falling back to local state`, e);
      }
    }

    // Try localStorage cache
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`lux_crm_${table}`);
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }

    return fallbackData;
  },

  async saveRecord(table, record, allRecords = []) {
    const client = await getSupabaseClient();
    if (client) {
      try {
        await client.from(table).upsert(record);
      } catch (e) {
        console.warn(`Supabase upsert failed for ${table}:`, e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const updated = [record, ...allRecords.filter((r) => r.id !== record.id)];
        localStorage.setItem(`lux_crm_${table}`, JSON.stringify(updated));
      } catch (e) {}
    }
    return record;
  },

  async updateRecord(table, id, updates, allRecords = []) {
    const client = await getSupabaseClient();
    if (client) {
      try {
        await client.from(table).update(updates).eq('id', id);
      } catch (e) {
        console.warn(`Supabase update failed for ${table}:`, e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const updated = allRecords.map((r) => (r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r));
        localStorage.setItem(`lux_crm_${table}`, JSON.stringify(updated));
        return updated;
      } catch (e) {}
    }
    return allRecords;
  },

  async deleteRecord(table, id, allRecords = []) {
    const client = await getSupabaseClient();
    if (client) {
      try {
        await client.from(table).delete().eq('id', id);
      } catch (e) {
        console.warn(`Supabase delete failed for ${table}:`, e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const updated = allRecords.filter((r) => r.id !== id);
        localStorage.setItem(`lux_crm_${table}`, JSON.stringify(updated));
        return updated;
      } catch (e) {}
    }
    return allRecords;
  }
};
