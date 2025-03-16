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
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // SSL harus false untuk Supabase
};

const pool =
  process.env.NODE_ENV === "test"
    ? new Pool(testConfig)
    : new Pool(supabaseConfig);

module.exports = pool;
