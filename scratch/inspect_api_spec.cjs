const https = require('https');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

function getSpec() {
  return new Promise((resolve, reject) => {
    const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`;
    https.get(url, {
      headers: {
        'apikey': supabaseKey,
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON: ' + data));
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const spec = await getSpec();
    console.log('Definitions (Tables):', Object.keys(spec.definitions || {}));
    const paths = Object.keys(spec.paths || {});
    console.log('RPC Paths:', paths.filter(p => p.startsWith('/rpc/')));
  } catch (err) {
    console.error('Error fetching spec:', err.message);
  }
}

run();
