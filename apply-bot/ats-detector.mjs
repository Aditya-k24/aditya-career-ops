/**
 * Detect ATS type from URL.
 * Returns a string key used to load ATS-specific hints.
 */
export function detectATS(url) {
  if (url.includes('greenhouse.io')) return 'greenhouse';
  if (url.includes('myworkdayjobs.com') || /wd\d+\.myworkdayjobs/.test(url)) return 'workday';
  if (url.includes('lever.co')) return 'lever';
  if (url.includes('ashbyhq.com') || url.includes('jobs.ashbyhq.com')) return 'ashby';
  if (url.includes('ultipro.com') || url.includes('recruiting2.ultipro')) return 'ultipro';
  if (url.includes('icims.com')) return 'icims';
  if (url.includes('smartrecruiters.com')) return 'smartrecruiters';
  if (url.includes('taleo.net')) return 'taleo';
  return 'generic';
}
