import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { buildFieldMap } from './profile-loader.mjs';

/**
 * Main form-filling agent.
 * Opens the URL, fills fields using Stagehand + Claude, pauses before submit.
 */
export async function fillForm({ url, ats, profile, answers, reportNum, rootDir }) {
  const fieldMap = buildFieldMap(profile, answers);
  const logDir = resolve(rootDir, 'apply-bot/logs');
  const screenshotDir = resolve(rootDir, 'apply-bot/screenshots');
  mkdirSync(logDir, { recursive: true });
  mkdirSync(screenshotDir, { recursive: true });

  const slug = reportNum ? `${reportNum}-${ats}` : `${Date.now()}-${ats}`;
  const log = { url, ats, filled: [], skipped: [], errors: [], timestamp: new Date().toISOString() };

  const stagehand = new Stagehand({
    env: 'LOCAL',
    modelName: 'claude-sonnet-4-6',
    modelClientOptions: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },
    headless: false, // always headed — you watch and review
    verbose: 1,
  });

  await stagehand.init();
  const page = stagehand.page;

  console.log('\nNavigating to application page...');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // ATS-specific entry: some ATSes need a click to reach the actual form
  if (ats === 'greenhouse') {
    await handleGreenhouseEntry(stagehand);
  } else if (ats === 'workday') {
    await handleWorkdayEntry(stagehand);
  }

  // Discover form fields
  console.log('\nDiscovering form fields...');
  let fields = [];
  try {
    const result = await stagehand.extract({
      instruction: 'List all visible form fields on this page. For each field include: label text, field type (text/select/checkbox/radio/file/textarea), and whether it is required.',
      schema: z.object({
        fields: z.array(z.object({
          label: z.string(),
          type: z.string(),
          required: z.boolean().optional(),
        }))
      })
    });
    fields = result.fields || [];
    console.log(`Found ${fields.length} fields.`);
  } catch (err) {
    console.warn('Field discovery failed, will fill by semantic intent:', err.message);
  }

  // Fill core identity fields always present
  await fillCoreFields(stagehand, fieldMap, log);

  // Fill discovered fields by matching labels to fieldMap
  for (const field of fields) {
    await fillDiscoveredField(stagehand, field, fieldMap, log);
  }

  // Handle file upload (resume PDF)
  await handleResumeUpload(stagehand, page, reportNum, rootDir, log);

  // Handle EEO / demographic questions
  await fillEEO(stagehand, fieldMap, log);

  // Screenshot pre-submit state
  const screenshotPath = resolve(screenshotDir, `${slug}-prefill.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`\nScreenshot saved: ${screenshotPath}`);

  // Save fill log
  const logPath = resolve(logDir, `${slug}.json`);
  writeFileSync(logPath, JSON.stringify(log, null, 2));
  console.log(`Fill log saved: ${logPath}`);

  // Summary
  console.log('\n--- Fill Summary ---');
  console.log(`Filled:  ${log.filled.length} fields`);
  console.log(`Skipped: ${log.skipped.length} fields`);
  console.log(`Errors:  ${log.errors.length} fields`);
  if (log.filled.length) console.log('\nFilled fields:\n' + log.filled.map(f => `  + ${f}`).join('\n'));
  if (log.skipped.length) console.log('\nSkipped:\n' + log.skipped.map(f => `  - ${f}`).join('\n'));
  if (log.errors.length) console.log('\nErrors:\n' + log.errors.map(f => `  ! ${f}`).join('\n'));

  console.log('\n=================================================');
  console.log('REVIEW THE FORM IN THE BROWSER WINDOW.');
  console.log('Fix anything that looks wrong, then click Submit.');
  console.log('Press Ctrl+C here when done.');
  console.log('=================================================\n');

  // Keep browser open indefinitely until user Ctrl+C
  await new Promise(() => {});
}

// --- Core fields always filled ---
async function fillCoreFields(stagehand, fieldMap, log) {
  const coreActions = [
    { desc: 'first name',  action: `Fill the first name field with "${fieldMap.first_name}"` },
    { desc: 'last name',   action: `Fill the last name field with "${fieldMap.last_name}"` },
    { desc: 'email',       action: `Fill the email field with "${fieldMap.email}"` },
    { desc: 'phone',       action: `Fill the phone number field with "${fieldMap.phone}"` },
    { desc: 'LinkedIn URL', action: `Fill the LinkedIn URL or profile field with "${fieldMap.linkedin}"` },
  ];

  if (fieldMap.github) {
    coreActions.push({ desc: 'GitHub URL', action: `Fill the GitHub URL field with "${fieldMap.github}" if it exists` });
  }
  if (fieldMap.portfolio) {
    coreActions.push({ desc: 'website/portfolio', action: `Fill the website or portfolio URL field with "${fieldMap.portfolio}" if it exists` });
  }

  for (const { desc, action } of coreActions) {
    try {
      await stagehand.act({ action });
      log.filled.push(desc);
    } catch (err) {
      log.skipped.push(`${desc} (${err.message.slice(0, 60)})`);
    }
  }
}

// --- Fill a field discovered by schema extraction ---
async function fillDiscoveredField(stagehand, field, fieldMap, log) {
  const label = field.label?.toLowerCase() || '';

  // Skip already-handled core fields
  const coreLabels = ['first name', 'last name', 'email', 'phone', 'linkedin', 'github', 'website', 'portfolio', 'resume', 'cv'];
  if (coreLabels.some(c => label.includes(c))) return;

  // Match label to fieldMap
  const value = matchLabelToValue(label, fieldMap);
  if (!value) {
    log.skipped.push(`${field.label} (no match in fieldMap)`);
    return;
  }

  try {
    if (field.type === 'select') {
      await stagehand.act({ action: `Select "${value}" from the "${field.label}" dropdown` });
    } else if (field.type === 'checkbox' || field.type === 'radio') {
      await stagehand.act({ action: `Select the option "${value}" for the "${field.label}" question` });
    } else {
      await stagehand.act({ action: `Fill the "${field.label}" field with: ${value}` });
    }
    log.filled.push(`${field.label}: ${String(value).slice(0, 80)}`);
  } catch (err) {
    log.errors.push(`${field.label}: ${err.message.slice(0, 80)}`);
  }
}

// --- Resume PDF upload ---
async function handleResumeUpload(stagehand, page, reportNum, rootDir, log) {
  // Find the most relevant PDF: report-specific first, then latest in output/
  const { readdirSync, existsSync, statSync } = await import('fs');
  const { resolve } = await import('path');

  const outputDir = resolve(rootDir, 'output');
  let pdfPath = null;

  if (reportNum) {
    const files = readdirSync(outputDir).filter(f => f.startsWith(`cv-`) && f.endsWith('.pdf') && f.includes(String(reportNum)));
    if (files.length) pdfPath = resolve(outputDir, files[0]);
  }

  if (!pdfPath) {
    // Fall back to most recent PDF
    const pdfs = readdirSync(outputDir)
      .filter(f => f.endsWith('.pdf'))
      .map(f => ({ name: f, mtime: statSync(resolve(outputDir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    if (pdfs.length) pdfPath = resolve(outputDir, pdfs[0].name);
  }

  if (!pdfPath || !existsSync(pdfPath)) {
    log.skipped.push('resume upload (no PDF found in output/)');
    return;
  }

  try {
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      await fileInput.setInputFiles(pdfPath);
      log.filled.push(`resume: ${pdfPath.split('/').pop()}`);
      console.log(`Resume uploaded: ${pdfPath.split('/').pop()}`);
    } else {
      log.skipped.push('resume upload (no file input found)');
    }
  } catch (err) {
    log.errors.push(`resume upload: ${err.message.slice(0, 80)}`);
  }
}

// --- EEO / demographic fields ---
async function fillEEO(stagehand, fieldMap, log) {
  const eeoActions = [
    { desc: 'gender',     action: `For the gender question, select "${fieldMap.gender}"` },
    { desc: 'ethnicity',  action: `For the race or ethnicity question, select "${fieldMap.ethnicity}"` },
    { desc: 'veteran',    action: `For the veteran status question, select "${fieldMap.veteran_status}"` },
    { desc: 'disability', action: `For the disability status question, select "${fieldMap.disability_status}"` },
  ];

  for (const { desc, action } of eeoActions) {
    try {
      await stagehand.act({ action });
      log.filled.push(`EEO: ${desc}`);
    } catch {
      log.skipped.push(`EEO: ${desc}`);
    }
  }
}

// --- ATS-specific entry handlers ---
async function handleGreenhouseEntry(stagehand) {
  try {
    await stagehand.act({ action: 'Click the "Apply" or "Apply for this job" button if present' });
    await stagehand.page.waitForTimeout(1500);
  } catch { /* already on form */ }
}

async function handleWorkdayEntry(stagehand) {
  try {
    await stagehand.act({ action: 'Click "Apply" or "Apply Manually" to start the application' });
    await stagehand.page.waitForTimeout(2000);
  } catch { /* already on form */ }
}

// --- Label-to-value matcher ---
function matchLabelToValue(label, fieldMap) {
  if (label.includes('salary') || label.includes('compensation') || label.includes('expected')) return fieldMap.salary_expectation;
  if (label.includes('sponsor') || label.includes('visa') || label.includes('work auth')) return fieldMap.sponsorship_required;
  if (label.includes('authorized') || label.includes('eligible to work')) return fieldMap.authorized_us;
  if (label.includes('city')) return fieldMap.city;
  if (label.includes('state')) return fieldMap.state;
  if (label.includes('country')) return fieldMap.country;
  if (label.includes('zip') || label.includes('postal')) return fieldMap.zip;
  if (label.includes('hear') || label.includes('source') || label.includes('referral')) return fieldMap.referral_source;

  // Custom answers from answers file
  for (const [key, val] of Object.entries(fieldMap)) {
    if (label.includes(key.replace(/_/g, ' '))) return val;
  }
  return null;
}
