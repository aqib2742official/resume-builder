export const WRITING_TIPS: Record<string, { icon: string; tips: string[] }> = {
  personal: {
    icon: '👤',
    tips: [
      'Use a professional email (firstname.lastname@domain.com)',
      'Include LinkedIn URL — recruiters always check it',
      'Add GitHub if applying for tech or developer roles',
      'Your job title should match the role you\'re applying for',
    ],
  },
  summary: {
    icon: '✍️',
    tips: [
      'Start with your years of experience and primary expertise',
      'Mention 2–3 specific technologies or domain skills',
      'Quantify where possible: "3+ years building production APIs"',
      'Keep it to 3–4 sentences — recruiters spend 6 seconds on summaries',
      'Tailor this section for each job application',
    ],
  },
  experience: {
    icon: '💼',
    tips: [
      'Start each bullet with a strong action verb: Led, Built, Reduced, Improved…',
      'Quantify impact: "increased performance by 40%", "saved 10 hrs/week"',
      'Focus on outcomes, not just responsibilities',
      'List in reverse chronological order (most recent first)',
      'Aim for 3–5 bullet points per role',
    ],
  },
  education: {
    icon: '🎓',
    tips: [
      'For recent grads, put Education before Experience',
      'Include GPA only if it\'s 3.5 or higher',
      'Add relevant coursework, thesis, or honors',
      'Include graduation year — omitting it raises questions',
    ],
  },
  projects: {
    icon: '🚀',
    tips: [
      'Link to live demo or GitHub repo whenever possible',
      'List the tech stack clearly — this is scanned by ATS',
      'Describe the problem solved, not just what you built',
      'Include user numbers or metrics if available',
    ],
  },
  skills: {
    icon: '⚡',
    tips: [
      'Group skills into categories (Frontend, Backend, Tools)',
      'List skills that appear in the job description first',
      'Avoid vague skills like "communication" — use specific tech',
      'Only list skills you can confidently discuss in an interview',
      'Aim for 10–20 technical skills',
    ],
  },
  certifications: {
    icon: '🏆',
    tips: [
      'Include the credential ID or link for verification',
      'List in-progress certifications with expected date',
      'Industry certifications (AWS, Google, Azure) carry significant weight',
    ],
  },
  languages: {
    icon: '🌐',
    tips: [
      'Be honest about proficiency — you may be tested',
      'List the language of the job posting first',
      'Native/Fluent carry more weight than "beginner"',
    ],
  },
  awards: {
    icon: '⭐',
    tips: [
      'Include context: "Top 5% of 200 engineers at CompanyName"',
      'Hackathon wins and open-source contributions count',
      'Academic awards are relevant for recent graduates',
    ],
  },
  volunteer: {
    icon: '❤️',
    tips: [
      'Highlight leadership roles — organizing, coordinating, mentoring',
      'Quantify impact: "tutored 30+ students per semester"',
      'Relevant volunteer work can substitute for work experience',
      'Shows initiative, empathy, and community involvement to recruiters',
    ],
  },
  interests: {
    icon: '😊',
    tips: [
      'Include hobbies that show teamwork, creativity, or problem-solving',
      'Avoid clichés like "reading" and "travelling" unless specific',
      'Tech interests (open source, hackathons) reinforce your profile',
      'Keep it to 6–10 interests — quality over quantity',
    ],
  },
}
