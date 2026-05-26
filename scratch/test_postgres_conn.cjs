const postgres = require('postgres');

const connectionString = 'postgresql://postgres.qlrxponkhpvfvepnxmzo:Admin123456!@aws-1-sa-east-1.pooler.supabase.com:5432/postgres';

async function run() {
  console.log('Testing direct Postgres connection with password Admin123456!...');
  const sql = postgres(connectionString);
  try {
    const result = await sql`SELECT version();`;
    console.log('Success! Postgres version:', result);
  } catch (err) {
    console.error('Failed to connect:', err.message);
  } finally {
    await sql.end();
  }
}

run();
