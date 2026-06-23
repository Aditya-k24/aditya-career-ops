#!/usr/bin/env node
/**
 * outreach.mjs — Job search networking tool
 *
 * Discovers contacts at a target company via Hunter.io, generates personalized
 * email + LinkedIn messages per persona, and sends emails via Gmail SMTP.
 *
 * Usage:
 *   node outreach/outreach.mjs --company "Instabase" --domain "instabase.com" --role "Full-stack SWE New Grad"
 *   node outreach/outreach.mjs --company "Instabase" --domain "instabase.com" --role "Full-stack SWE New Grad" --send
 *   node outreach/outreach.mjs --company "Instabase" --domain "instabase.com" --role "Full-stack SWE New Grad" --send --limit 10
 *
 * Required env vars (.env):
 *   HUNTER_API_KEY       — Hunter.io API key (free tier: 25 searches/mo)
 *   GMAIL_USER           — your Gmail address
 *   GMAIL_APP_PASSWORD   — 16-char Gmail App Password (not your login password)
 *
 * Dry-run by default. Use --send to actually send emails.
 * Rate limit: 1 email per 90 seconds to avoid spam flags.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {
  detectPersona,
  isAlumni,
  emailSubject,
  emailBody,
  linkedinNote,
  SENDER,
} from './templates.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
dotenv.config({ path: join(ROOT, '.env') });

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const hasFlag = (flag) => args.includes(flag);

const company = getArg('--company');
const domain  = getArg('--domain');
const role    = getArg('--role');
const limit   = parseInt(getArg('--limit') || '15', 10);
const send    = hasFlag('--send');

if (!company || !domain || !role) {
  console.error([
    '',
    'Usage: node outreach/outreach.mjs \\',
    '  --company "Instabase" \\',
    '  --domain "instabase.com" \\',
    '  --role "Full-stack SWE New Grad" \\',
    '  [--send] [--limit 10]',
    '',
    'Dry-run by default. Add --send to actually send emails.',
  ].join('\n'));
  process.exit(1);
}

// ── Env checks ────────────────────────────────────────────────────────────────
const HUNTER_KEY  = process.env.HUNTER_API_KEY;
const GMAIL_USER  = process.env.GMAIL_USER;
const GMAIL_PASS  = process.env.GMAIL_APP_PASSWORD;

if (!HUNTER_KEY) {
  console.error('Missing HUNTER_API_KEY in .env — get a free key at hunter.io');
  process.exit(1);
}
if (send && (!GMAIL_USER || !GMAIL_PASS)) {
  console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env — needed for --send mode');
  process.exit(1);
}

// ── Sent log (tracks who was already contacted) ───────────────────────────────
const LOG_PATH = join(__dirname, 'sent-log.json');
const sentLog  = existsSync(LOG_PATH) ? JSON.parse(readFileSync(LOG_PATH, 'utf8')) : {};

function alreadySent(email) {
  return !!sentLog[email];
}

function markSent(email, data) {
  sentLog[email] = { ...data, sentAt: new Date().toISOString() };
  writeFileSync(LOG_PATH, JSON.stringify(sentLog, null, 2));
}

// ── Hunter.io contact discovery ───────────────────────────────────────────────
async function discoverContacts(domain, limit) {
  const url = `https://api.hunter.io/v2/domain-search?domain=${domain}&limit=${limit}&api_key=${HUNTER_KEY}`;
  console.log(`\nQuerying Hunter.io for contacts at ${domain}...`);
  const res  = await fetch(url);
  const json = await res.json();

  if (!res.ok || json.errors) {
    console.error('Hunter.io error:', JSON.stringify(json.errors || json));
    process.exit(1);
  }

  const contacts = (json.data?.emails || []).filter(
    (e) => e.value && e.confidence >= 70
  );
  console.log(`Found ${contacts.length} contacts (confidence >= 70%)\n`);
  return contacts;
}

// ── Gmail SMTP sender ─────────────────────────────────────────────────────────
function createTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });
}

async function sendEmail(transport, to, subject, body) {
  return transport.sendMail({
    from: `"${SENDER.name}" <${GMAIL_USER}>`,
    to,
    subject,
    text: body,
  });
}

// ── Rate limiter ──────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const RATE_MS = 90_000; // 90 seconds between emails

// ── LinkedIn messages output ──────────────────────────────────────────────────
const linkedinLines = [
  `# LinkedIn Outreach Messages — ${company} (${new Date().toISOString().split('T')[0]})`,
  `Role: ${role}`,
  `Copy-paste these into LinkedIn connection requests or InMail.\n`,
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const contacts  = await discoverContacts(domain, limit);
  const transport = send ? createTransport() : null;

  let emailsSent = 0;
  let skipped    = 0;

  console.log(`Mode: ${send ? 'SEND (live)' : 'DRY RUN (no emails sent)'}`);
  console.log('─'.repeat(60));

  for (const person of contacts) {
    const email    = person.value;
    const name     = `${person.first_name || ''} ${person.last_name || ''}`.trim() || email;
    const position = person.position || 'Unknown role';

    if (alreadySent(email)) {
      console.log(`⏭  SKIP (already contacted): ${name} <${email}>`);
      skipped++;
      continue;
    }

    const persona  = isAlumni(person) ? 'alumni' : detectPersona(position);
    const subject  = emailSubject(persona, company, role);
    const body     = emailBody(persona, person, company, role);
    const liNote   = linkedinNote(persona, person, company, role);

    console.log(`\n👤 ${name} — ${position}`);
    console.log(`   Email:    ${email}`);
    console.log(`   Persona:  ${persona}`);
    console.log(`   Subject:  ${subject}`);
    if (person.linkedin) console.log(`   LinkedIn: ${person.linkedin}`);

    // Collect LinkedIn message
    linkedinLines.push(
      `---`,
      `## ${name} (${position})`,
      `LinkedIn: ${person.linkedin || 'not found'}`,
      `**Connection note (300 chars):**`,
      liNote,
      '',
    );

    if (send) {
      try {
        await sendEmail(transport, email, subject, body);
        markSent(email, { name, position, company, role, persona });
        emailsSent++;
        console.log(`   ✅ Email sent`);

        if (emailsSent < contacts.length) {
          console.log(`   ⏳ Waiting ${RATE_MS / 1000}s before next email...`);
          await sleep(RATE_MS);
        }
      } catch (err) {
        console.error(`   ❌ Send failed: ${err.message}`);
      }
    } else {
      console.log('   [DRY RUN] Would send email:');
      console.log('   ' + body.split('\n').slice(0, 4).join('\n   ') + '\n   ...');
    }
  }

  // Write LinkedIn messages file
  const linkedinOut = join(__dirname, `linkedin-${company.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.md`);
  writeFileSync(linkedinOut, linkedinLines.join('\n'));

  console.log('\n' + '─'.repeat(60));
  console.log(`\nDone.`);
  console.log(`  Contacts found:     ${contacts.length}`);
  console.log(`  Already contacted:  ${skipped}`);
  console.log(`  Emails ${send ? 'sent' : 'would send'}: ${send ? emailsSent : contacts.length - skipped}`);
  console.log(`  LinkedIn messages:  ${linkedinOut}`);

  if (!send) {
    console.log('\nAdd --send to actually send emails.');
  }
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
