const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching sample video...');
  const { data: before, error: err1 } = await supabase.from('videos_feed').select('*').limit(1);
  if (err1 || !before || before.length === 0) {
    console.error('Failed to fetch video:', err1?.message || 'No videos found');
    return;
  }
  
  const video = before[0];
  const initialLikes = video.likes_count || 0;
  console.log(`Video ID ${video.id} initial likes: ${initialLikes}`);

  console.log('Calling like_video...');
  const { error: errLike } = await supabase.rpc('like_video', { video_id: video.id });
  if (errLike) {
    console.error('Failed to like video:', errLike.message);
    return;
  }

  const { data: afterLike, error: err2 } = await supabase.from('videos_feed').select('likes_count').eq('id', video.id).single();
  console.log(`Video ID ${video.id} likes after like: ${afterLike?.likes_count} (expected ${initialLikes + 1})`);

  console.log('Calling unlike_video...');
  const { error: errUnlike } = await supabase.rpc('unlike_video', { video_id: video.id });
  if (errUnlike) {
    console.error('Failed to unlike video:', errUnlike.message);
    return;
  }

  const { data: afterUnlike, error: err3 } = await supabase.from('videos_feed').select('likes_count').eq('id', video.id).single();
  console.log(`Video ID ${video.id} likes after unlike: ${afterUnlike?.likes_count} (expected ${initialLikes})`);
}

run();
