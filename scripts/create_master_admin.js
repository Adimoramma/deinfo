/*
Usage (PowerShell):

$env:SUPABASE_URL="https://xyz.supabase.co"; $env:SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"; node .\desinfo\scripts\create_master_admin.js --email admin@example.com --password 'Secret123!'

This script will:
 1) Create an auth user (sign up) using the service role key
 2) Insert a row into the `admins` table so the account is authorized

Note: The script requires the Supabase service role key (not the anon key). Keep it secret.
*/

const { createClient } = require('@supabase/supabase-js');
const argv = require('yargs/yargs')(process.argv.slice(2)).argv;

async function main() {
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    console.error('Set them and re-run. Example (PowerShell):');
      console.error("$env:SUPABASE_URL='https://xyz.supabase.co'; $env:SUPABASE_SERVICE_ROLE_KEY='<service-role-key>'; node ./desinfo/scripts/create_master_admin.js --email adimoram9@gmail.com --password '112233'");
    process.exit(1);
  }

    // default to the requested master admin credentials if not provided via flags
    const email = argv.email || 'ngwumichael0@gmail.com';
    const password = argv.password || '121212';
  const name = argv.name || 'Master Admin';

  if (!email || !password) {
    console.error('Please provide --email and --password arguments.');
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false }});

  try {
    // create user
    const { data: userData, error: signError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (signError) throw signError;

    console.log('Created user:', userData?.user?.id || userData);

    // insert into admins table
    const { data, error: insertError } = await supabase.from('admins').insert([{ name, email }]);
    if (insertError) throw insertError;

    console.log('Inserted admin row:', data);
    console.log('Master admin created successfully. You can now login at the frontend.');
  } catch (err) {
    console.error('Failed to create master admin:', err.message || err);
    process.exit(1);
  }
}

main();
