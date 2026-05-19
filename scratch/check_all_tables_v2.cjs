const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qlrxponkhpvfvepnxmzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFscnhwb25raHB2ZnZlcG54bXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NDUxODAsImV4cCI6MjA5NDIyMTE4MH0.JfeDVwqaeLmuAXdgGWMsYuAtCNZZEwAS91ozKXxpze0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProject() {
  const tablesToCheck = [
    "admin_audit_logs", "admin_sessions", "admin_users", "affiliate_sessions", "affiliate_stats", 
    "affiliates", "cashback_config", "cashier_sessions", "categories", "commission_distributions", 
    "commissions", "companies", "company_cashback_config", "company_cashiers", "company_categories", 
    "company_images", "company_purchases", "company_reviews", "company_sessions", "customer_coupons", 
    "marketing_materials", "network_structure", "order_items", "orders", "password_reset_tokens", 
    "product_categories", "product_images", "product_subcategories", "products", "system_settings", 
    "transactions", "user_profiles", "user_settings", "withdrawals", "courses", "course_modules", 
    "lessons", "lesson_materials", "videos_feed", "user_course_progress", "reports_moderation", 
    "user_notifications", "lesson_comments"
  ];

  console.log('Checking all tables in project qlrxponkhpvfvepnxmzo...');
  const results = { exists: [], missing: [], error: [] };

  for (const table of tablesToCheck) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      if (error.message.includes("Could not find the table") || error.code === '42P01') {
        results.missing.push(table);
      } else {
        // Some errors might be RLS related, but the table exists
        if (error.message.includes("permission denied") || error.message.includes("policy")) {
            results.exists.push(table + " (RLS Restricted)");
        } else {
            results.error.push(`${table}: ${error.message}`);
            // If it's a 404 from PostgREST it usually means table doesn't exist or isn't in schema cache
            if (error.status === 404) {
                results.missing.push(table);
            }
        }
      }
    } else {
      results.exists.push(table);
    }
  }

  console.log('\n--- EXISTS ---');
  console.log(results.exists.join(', '));
  console.log('\n--- MISSING ---');
  console.log(results.missing.join(', '));
  if (results.error.length > 0) {
    console.log('\n--- OTHER ERRORS ---');
    console.log(results.error.join('\n'));
  }
}

checkProject();
