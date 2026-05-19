const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProject() {
  const oldTables = [
    "user_profiles", "affiliates", "companies", "company_cashiers", "customer_coupons", 
    "company_purchases", "commission_distributions", "withdrawals", "user_settings", 
    "network_structure", "company_cashback_config", "company_sessions", "cashier_sessions", 
    "affiliate_sessions", "admin_users", "admin_sessions", "admin_audit_logs", 
    "system_settings", "cashback_config", "password_reset_tokens", "categories", 
    "company_categories", "company_images", "company_reviews", "affiliate_stats", 
    "product_categories", "products", "product_images", "orders", "order_items", 
    "commissions", "marketing_materials", "product_subcategories", "transactions", 
    "courses", "lessons", "videos_feed", "user_course_progress", "course_modules", 
    "reports_moderation", "user_notifications", "lesson_comments", "lesson_materials"
  ];

  console.log('Comparing projects...');
  const results = { exists: [], missing: [] };

  for (const table of oldTables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error && error.message.includes("Could not find the table")) {
      results.missing.push(table);
    } else {
      results.exists.push(table);
    }
  }

  console.log('EXISTS:', results.exists.join(', '));
  console.log('MISSING:', results.missing.join(', '));
}

checkProject();
