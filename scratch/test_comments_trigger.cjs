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
  console.log('Login successful! Profile ID is 25.');

  console.log('Fetching sample video...');
  const { data: videos, error: err1 } = await supabase.from('videos_feed').select('*').limit(1);
  if (err1 || !videos || videos.length === 0) {
    console.error('Failed to fetch video:', err1?.message || 'No videos found');
    return;
  }
  
  const video = videos[0];
  const initialComments = video.comments_count || 0;
  console.log(`Video ID ${video.id} initial comments count: ${initialComments}`);

  console.log('Inserting test comment...');
  const { data: newComment, error: errComment } = await supabase
    .from('video_comments')
    .insert({
      video_id: video.id,
      user_id: 25,
      content: 'Comentário de teste com usuário logado!'
    })
    .select()
    .single();

  if (errComment) {
    console.error('Failed to insert comment:', errComment.message);
    return;
  }
  console.log('Inserted comment:', newComment);

  const { data: afterInsert, error: err2 } = await supabase.from('videos_feed').select('comments_count').eq('id', video.id).single();
  console.log(`Video ID ${video.id} comments count after insert: ${afterInsert?.comments_count} (expected ${initialComments + 1})`);

  console.log('Deleting test comment...');
  const { error: errDelete } = await supabase.from('video_comments').delete().eq('id', newComment.id);
  if (errDelete) {
    console.error('Failed to delete comment:', errDelete.message);
    return;
  }

  const { data: afterDelete, error: err3 } = await supabase.from('videos_feed').select('comments_count').eq('id', video.id).single();
  console.log(`Video ID ${video.id} comments count after delete: ${afterDelete?.comments_count} (expected ${initialComments})`);
}

run();
