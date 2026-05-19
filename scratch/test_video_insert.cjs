const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Logging in as superadmin2@orgino.group...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'superadmin2@orgino.group',
    password: 'Admin123456!'
  });

  if (authError) {
    console.error('Failed to log in:', authError.message);
    return;
  }

  console.log('Successfully logged in! Profile ID is 25.');

  console.log('\nTest 1: Insert video with user_id = 25 (profile.id)...');
  const test1 = await supabase
    .from('videos_feed')
    .insert({
      video_url: 'https://exemplo.com/video.mp4',
      description: 'Teste 1',
      type: 'video',
      thumbnail_url: '',
      user_id: 25
    });
  console.log('Test 1 result error:', test1.error);

  console.log('\nTest 2: Insert video without user_id...');
  const test2 = await supabase
    .from('videos_feed')
    .insert({
      video_url: 'https://exemplo.com/video.mp4',
      description: 'Teste 2',
      type: 'video',
      thumbnail_url: ''
    });
  console.log('Test 2 result error:', test2.error);

  console.log('\nTest 3: Insert video with user_id = null...');
  const test3 = await supabase
    .from('videos_feed')
    .insert({
      video_url: 'https://exemplo.com/video.mp4',
      description: 'Teste 3',
      type: 'video',
      thumbnail_url: '',
      user_id: null
    });
  console.log('Test 3 result error:', test3.error);
}

run();
