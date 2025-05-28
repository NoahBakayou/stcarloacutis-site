require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function main() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  console.log("One week ago ISO string:", oneWeekAgo);

  console.log("Querying all intentions (no date filter)...");

  const { data, error } = await supabase
    .from('intentions')
    .select('*');

  if (error) {
    console.error("Supabase fetch error:", error);
    return;
  }

  console.log("Fetched intentions:", data);

  if (!data || data.length === 0) {
    console.log('No new intentions to send.');
    return;
  }

  const body = data.map(
    (i: any, idx: number) =>
      `${idx + 1}. Name: ${i.name || 'Anonymous'}\nEmail: ${i.email || 'N/A'}\nIntention: ${i.intention}\n`
  ).join('\n');

  console.log("Email body to be sent:\n", body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Weekly Prayer Intentions',
    text: body,
  });

  console.log('Intentions sent.');
}

main().catch(console.error);