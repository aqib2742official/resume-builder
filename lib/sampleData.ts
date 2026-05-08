import type { ResumeData } from '@/types/resume'

export const sampleResumeData: ResumeData = {
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
    summary:
      'Computer Science student with a strong interest in web development and modern frontend technologies. Skilled in building responsive web interfaces using HTML, CSS, and Bootstrap, with a solid foundation in programming concepts. Eager to begin a career in development, contribute to real-world projects, and continuously enhance skills in JavaScript and modern frameworks.',
  },
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Government Health Department – Pakistan',
      position: 'Polio Campaign Worker',
      location: 'Pakistan',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      bullets: [
        'Participated in community outreach programs',
        'Developed communication and teamwork skills in fieldwork',
      ],
    },
    {
      id: crypto.randomUUID(),
      company: 'Organization',
      position: 'Nursing Training (Basic Level)',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      bullets: [
        'Gained practical exposure to structured training environments',
        'Improved discipline, responsibility, and coordination',
      ],
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: 'Government College University Faisalabad',
      degree: 'BS Computer Science',
      fieldOfStudy: 'Computer Science',
      location: 'Faisalabad',
      startDate: '2022-06',
      endDate: '2026-06',
      description: 'CGPA: 3.78 | Expected Graduation',
    },
  ],
  projects: [
    {
      id: crypto.randomUUID(),
      title: 'Portfolio Website',
      techStack: 'HTML, CSS, Bootstrap — Self-Initiated Project',
      liveLink: '',
      githubLink: '',
      bullets: [
        'Developed a responsive personal portfolio using HTML, CSS, and Bootstrap',
        'Designed clean UI layout for showcasing profile and skills',
        'Ensured mobile-friendly design for multiple screen sizes',
        'Structured clean UI with reusable sections',
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'Responsive Landing Page',
      techStack: 'HTML, CSS, Bootstrap — Academic Project',
      liveLink: '',
      githubLink: '',
      bullets: [
        'Created a modern landing page using Bootstrap',
        'Focused on layout structure, styling, and user-friendly design',
        'Applied responsive techniques for cross-device compatibility',
      ],
    },
  ],
  skills: [
    {
      id: crypto.randomUUID(),
      category: 'Web',
      skills: ['HTML5', 'CSS', 'JavaScript (ES6+)', 'Tailwind CSS / Bootstrap', 'Responsive Design'],
    },
    {
      id: crypto.randomUUID(),
      category: 'Tools',
      skills: ['Git & GitHub', 'VS Code'],
    },
    {
      id: crypto.randomUUID(),
      category: 'Other',
      skills: ['C++ (Fundamentals, Problem Solving)', 'MS Word', 'Excel', 'PowerPoint'],
    },
  ],
  certifications: [
    {
      id: crypto.randomUUID(),
      title: 'Web Development',
      issuer: 'Training Program',
      date: '',
      credentialLink: '',
    },
    {
      id: crypto.randomUUID(),
      title: 'Graphic Designing',
      issuer: 'Training Program',
      date: '',
      credentialLink: '',
    },
  ],
  languages: [],
  awards: [],
  volunteer: [],
  interests: [],
  customSections: [],
  hiddenSections: [],
}

export const aqibAliResumeData: ResumeData = {
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
      title: 'Fast Travel Solutions: End-to-End Booking and Bidding Platform',
      techStack: 'Next.js, React, Redux, Node.js, Socket.io',
      liveLink: 'https://fasttravelmade.co.uk',
      githubLink: '',
      bullets: [
        'Role-based dashboards for customers, operators, admins, and drivers enabling seamless booking, bidding, tracking, and trip management.',
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'OJHA E-commerce – Multi-Vendor Marketplace',
      techStack: 'Next.js, React, Redux, Stripe, Node.js',
      liveLink: 'https://ojha.pk',
      githubLink: '',
      bullets: [
        'Multi-vendor marketplace with vendor store management, secure payments, and smooth buyer-seller interaction.',
      ],
    },
    {
      id: crypto.randomUUID(),
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
    { id: crypto.randomUUID(), category: 'Frontend', skills: ['HTML', 'CSS', 'Bootstrap', 'Javascript', 'Typescript', 'Tailwind CSS'] },
    { id: crypto.randomUUID(), category: 'Libraries & Frameworks', skills: ['React Hooks', 'Redux Toolkit', 'React Router', 'NextJs'] },
    { id: crypto.randomUUID(), category: 'Backend & Tools', skills: ['Node.js', 'REST APIs', 'Github', 'Material-UI', 'Basic ASP.NET'] },
  ],
  certifications: [
    { id: crypto.randomUUID(), title: 'Meta Front-End Developer', issuer: 'Meta (Coursera)', date: '2023-08', credentialLink: '' },
    { id: crypto.randomUUID(), title: 'React — The Complete Guide', issuer: 'Udemy', date: '2022-03', credentialLink: '' },
  ],
  languages: [
    { id: crypto.randomUUID(), name: 'Urdu', proficiency: 'Native' },
    { id: crypto.randomUUID(), name: 'English', proficiency: 'Intermediate' },
  ],
  awards: [
    { id: crypto.randomUUID(), title: 'Best Developer of the Quarter', date: '2024-09', description: 'Recognized for delivering the Fast Travel Solutions platform ahead of schedule with zero critical defects.' },
  ],
  volunteer: [
    {
      id: crypto.randomUUID(),
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
