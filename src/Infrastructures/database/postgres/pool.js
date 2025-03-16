/* istanbul ignore file */
const { Pool } = require("pg");

const testConfig = {
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
};

// Konfigurasi untuk Supabase
const supabaseConfig = {
  connectionString: process.env.DATABASE_URL, // Pastikan DATABASE_URL ada di .env
  ssl: { rejectUnauthorized: false }, // SSL false untuk Supabase
};

// Pilih konfigurasi berdasarkan environment
const pool =
  process.env.NODE_ENV === "test"
    ? new Pool(testConfig) // Gunakan konfigurasi test saat testing
    : new Pool(supabaseConfig); // Gunakan Supabase di mode normal

module.exports = pool;
