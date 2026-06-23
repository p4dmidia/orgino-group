const postgres = require('postgres');
const connectionString = 'postgresql://postgres.qlrxponkhpvfvepnxmzo:Admin123456!@aws-1-sa-east-1.pooler.supabase.com:5432/postgres';

async function run() {
  const sql = postgres(connectionString);
  try {
    const result = await sql`
      SELECT proname, prosrc 
      FROM pg_proc 
      JOIN pg_namespace n ON n.oid = pronamespace 
      WHERE proname LIKE '%checkout%' AND n.nspname = 'public';
    `;
    console.log('Result count:', result.length);
    for (const row of result) {
      console.log('--- FUNCTION:', row.proname, '---');
      console.log(row.prosrc);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sql.end();
  }
}

run();
