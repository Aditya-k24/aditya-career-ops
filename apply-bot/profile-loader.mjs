import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { load } from 'js-yaml';

/**
 * Load candidate profile from config/profile.yml.
 * Returns a flat object with all candidate data.
 */
export function loadProfile(rootDir) {
  const profilePath = resolve(rootDir, 'config/profile.yml');
  if (!existsSync(profilePath)) {
    throw new Error(`config/profile.yml not found at ${profilePath}`);
  }
  return load(readFileSync(profilePath, 'utf8'));
}

/**
 * Build a flat field map from profile for form filling.
 * Keys match common ATS field names.
 */
export function buildFieldMap(profile, answers = {}) {
  const c = profile.candidate;
  const comp = profile.compensation || {};

  const base = {
    // Identity
    first_name: c.full_name?.split(' ')[0] || '',
    last_name: c.full_name?.split(' ').slice(1).join(' ') || '',
    full_name: c.full_name || '',
    email: c.email || '',
    phone: c.phone || '',
    linkedin: `https://${c.linkedin}` || '',
    github: `https://${c.github}` || '',
    portfolio: c.portfolio_url || '',
    website: c.portfolio_url || '',

    // Location
    city: 'Raleigh',
    state: 'NC',
    country: 'United States',
    zip: '',

    // Work auth
    authorized_us: 'yes',
    visa_sponsorship: 'yes',
    sponsorship_required: 'yes',
    work_authorization: 'F-1 OPT',

    // Compensation
    salary_expectation: comp.target_range || '$100,000 - $140,000',

    // Common dropdowns
    gender: 'Prefer not to say',
    ethnicity: 'Prefer not to say',
    veteran_status: 'I am not a veteran',
    disability_status: 'I do not have a disability',

    // How did you hear
    referral_source: 'LinkedIn',
  };

  // Merge pre-drafted answers (these win over base defaults)
  return { ...base, ...answers };
}
