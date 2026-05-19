const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Testing insert on videos_feed...');
  const { data, error } = await supabase.from('videos_feed').insert({
    video_url: 'https://exemplo.com/test.mp4',
    description: 'Test post',
    type: 'video',
    thumbnail_url: ''
  });
  if (error) {
    console.error('Insert error details:', error);
  } else {
    console.log('Insert success!', data);
  }
}

run();
