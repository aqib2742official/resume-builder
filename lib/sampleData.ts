import type { ResumeData } from '@/types/resume'

export const sampleResumeData: ResumeData = {
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
        'Led development of Fast Travel Solutions, a comprehensive web platform including interactive dashboards for Customers, Operators, Drivers, and Admins. Real-time booking, bidding, and vehicle management.',
        'Contributed to a SaaS-based HR system covering attendance, payroll, performance, and recruitment modules.',
        'Built and maintained Anicson Solar Admin Portal for real-time inverter data monitoring and analytics.',
        'Updated and optimized multiple legacy projects for better performance and UI consistency.',
        'Integrated Node.js services in current projects to handle backend tasks such as API development, authentication, and server-side logic.',
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
        'Developed Mavard, a scalable platform for selling construction materials, implementing seamless vendor onboarding and store management.',
        'Enhanced the Industry Mall platform by implementing direct sales features, allowing companies and individual sellers to list and sell machines efficiently.',
        'Led the integration of secure user/vendor authentication, order management, and comprehensive dashboards.',
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
        'Developed a smart web app for 200+ companies using SIE, automating finance, billing, and user-specific dashboards.',
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
        'Developed a versatile system with role-based dashboards for customers, operators, admins, and drivers, enabling seamless booking, bidding, tracking, and trip management.',
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'Gulfcars (London VIP Cars in Wembley)',
      techStack: 'Next.js, React, Redux, Tailwind CSS',
      liveLink: 'https://gulfcars.com',
      githubLink: '',
      bullets: [
        'Developed admin-controlled pages for a car hire platform offering city, local, and airport transport services. Enabled full content management and booking flow via a user-friendly interface.',
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'HR Attendance Management System',
      techStack: 'React, Redux, Node.js, PostgreSQL',
      liveLink: '',
      githubLink: '',
      bullets: [
        'Product-based SaaS platform for managing employee attendance, payroll, leaves, performance, and recruitment. Features include multi-role access, automated salary processing, and streamlined onboarding workflows.',
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'OJHA E-commerce – Multi-Vendor Marketplace',
      techStack: 'Next.js, React, Redux, Stripe, Node.js',
      liveLink: 'https://ojha.pk',
      githubLink: '',
      bullets: [
        'A multi-vendor marketplace allowing vendors to manage stores, products, and orders. Features include secure payments, customizable listings, and smooth buyer-seller interaction.',
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'Anicson Solar Admin Portal',
      techStack: 'React, Redux, ApexCharts, REST APIs',
      liveLink: 'https://anicson.store',
      githubLink: '',
      bullets: [
        'A smart system to manage Anicson solar inverter inventory and complaints, with real-time tracking and seamless app integration for support and service.',
      ],
    },
  ],
  skills: [
    {
      id: crypto.randomUUID(),
      category: 'Frontend',
      skills: ['HTML', 'CSS', 'Bootstrap', 'Javascript', 'Typescript', 'Tailwind CSS'],
    },
    {
      id: crypto.randomUUID(),
      category: 'Libraries & Frameworks',
      skills: ['React Hooks', 'Redux Toolkit', 'React Router', 'OOP', 'NextJs'],
    },
    {
      id: crypto.randomUUID(),
      category: 'Backend & Tools',
      skills: ['Basic ASP.NET', 'Github', 'Problem Solving', 'Node.js', 'REST APIs', 'Material-UI'],
    },
    {
      id: crypto.randomUUID(),
      category: 'Soft Skills',
      skills: ['Proven ability to work well in a team', 'Multi-language Support'],
    },
  ],
  certifications: [
    {
      id: crypto.randomUUID(),
      title: 'Meta Front-End Developer',
      issuer: 'Meta (Coursera)',
      date: '2023-08',
      credentialLink: 'https://coursera.org/verify/meta-frontend',
    },
    {
      id: crypto.randomUUID(),
      title: 'JavaScript Algorithms & Data Structures',
      issuer: 'freeCodeCamp',
      date: '2022-06',
      credentialLink: 'https://freecodecamp.org/certification/aqib/javascript-algorithms-and-data-structures',
    },
    {
      id: crypto.randomUUID(),
      title: 'React — The Complete Guide',
      issuer: 'Udemy (Maximilian Schwarzmüller)',
      date: '2022-03',
      credentialLink: '',
    },
  ],
  languages: [
    {
      id: crypto.randomUUID(),
      name: 'Urdu',
      proficiency: 'Native',
    },
    {
      id: crypto.randomUUID(),
      name: 'English',
      proficiency: 'Intermediate',
    },
    {
      id: crypto.randomUUID(),
      name: 'Punjabi',
      proficiency: 'Native',
    },
  ],
  awards: [
    {
      id: crypto.randomUUID(),
      title: 'Best Developer of the Quarter',
      date: '2024-09',
      description: 'Recognized for delivering the Fast Travel Solutions platform ahead of schedule with zero critical defects.',
    },
    {
      id: crypto.randomUUID(),
      title: 'Top Contributor — Open Source Hackathon',
      date: '2023-04',
      description: 'Placed 2nd among 120+ participants for building an accessible civic-reporting web app in 48 hours.',
    },
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
      description: 'Mentoring junior developers and students through weekly code reviews, pair-programming sessions, and workshops on React and modern JavaScript.',
    },
    {
      id: crypto.randomUUID(),
      organization: 'Lahore Tech Community',
      role: 'Workshop Facilitator',
      location: 'Lahore, Pakistan',
      startDate: '2022-09',
      endDate: '2023-02',
      currentlyVolunteering: false,
      description: 'Organized and facilitated monthly hands-on workshops covering web fundamentals, Git workflows, and career guidance for fresh graduates.',
    },
  ],
  interests: [
    'Open Source', 'Competitive Programming', 'UI/UX Design', 'Photography',
    'Hiking', 'Chess', 'Tech Podcasts', 'Football',
  ],
  customSections: [],
  hiddenSections: [],
}
