/**
 * Seed script — creates Super Admin, demo user, and 3 sample resumes.
 * Run: npx tsx --env-file=.env.local scripts/seed.ts
 *
 * Requires MONGODB_URI in .env.local (or environment).
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set. Add it to .env.local')
  process.exit(1)
}

// ── Inline schemas (avoid Next.js module resolution issues in plain Node) ──────

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
  template:          { type: String, default: 'classic' },
  data:              mongoose.Schema.Types.Mixed,
  theme:             mongoose.Schema.Types.Mixed,
  versions:          { type: Array, default: [] },
  completenessScore: { type: Number, default: 0 },
}, { timestamps: true })

const User   = mongoose.models.User   ?? mongoose.model('User',   UserSchema)
const Resume = mongoose.models.Resume ?? mongoose.model('Resume', ResumeSchema)

// ── Resume data ────────────────────────────────────────────────────────────────

const aqibAliResumeData = {
  personal: {
    fullName: 'Aqib Ali',
    jobTitle: 'ReactJS | Next.js | Node.js Developer',
    email: 'aqib.ali018634@gmail.com',
    phone: '+923067578544',
    location: 'Gulberg III, Lahore, Pakistan',
    linkedin: 'linkedin.com/in/aqibali',
    github: 'github.com/aqibali',
    portfolio: '',
    photo: '',
    summary:
      'Dynamic and results-driven Software Developer with 3.5 years of experience in building scalable, responsive, and user-centric web applications using ReactJS, Next.js, and Redux. Currently expanding full-stack capabilities through hands-on work with Node.js. Proven expertise in delivering complex platforms such as multi-vendor marketplaces, booking/bidding systems, and enterprise dashboards. Passionate about writing clean, maintainable code and contributing to impactful products in collaborative, fast-paced environments.',
  },
  experience: [
    {
      id: '1',
      company: 'VlionTech (Pvt) Ltd',
      position: 'ReactJS | Next.js | Node.js Developer',
      location: 'I.T. Tower, Gulberg III, Lahore',
      startDate: '2024-05',
      endDate: '',
      currentlyWorking: true,
      bullets: [
        'Developed scalable e-commerce and multi-vendor platforms with dynamic content, multi-language, and role-based access.',
        'Led development of Fast Travel Solutions, a comprehensive web platform including interactive dashboards for Customers, Operators, Drivers, and Admins.',
        'Contributed to a SaaS-based HR system covering attendance, payroll, performance, and recruitment modules.',
        'Built and maintained Anicson Solar Admin Portal for real-time inverter data monitoring and analytics.',
        'Integrated Node.js services to handle API development, authentication, and server-side logic.',
      ],
    },
    {
      id: '2',
      company: 'Genesis Equity (Pvt) Ltd',
      position: 'ReactJS | Next.js Developer',
      location: 'Wapda Tower, Lahore',
      startDate: '2023-01',
      endDate: '2024-05',
      currentlyWorking: false,
      bullets: [
        'Developed Mavard, a scalable platform for selling construction materials with seamless vendor onboarding.',
        'Enhanced Industry Mall by implementing direct sales features for companies and individual sellers.',
        'Led integration of secure authentication, order management, and comprehensive dashboards.',
      ],
    },
    {
      id: '3',
      company: 'Webeasy (Pvt) Ltd',
      position: 'Full Stack Developer',
      location: 'Lahore',
      startDate: '2022-02',
      endDate: '2023-01',
      currentlyWorking: false,
      bullets: [
        'Developed a smart web app for 200+ companies automating finance, billing, and user-specific dashboards.',
        'Secured authentication, dynamic data visualization (ApexCharts), and responsive UI with ReactJS and .NET Core APIs.',
      ],
    },
  ],
  education: [
    {
      id: '4',
      institution: 'Islamia College Civilline affiliated by Punjab University, Lahore',
      degree: 'Bachelor in Information Technology',
      fieldOfStudy: 'Information Technology',
      location: 'Lahore',
      startDate: '2016-11',
      endDate: '2021-03',
      description: '',
    },
  ],
  projects: [
    {
      id: '5',
      title: 'Fast Travel Solutions: End-to-End Booking and Bidding Platform',
      techStack: 'Next.js, React, Redux, Node.js, Socket.io',
      liveLink: 'https://fasttravelmade.co.uk',
      githubLink: '',
      bullets: [
        'Role-based dashboards for customers, operators, admins, and drivers enabling seamless booking, bidding, tracking, and trip management.',
      ],
    },
    {
      id: '6',
      title: 'OJHA E-commerce – Multi-Vendor Marketplace',
      techStack: 'Next.js, React, Redux, Stripe, Node.js',
      liveLink: 'https://ojha.pk',
      githubLink: '',
      bullets: [
        'Multi-vendor marketplace with vendor store management, secure payments, and smooth buyer-seller interaction.',
      ],
    },
    {
      id: '7',
      title: 'HR Attendance Management System',
      techStack: 'React, Redux, Node.js, PostgreSQL',
      liveLink: '',
      githubLink: '',
      bullets: [
        'SaaS platform for managing attendance, payroll, leaves, performance, and recruitment with multi-role access.',
      ],
    },
  ],
  skills: [
    { id: '8',  category: 'Frontend',               skills: ['HTML', 'CSS', 'Bootstrap', 'Javascript', 'Typescript', 'Tailwind CSS'] },
    { id: '9',  category: 'Libraries & Frameworks', skills: ['React Hooks', 'Redux Toolkit', 'React Router', 'NextJs'] },
    { id: '10', category: 'Backend & Tools',         skills: ['Node.js', 'REST APIs', 'Github', 'Material-UI', 'Basic ASP.NET'] },
  ],
  certifications: [
    { id: '11', title: 'Meta Front-End Developer',      issuer: 'Meta (Coursera)', date: '2023-08', credentialLink: '' },
    { id: '12', title: 'React — The Complete Guide',    issuer: 'Udemy',           date: '2022-03', credentialLink: '' },
  ],
  languages: [
    { id: '13', name: 'Urdu',    proficiency: 'Native' },
    { id: '14', name: 'English', proficiency: 'Intermediate' },
  ],
  awards: [
    { id: '15', title: 'Best Developer of the Quarter', date: '2024-09', description: 'Recognized for delivering the Fast Travel Solutions platform ahead of schedule with zero critical defects.' },
  ],
  volunteer: [
    {
      id: '16',
      organization: 'Code for Pakistan',
      role: 'Frontend Mentor',
      location: 'Lahore, Pakistan',
      startDate: '2023-03',
      endDate: '',
      currentlyVolunteering: true,
      description: 'Mentoring junior developers through weekly code reviews, pair-programming sessions, and workshops on React and modern JavaScript.',
    },
  ],
  interests: ['Open Source', 'Competitive Programming', 'UI/UX Design', 'Photography', 'Chess', 'Football'],
  customSections: [],
  hiddenSections: [],
}

const aqibAliTheme = {
  accentColor: '#0f2044',
  headerBg: '#0f2044',
  fontFamily: 'geist',
  templateId: 'two-column',
  density: 'standard',
  photoShape: 'circle',
  headingStyle: 'underline',
  nameSize: 'large',
  columnRatio: 35,
  sectionOrder: ['summary','experience','education','projects','skills','certifications','languages','awards','volunteer','interests'],
}

const sampleResumeData = {
  personal: {
    fullName: 'Maria Ameen',
    jobTitle: 'Aspiring Full Stack Developer (MERN)',
    email: 'ameenmaria11@gmail.com',
    phone: '0309-4605656',
    location: 'Gullberg, Lahore, PK',
    linkedin: '',
    github: '',
    portfolio: '',
    photo: '',
    summary: 'Computer Science student with a strong interest in web development and modern frontend technologies. Skilled in building responsive web interfaces using HTML, CSS, and Bootstrap.',
  },
  experience: [],
  education: [
    {
      id: '1',
      institution: 'Government College University Faisalabad',
      degree: 'BS Computer Science',
      fieldOfStudy: 'Computer Science',
      location: 'Faisalabad, PK',
      startDate: '2022',
      endDate: '2026',
      description: '',
    },
  ],
  projects: [],
  skills: [
    { id: '1', category: 'Frontend', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Bootstrap', 'Tailwind CSS'] },
    { id: '2', category: 'Backend', skills: ['Node.js', 'Express.js', 'MongoDB'] },
  ],
  certifications: [],
  languages: [{ id: '1', name: 'English', proficiency: 'Intermediate' }, { id: '2', name: 'Urdu', proficiency: 'Native' }],
  awards: [],
  volunteer: [],
  interests: ['Web Development', 'UI/UX Design', 'Open Source'],
  customSections: [],
  hiddenSections: [],
}

const sampleTheme = {
  accentColor: '#0f2044',
  headerBg: '#0f2044',
  fontFamily: 'geist',
  templateId: 'two-column',
  density: 'standard',
  photoShape: 'circle',
  headingStyle: 'underline',
  nameSize: 'large',
  columnRatio: 35,
  sectionOrder: ['summary','experience','education','projects','skills','certifications','languages','awards','volunteer','interests'],
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGODB_URI!)
  console.log('✅  Connected to MongoDB')

  // ── 1. Super Admin ──────────────────────────────────────────────────────────
  const superAdminEmail = 'superadmin@resumebuilder.com'
  const superAdminPassword = 'SuperAdmin@123'
  let superAdmin = await User.findOne({ email: superAdminEmail })
  if (!superAdmin) {
    superAdmin = await User.create({
      fullName: 'Super Admin',
      email: superAdminEmail,
      phone: '+1-000-000-0000',
      gender: 'prefer_not_to_say',
      password: await bcrypt.hash(superAdminPassword, 12),
      role: 'super_admin',
    })
    console.log('✅  Super Admin created')
  } else {
    await User.updateOne({ email: superAdminEmail }, { role: 'super_admin' })
    console.log('ℹ️   Super Admin already exists — role ensured')
  }

  // ── Aqib Ali Resume for Super Admin ────────────────────────────────────────
  const superAdminResumeCount = await Resume.countDocuments({ userId: superAdmin._id })
  if (superAdminResumeCount === 0) {
    const now = new Date()
    await Resume.create({
      userId: superAdmin._id,
      name: 'Aqib Ali',
      template: 'two-column',
      data: aqibAliResumeData,
      theme: aqibAliTheme,
      versions: [{ versionId: '1', label: 'v1', data: aqibAliResumeData, theme: aqibAliTheme, savedAt: now }],
      completenessScore: 90,
    })
    console.log('✅  Aqib Ali resume created for Super Admin')
  } else {
    console.log('ℹ️   Super Admin resume already exists — skipped')
  }

  // ── 2. Regular Admin ────────────────────────────────────────────────────────
  const adminEmail = 'admin@resumebuilder.com'
  const adminPassword = 'Admin@123'
  let admin = await User.findOne({ email: adminEmail })
  if (!admin) {
    admin = await User.create({
      fullName: 'Admin User',
      email: adminEmail,
      phone: '+1-000-000-0001',
      gender: 'prefer_not_to_say',
      password: await bcrypt.hash(adminPassword, 12),
      role: 'admin',
    })
    console.log('✅  Admin created')
  } else {
    console.log('ℹ️   Admin already exists — skipped')
  }

  // ── 2. Demo User ────────────────────────────────────────────────────────────
  const demoEmail = 'demo@resumebuilder.com'
  const demoPassword = 'Demo@123'
  let demo = await User.findOne({ email: demoEmail })
  if (!demo) {
    demo = await User.create({
      fullName: 'Maria Ameen',
      email: demoEmail,
      phone: '0309-4605656',
      gender: 'female',
      password: await bcrypt.hash(demoPassword, 12),
      role: 'user',
    })
    console.log('✅  Demo user created')
  } else {
    console.log('ℹ️   Demo user already exists — skipped')
  }

  // ── 3. Sample Resumes for Demo User ────────────────────────────────────────
  const existingCount = await Resume.countDocuments({ userId: demo._id })
  if (existingCount === 0) {
    const now = new Date()
    const templates = [
      { name: 'Maria Ameen — Full Stack', template: 'two-column' },
      { name: 'Maria Ameen — Minimal',    template: 'minimal' },
      { name: 'Maria Ameen — Professional', template: 'professional' },
    ]

    for (const t of templates) {
      await Resume.create({
        userId: demo._id,
        name: t.name,
        template: t.template,
        data: sampleResumeData,
        theme: { ...sampleTheme, templateId: t.template },
        versions: [{ versionId: String(Math.random()), label: 'v1', data: sampleResumeData, theme: sampleTheme, savedAt: now }],
        completenessScore: 62,
      })
    }
    console.log('✅  3 sample resumes created for demo user')
  } else {
    console.log('ℹ️   Demo resumes already exist — skipped')
  }

  console.log('\n─────────────────────────────────────')
  console.log('  Seed complete!')
  console.log('─────────────────────────────────────')
  console.log('  Super Admin:')
  console.log(`    Email:    ${superAdminEmail}`)
  console.log(`    Password: ${superAdminPassword}`)
  console.log('  Admin:')
  console.log(`    Email:    ${adminEmail}`)
  console.log(`    Password: ${adminPassword}`)
  console.log('  Demo User:')
  console.log(`    Email:    ${demoEmail}`)
  console.log(`    Password: ${demoPassword}`)
  console.log('─────────────────────────────────────\n')

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err)
  process.exit(1)
})
