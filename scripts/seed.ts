/**
 * Seed script — creates Super Admin (with full records) and one Admin account.
 * Run: npx tsx --env-file=.env.local scripts/seed.ts
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set. Add it to .env.local')
  process.exit(1)
}

// ── Inline schemas ─────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  fullName: String,
  email:    { type: String, unique: true, lowercase: true },
  phone:    String,
  gender:   String,
  avatar:   { type: String, default: '' },
  password: String,
  role:     { type: String, default: 'user' },
}, { timestamps: true })

const ResumeSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:              String,
  template:          { type: String, default: 'two-column' },
  data:              mongoose.Schema.Types.Mixed,
  theme:             mongoose.Schema.Types.Mixed,
  versions:          { type: Array, default: [] },
  completenessScore: { type: Number, default: 0 },
}, { timestamps: true })

const CoverLetterSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null },
  name:          { type: String, default: 'Cover Letter' },
  recipientName: { type: String, default: '' },
  companyName:   { type: String, default: '' },
  jobTitle:      { type: String, default: '' },
  body:          { type: String, default: '' },
}, { timestamps: true })

const JobNoteSchema = new mongoose.Schema({
  id:        { type: String, required: true },
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: false })

const JobSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company:       { type: String, default: '' },
  role:          { type: String, default: '' },
  location:      { type: String, default: '' },
  appliedDate:   { type: String, default: '' },
  status:        { type: String, enum: ['wishlist', 'applied', 'phone-screen', 'interview', 'offer', 'rejected'], default: 'wishlist' },
  resumeId:      { type: String, default: null },
  coverLetterId: { type: String, default: null },
  notes:         { type: String, default: '' },
  notesHistory:  { type: [JobNoteSchema], default: [] },
  url:           { type: String, default: '' },
  deadline:      { type: String, default: null },
  interviewDate: { type: String, default: null },
  interviewType: { type: String, enum: ['phone', 'video', 'onsite', ''], default: '' },
}, { timestamps: true })

const User        = mongoose.models.User        ?? mongoose.model('User',        UserSchema)
const Resume      = mongoose.models.Resume      ?? mongoose.model('Resume',      ResumeSchema)
const CoverLetter = mongoose.models.CoverLetter ?? mongoose.model('CoverLetter', CoverLetterSchema)
const Job         = mongoose.models.Job         ?? mongoose.model('Job',         JobSchema)

// ── Super Admin resume data (Aqib Ali — real profile) ─────────────────────────

const superAdminResumeData = {
  personal: {
    fullName:  'Aqib Ali',
    jobTitle:  'ReactJS | Next.js | Node.js Developer',
    email:     'aqib.ali018634@gmail.com',
    phone:     '+923067578544',
    location:  'Gulberg III, Lahore, Pakistan',
    linkedin:  'linkedin.com/in/aqibali',
    github:    'github.com/aqibali',
    portfolio: '',
    photo:     '',
    summary:
      'Dynamic and results-driven Software Developer with 3.5 years of experience building scalable, responsive, and user-centric web applications using ReactJS, Next.js, and Redux. Currently expanding full-stack capabilities through hands-on work with Node.js. Proven expertise delivering complex platforms such as multi-vendor marketplaces, booking/bidding systems, and enterprise dashboards.',
  },
  experience: [
    {
      id: 'exp-1',
      company:          'VlionTech (Pvt) Ltd',
      position:         'ReactJS | Next.js | Node.js Developer',
      location:         'I.T. Tower, Gulberg III, Lahore',
      startDate:        '2024-05',
      endDate:          '',
      currentlyWorking: true,
      bullets: [
        'Developed scalable e-commerce and multi-vendor platforms with dynamic content, multi-language support, and role-based access control.',
        'Led development of Fast Travel Solutions — role-based dashboards for Customers, Operators, Drivers, and Admins.',
        'Contributed to a SaaS-based HR system covering attendance, payroll, performance, and recruitment modules.',
        'Built Anicson Solar Admin Portal for real-time inverter data monitoring and analytics.',
        'Integrated Node.js services for API development, authentication, and server-side logic.',
      ],
    },
    {
      id: 'exp-2',
      company:          'Genesis Equity (Pvt) Ltd',
      position:         'ReactJS | Next.js Developer',
      location:         'Wapda Tower, Lahore',
      startDate:        '2023-01',
      endDate:          '2024-05',
      currentlyWorking: false,
      bullets: [
        'Developed Mavard, a scalable construction-materials marketplace with seamless vendor onboarding.',
        'Enhanced Industry Mall with direct sales features for companies and individual sellers.',
        'Led integration of secure authentication, order management, and comprehensive admin dashboards.',
      ],
    },
    {
      id: 'exp-3',
      company:          'Webeasy (Pvt) Ltd',
      position:         'Full Stack Developer',
      location:         'Lahore',
      startDate:        '2022-02',
      endDate:          '2023-01',
      currentlyWorking: false,
      bullets: [
        'Developed a smart web app for 200+ companies automating finance, billing, and user-specific dashboards.',
        'Implemented secure authentication, dynamic data visualisation (ApexCharts), and responsive UI with ReactJS and .NET Core APIs.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution:  'Islamia College Civilline affiliated by Punjab University',
      degree:       'Bachelor in Information Technology',
      fieldOfStudy: 'Information Technology',
      location:     'Lahore, Pakistan',
      startDate:    '2016-11',
      endDate:      '2021-03',
      description:  '',
    },
  ],
  projects: [
    {
      id: 'prj-1',
      title:     'Fast Travel Solutions: End-to-End Booking & Bidding Platform',
      techStack: 'Next.js, React, Redux, Node.js, Socket.io',
      liveLink:  'https://fasttravelmade.co.uk',
      githubLink: '',
      bullets: [
        'Role-based dashboards for customers, operators, admins, and drivers enabling seamless booking, bidding, tracking, and trip management.',
      ],
    },
    {
      id: 'prj-2',
      title:     'OJHA E-commerce — Multi-Vendor Marketplace',
      techStack: 'Next.js, React, Redux, Stripe, Node.js',
      liveLink:  'https://ojha.pk',
      githubLink: '',
      bullets: [
        'Multi-vendor marketplace with vendor store management, secure payments, and smooth buyer-seller interaction.',
      ],
    },
    {
      id: 'prj-3',
      title:     'HR Attendance Management System',
      techStack: 'React, Redux, Node.js, PostgreSQL',
      liveLink:  '',
      githubLink: '',
      bullets: [
        'SaaS platform for managing attendance, payroll, leaves, performance, and recruitment with multi-role access.',
      ],
    },
  ],
  skills: [
    { id: 'sk-1', category: 'Frontend',               skills: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'TypeScript', 'Tailwind CSS'] },
    { id: 'sk-2', category: 'Libraries & Frameworks', skills: ['React Hooks', 'Redux Toolkit', 'React Router', 'Next.js'] },
    { id: 'sk-3', category: 'Backend & Tools',         skills: ['Node.js', 'REST APIs', 'Git/GitHub', 'Material-UI', 'ASP.NET Core (Basics)'] },
  ],
  certifications: [
    { id: 'cert-1', title: 'Meta Front-End Developer',   issuer: 'Meta (Coursera)', date: '2023-08', credentialLink: '' },
    { id: 'cert-2', title: 'React — The Complete Guide', issuer: 'Udemy',           date: '2022-03', credentialLink: '' },
  ],
  languages: [
    { id: 'lang-1', name: 'Urdu',    proficiency: 'Native' },
    { id: 'lang-2', name: 'English', proficiency: 'Intermediate' },
  ],
  awards: [
    { id: 'awd-1', title: 'Best Developer of the Quarter', date: '2024-09', description: 'Recognised for delivering the Fast Travel Solutions platform ahead of schedule with zero critical defects.' },
  ],
  volunteer: [
    {
      id: 'vol-1',
      organization:         'Code for Pakistan',
      role:                 'Frontend Mentor',
      location:             'Lahore, Pakistan',
      startDate:            '2023-03',
      endDate:              '',
      currentlyVolunteering: true,
      description:          'Mentoring junior developers through weekly code reviews, pair-programming sessions, and workshops on React and modern JavaScript.',
    },
  ],
  interests:      ['Open Source', 'Competitive Programming', 'UI/UX Design', 'Photography', 'Chess', 'Football'],
  customSections: [],
  hiddenSections: [],
}

const superAdminTheme = {
  accentColor:  '#0f2044',
  headerBg:     '#0f2044',
  fontFamily:   'geist',
  templateId:   'two-column',
  density:      'standard',
  photoShape:   'circle',
  headingStyle: 'underline',
  nameSize:     'large',
  columnRatio:  35,
  sectionOrder: ['summary','experience','education','projects','skills','certifications','languages','awards','volunteer','interests'],
}

// ── Admin dummy resume data (fictional Full Stack Dev — React & Next.js) ───────

const adminResumeData = {
  personal: {
    fullName:  'Alex Morgan',
    jobTitle:  'Full Stack Developer | React & Next.js',
    email:     'alex.morgan@devmail.io',
    phone:     '+1 (555) 867-5309',
    location:  'Austin, TX, USA',
    linkedin:  'linkedin.com/in/alexmorgan-dev',
    github:    'github.com/alexmorgan-dev',
    portfolio: 'alexmorgan.dev',
    photo:     '',
    summary:
      'Full Stack Developer with 4 years of experience building high-performance web applications with React, Next.js, Node.js, and TypeScript. Strong focus on clean architecture, component-driven design, and delivering pixel-perfect UIs. Experienced in REST and GraphQL APIs, cloud deployments on Vercel and AWS, and agile team environments.',
  },
  experience: [
    {
      id: 'exp-1',
      company:          'Horizon Labs Inc.',
      position:         'Senior Full Stack Developer',
      location:         'Austin, TX (Remote)',
      startDate:        '2023-03',
      endDate:          '',
      currentlyWorking: true,
      bullets: [
        'Architected and shipped a multi-tenant SaaS dashboard using Next.js App Router, tRPC, and Prisma — reducing initial page load by 42%.',
        'Led a team of 4 engineers, conducted weekly code reviews, and maintained coding standards across 3 product repositories.',
        'Designed a reusable component library with Radix UI and Tailwind CSS adopted across 5 internal products.',
        'Integrated Stripe billing, Webhooks, and subscription management serving 2 000+ paying customers.',
        'Deployed CI/CD pipelines on GitHub Actions with automated E2E testing via Playwright.',
      ],
    },
    {
      id: 'exp-2',
      company:          'Pixel & Code Agency',
      position:         'Frontend Developer',
      location:         'San Francisco, CA',
      startDate:        '2021-06',
      endDate:          '2023-02',
      currentlyWorking: false,
      bullets: [
        'Developed 12+ client-facing web apps in React and Next.js with Lighthouse performance scores consistently above 90.',
        'Built a headless CMS integration layer (Contentful + Next.js ISR) that cut content publishing time by 60%.',
        'Collaborated with UX designers to implement accessible, WCAG 2.1 AA-compliant interfaces.',
      ],
    },
    {
      id: 'exp-3',
      company:          'StartupNest',
      position:         'Junior Web Developer',
      location:         'Remote',
      startDate:        '2020-01',
      endDate:          '2021-05',
      currentlyWorking: false,
      bullets: [
        'Maintained and extended a React SPA backed by a Node.js/Express REST API and MongoDB.',
        'Introduced TypeScript to the frontend codebase, reducing runtime errors by an estimated 35%.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution:  'University of Texas at Austin',
      degree:       'Bachelor of Science in Computer Science',
      fieldOfStudy: 'Computer Science',
      location:     'Austin, TX',
      startDate:    '2016-09',
      endDate:      '2020-05',
      description:  '',
    },
  ],
  projects: [
    {
      id: 'prj-1',
      title:      'OpenTask — Real-time Kanban Board',
      techStack:  'Next.js 14, React, Socket.io, MongoDB, Tailwind CSS',
      liveLink:   'https://opentask.demo',
      githubLink: 'https://github.com/alexmorgan-dev/opentask',
      bullets: [
        'Collaborative task management app with real-time drag-and-drop, websocket sync, and role-based permissions for teams.',
      ],
    },
    {
      id: 'prj-2',
      title:      'ShopNext — E-commerce Starter Kit',
      techStack:  'Next.js, TypeScript, Stripe, Prisma, PostgreSQL',
      liveLink:   'https://shopnext.demo',
      githubLink: 'https://github.com/alexmorgan-dev/shopnext',
      bullets: [
        'Open-source storefront boilerplate with cart, checkout, Stripe payments, order history, and an admin dashboard.',
      ],
    },
    {
      id: 'prj-3',
      title:      'DevMetrics — GitHub Analytics Dashboard',
      techStack:  'React, Recharts, GitHub GraphQL API, Node.js',
      liveLink:   '',
      githubLink: 'https://github.com/alexmorgan-dev/devmetrics',
      bullets: [
        'Personal dashboard that aggregates commit activity, PR stats, and code frequency charts from the GitHub API.',
      ],
    },
  ],
  skills: [
    { id: 'sk-1', category: 'Frontend',    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Radix UI'] },
    { id: 'sk-2', category: 'Backend',     skills: ['Node.js', 'Express', 'tRPC', 'GraphQL', 'REST APIs', 'Prisma'] },
    { id: 'sk-3', category: 'Databases',   skills: ['PostgreSQL', 'MongoDB', 'Redis'] },
    { id: 'sk-4', category: 'DevOps & Tools', skills: ['Git', 'Docker', 'Vercel', 'AWS (S3, Lambda)', 'GitHub Actions', 'Playwright'] },
  ],
  certifications: [
    { id: 'cert-1', title: 'AWS Certified Developer — Associate', issuer: 'Amazon Web Services', date: '2023-11', credentialLink: '' },
    { id: 'cert-2', title: 'Next.js & React — The Complete Guide', issuer: 'Udemy',               date: '2022-01', credentialLink: '' },
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'Conversational' },
  ],
  awards: [
    { id: 'awd-1', title: 'Hackathon 1st Place — HackATX 2022', date: '2022-10', description: 'Won first place out of 80 teams for building a real-time transit tracking PWA in 24 hours.' },
  ],
  volunteer: [
    {
      id: 'vol-1',
      organization:         'freeCodeCamp Austin',
      role:                 'Workshop Facilitator',
      location:             'Austin, TX',
      startDate:            '2022-06',
      endDate:              '',
      currentlyVolunteering: true,
      description:          'Run bi-weekly JavaScript and React workshops for beginners, covering modern hooks, state management, and building full-stack applications.',
    },
  ],
  interests:      ['Open Source', 'TypeScript Ecosystem', 'Performance Optimisation', 'Hiking', 'Coffee Brewing', 'Indie Games'],
  customSections: [],
  hiddenSections: [],
}

const adminTheme = {
  accentColor:  '#1d4ed8',
  headerBg:     '#1d4ed8',
  fontFamily:   'inter',
  templateId:   'professional',
  density:      'standard',
  photoShape:   'circle',
  headingStyle: 'underline',
  nameSize:     'large',
  columnRatio:  38,
  sectionOrder: ['summary','experience','education','projects','skills','certifications','languages','awards','volunteer','interests'],
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGODB_URI!)
  console.log('✅  Connected to MongoDB\n')

  // ── 1. Super Admin ──────────────────────────────────────────────────────────
  const superAdminEmail    = 'superadmin@resumebuilder.com'
  const superAdminPassword = 'SuperAdmin@123'

  let superAdmin = await User.findOne({ email: superAdminEmail })
  if (!superAdmin) {
    superAdmin = await User.create({
      fullName: 'Aqib Ali',
      email:    superAdminEmail,
      phone:    '+923067578544',
      gender:   'male',
      password: await bcrypt.hash(superAdminPassword, 12),
      role:     'super_admin',
    })
    console.log('✅  Super Admin created')
  } else {
    await User.updateOne({ email: superAdminEmail }, { role: 'super_admin', fullName: 'Aqib Ali' })
    console.log('ℹ️   Super Admin already exists — role confirmed')
  }

  // Resume
  const superAdminResumeCount = await Resume.countDocuments({ userId: superAdmin._id })
  let superAdminResumeId: mongoose.Types.ObjectId | null = null
  if (superAdminResumeCount === 0) {
    const r = await Resume.create({
      userId:            superAdmin._id,
      name:              'Aqib Ali — Full Stack',
      template:          'two-column',
      data:              superAdminResumeData,
      theme:             superAdminTheme,
      versions:          [{ versionId: 'v1', label: 'Initial', data: superAdminResumeData, theme: superAdminTheme, savedAt: new Date() }],
      completenessScore: 92,
    })
    superAdminResumeId = r._id as mongoose.Types.ObjectId
    console.log('✅  Super Admin resume created')
  } else {
    const r = await Resume.findOne({ userId: superAdmin._id })
    superAdminResumeId = r?._id as mongoose.Types.ObjectId | null
    console.log('ℹ️   Super Admin resume already exists — skipped')
  }

  // Cover Letters
  const superAdminCLCount = await CoverLetter.countDocuments({ userId: superAdmin._id })
  if (superAdminCLCount === 0) {
    await CoverLetter.insertMany([
      {
        userId:        superAdmin._id,
        resumeId:      superAdminResumeId,
        name:          'VlionTech — Application Letter',
        recipientName: 'Mr. Usman Malik',
        companyName:   'VlionTech (Pvt) Ltd',
        jobTitle:      'Senior ReactJS Developer',
        body: `Dear Mr. Malik,\n\nI am writing to express my strong interest in the Senior ReactJS Developer position at VlionTech. With 3.5 years of hands-on experience building scalable web applications using React, Next.js, and Redux, I am confident I can contribute meaningfully to your engineering team.\n\nAt Genesis Equity, I developed Mavard — a multi-vendor marketplace handling thousands of daily transactions — and led the integration of secure authentication and comprehensive dashboards. I thrive in fast-paced environments and take pride in delivering high-quality, maintainable code.\n\nI look forward to discussing how my skills align with your team's goals.\n\nBest regards,\nAqib Ali`,
      },
      {
        userId:        superAdmin._id,
        resumeId:      superAdminResumeId,
        name:          'Horizon Tech — Next.js Role',
        recipientName: 'Ms. Sara Ahmed',
        companyName:   'Horizon Tech',
        jobTitle:      'Next.js Frontend Developer',
        body: `Dear Ms. Ahmed,\n\nI am excited to apply for the Next.js Frontend Developer position at Horizon Tech. My experience building production-grade Next.js applications — including real-time dashboards, e-commerce platforms, and SaaS tools — aligns closely with the requirements of this role.\n\nI am particularly drawn to Horizon Tech's focus on developer experience and product quality. I would love to bring my expertise in React Server Components, TypeScript, and performance optimisation to your team.\n\nThank you for considering my application.\n\nSincerely,\nAqib Ali`,
      },
    ])
    console.log('✅  Super Admin cover letters created (2)')
  } else {
    console.log('ℹ️   Super Admin cover letters already exist — skipped')
  }

  // Jobs
  const superAdminJobCount = await Job.countDocuments({ userId: superAdmin._id })
  if (superAdminJobCount === 0) {
    await Job.insertMany([
      {
        userId:      superAdmin._id,
        company:     'VlionTech (Pvt) Ltd',
        role:        'Senior ReactJS Developer',
        location:    'Lahore, Pakistan',
        appliedDate: '2024-04-20',
        status:      'offer',
        resumeId:    superAdminResumeId?.toString() ?? null,
        notes:       'Received offer — joined May 2024.',
        url:         'https://vliontech.com/careers',
        deadline:    '',
        interviewDate: '2024-04-28',
        interviewType: 'onsite',
        notesHistory: [
          { id: 'n1', text: 'Applied via LinkedIn referral', createdAt: new Date('2024-04-20') },
          { id: 'n2', text: 'Technical interview went well — discussed Redux architecture and Next.js ISR', createdAt: new Date('2024-04-28') },
        ],
      },
      {
        userId:      superAdmin._id,
        company:     'Horizon Tech',
        role:        'Next.js Frontend Developer',
        location:    'Karachi, Pakistan (Hybrid)',
        appliedDate: '2024-03-10',
        status:      'rejected',
        resumeId:    superAdminResumeId?.toString() ?? null,
        notes:       'Rejected after final round — position filled internally.',
        url:         '',
        deadline:    '',
        interviewDate: '2024-03-22',
        interviewType: 'video',
        notesHistory: [
          { id: 'n1', text: 'Applied via company website', createdAt: new Date('2024-03-10') },
          { id: 'n2', text: 'Two rounds of technical interviews completed', createdAt: new Date('2024-03-22') },
        ],
      },
      {
        userId:      superAdmin._id,
        company:     'PixelForge Studios',
        role:        'Full Stack Developer (React + Node)',
        location:    'Remote',
        appliedDate: '2024-05-15',
        status:      'wishlist',
        resumeId:    null,
        notes:       'Interesting role — check job requirements before applying.',
        url:         'https://pixelforge.io/jobs/fullstack',
        deadline:    '2024-06-01',
        interviewDate: '',
        interviewType: '',
        notesHistory: [],
      },
    ])
    console.log('✅  Super Admin job applications created (3)')
  } else {
    console.log('ℹ️   Super Admin jobs already exist — skipped')
  }

  // ── 2. Simple Admin ─────────────────────────────────────────────────────────
  const adminEmail    = 'admin@resumebuilder.com'
  const adminPassword = 'Admin@123'

  let admin = await User.findOne({ email: adminEmail })
  if (!admin) {
    admin = await User.create({
      fullName: 'Alex Morgan',
      email:    adminEmail,
      phone:    '+1 (555) 867-5309',
      gender:   'prefer_not_to_say',
      password: await bcrypt.hash(adminPassword, 12),
      role:     'admin',
    })
    console.log('✅  Admin created')
  } else {
    console.log('ℹ️   Admin already exists — skipped')
  }

  // Admin resume
  const adminResumeCount = await Resume.countDocuments({ userId: admin._id })
  if (adminResumeCount === 0) {
    await Resume.create({
      userId:            admin._id,
      name:              'Alex Morgan — Full Stack Dev',
      template:          'professional',
      data:              adminResumeData,
      theme:             adminTheme,
      versions:          [{ versionId: 'v1', label: 'Initial', data: adminResumeData, theme: adminTheme, savedAt: new Date() }],
      completenessScore: 88,
    })
    console.log('✅  Admin resume created')
  } else {
    console.log('ℹ️   Admin resume already exists — skipped')
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────────')
  console.log('  Seed complete!')
  console.log('─────────────────────────────────────────────')
  console.log('  Super Admin')
  console.log(`    Email    : ${superAdminEmail}`)
  console.log(`    Password : ${superAdminPassword}`)
  console.log(`    Role     : super_admin`)
  console.log(`    Records  : 1 resume · 2 cover letters · 3 jobs`)
  console.log('')
  console.log('  Admin')
  console.log(`    Email    : ${adminEmail}`)
  console.log(`    Password : ${adminPassword}`)
  console.log(`    Role     : admin`)
  console.log(`    Records  : 1 resume (dummy Full Stack Dev profile)`)
  console.log('─────────────────────────────────────────────\n')

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err)
  process.exit(1)
})
