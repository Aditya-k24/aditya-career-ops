// Message templates per persona type
// All templates use plain text, no em-dashes, short sentences (per form answer rules)

export const SENDER = {
  name: 'Aditya Kulkarni',
  linkedin: 'https://linkedin.com/in/aditya-kulkarni-355b81217',
  portfolio: 'https://kulkarniaditya.com',
  github: 'https://github.com/Aditya-k24',
};

const sig = () =>
  `${SENDER.name}\n${SENDER.portfolio} | ${SENDER.linkedin} | ${SENDER.github}`;

// Detect persona from job title string
export function detectPersona(position = '') {
  const p = position.toLowerCase();
  if (p.includes('recruit') || p.includes('talent') || p.includes('hr') || p.includes('people ops'))
    return 'recruiter';
  if (p.includes('vp') || p.includes('director') || p.includes('head of') || p.includes('manager') || p.includes('lead') || p.includes('principal'))
    return 'hiring_manager';
  return 'engineer';
}

// Check if person is likely an NCSU or Mumbai Univ alumni (best effort via name/position)
export function isAlumni(person) {
  const text = `${person.position || ''} ${person.linkedin || ''}`.toLowerCase();
  return text.includes('nc state') || text.includes('ncsu') || text.includes('wolfpack') ||
    text.includes('north carolina state') || text.includes('mumbai university') ||
    text.includes('university of mumbai');
}

export function emailSubject(persona, company, role) {
  switch (persona) {
    case 'recruiter':
      return `MS CS New Grad (May 2026) -- Applied to ${role} at ${company}`;
    case 'hiring_manager':
      return `${role} Application -- MS CS New Grad, May 2026`;
    case 'alumni':
      return `Fellow NC State Grad -- Applied to ${role} at ${company}`;
    default:
      return `Quick question about engineering at ${company}`;
  }
}

export function emailBody(persona, person, company, role) {
  const first = person.first_name || person.name?.split(' ')[0] || 'there';

  switch (persona) {
    case 'recruiter':
      return `Hi ${first},

I just applied to the ${role} position at ${company} and wanted to reach out directly. I am finishing my MS in Computer Science at NC State in May 2026. I have production experience shipping TypeScript and Python backend features at an AI startup -- 923 commits across 7 deployments.

Would love to chat if there is a fit. Happy to answer any questions.

${sig()}`;

    case 'hiring_manager':
      return `Hi ${first},

I applied for the ${role} position and wanted to reach out directly. I am finishing my MS CS at NC State in May 2026. I have shipped 10+ features end-to-end at an AI startup (TypeScript, Python, PostgreSQL, Redis) and built CortexQ, a Kubernetes-native LLM inference platform with a Kopf CRD operator and KEDA autoscaling.

I am excited about ${company}'s work and would love to connect if my background could be a fit.

${sig()}`;

    case 'alumni':
      return `Hi ${first},

Fellow Pack! I saw you are at ${company} and I just applied for the ${role} role. I am finishing my MS CS at NC State in May 2026 -- would love to hear your experience there from another Wolfpack perspective.

Any advice or insight would be hugely appreciated. No pressure if you are swamped.

Go Pack!
${sig()}`;

    default: // engineer
      return `Hi ${first},

I recently applied for the ${role} role at ${company} and am trying to learn more about the engineering culture. I am a May 2026 MS CS grad from NC State -- I have been building distributed backend systems in TypeScript and Python at production scale.

Would you be open to a 15-minute chat about what it is like to work on your team? No pressure at all.

${sig()}`;
  }
}

// LinkedIn connection note (300 char limit)
export function linkedinNote(persona, person, company, role) {
  const first = person.first_name || 'there';
  switch (persona) {
    case 'recruiter':
      return `Hi ${first}, I applied to the ${role} role at ${company}. MS CS at NC State, May 2026 grad. Would love to connect!`;
    case 'hiring_manager':
      return `Hi ${first}, I applied to ${role} at ${company}. May 2026 MS CS grad with production TypeScript/Python backend experience. Would love to connect.`;
    case 'alumni':
      return `Hi ${first}, Fellow Pack! I applied to ${role} at ${company} and graduating MS CS from NC State in May 2026. Would love to connect with another Wolfpack alum!`;
    default:
      return `Hi ${first}, I applied to the ${role} role at ${company}. May 2026 MS CS grad at NC State. Would love to learn more about your team!`;
  }
}
