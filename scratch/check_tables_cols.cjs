const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: lessonComment } = await supabase.from('lesson_comments').select('*').limit(1);
  console.log('lesson_comments columns:', lessonComment ? Object.keys(lessonComment[0] || {}) : 'no rows');
  
  const { data: videoComment } = await supabase.from('video_comments').select('*').limit(1);
  console.log('video_comments columns:', videoComment ? Object.keys(videoComment[0] || {}) : 'no rows');
}
run();
