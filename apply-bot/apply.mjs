#!/usr/bin/env node
/**
 * apply-bot: fills job application forms using Stagehand + Claude.
 * You review the filled form and click Submit yourself.
 *
 * Usage:
 *   node apply-bot/apply.mjs --url <job-url> [--report 178] [--answers apply-bot/answers/178-guidewire.yml]
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadProfile } from './profile-loader.mjs';
import { detectATS } from './ats-detector.mjs';
import { fillForm } from './fill-form.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      args[argv[i].slice(2)] = argv[i + 1];
      i++;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.url) {
    console.error('Usage: node apply-bot/apply.mjs --url <job-url> [--report 178] [--answers path/to/answers.yml]');
    process.exit(1);
  }

  const url = args.url;
  const ats = detectATS(url);
  console.log(`\nURL:  ${url}`);
  console.log(`ATS:  ${ats}`);

  // Load profile
  const profile = loadProfile(ROOT);
  console.log(`Profile loaded: ${profile.candidate.full_name} <${profile.candidate.email}>`);

  // Load pre-drafted answers if provided or auto-detect from report number
  let answers = {};
  let answersPath = args.answers;

  if (!answersPath && args.report) {
    const candidate = resolve(ROOT, `apply-bot/answers/${args.report}-answers.yml`);
    if (existsSync(candidate)) answersPath = candidate;
  }

  if (answersPath && existsSync(answersPath)) {
    const { load } = await import('js-yaml');
    answers = load(readFileSync(answersPath, 'utf8')) || {};
    console.log(`Answers loaded from: ${answersPath}`);
  } else {
    console.log('No answers file found — will infer from profile only.');
  }

  // Run the filler
  await fillForm({ url, ats, profile, answers, reportNum: args.report, rootDir: ROOT });
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
