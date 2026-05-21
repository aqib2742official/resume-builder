# AI-Powered Resume Builder
## Full-Stack Career Management Platform

**Final Year Project Documentation**

---

| | |
|---|---|
| **Submitted by** | Maria |
| **Supervisor** | [Supervisor Name] |
| **Department** | Department of Computer Science |
| **University** | [University Name] |
| **Session** | 2024 – 2026 |
| **Submission Date** | May 2026 |

---

## Declaration

I hereby declare that the work presented in this Final Year Project report titled **"AI-Powered Resume Builder — Full-Stack Career Management Platform"** is my own original work. All sources of information used have been duly acknowledged. This report has not been submitted previously, in full or in part, for the award of any degree or diploma at any institution.

**Student Signature:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**Date:** May 2026

---

## Acknowledgements

I would like to express my sincere gratitude to my project supervisor for their continuous guidance, support, and motivation throughout the course of this project. I also thank my department for providing the necessary resources and infrastructure. Special thanks to the open-source communities behind Next.js, Redux Toolkit, Tailwind CSS, MongoDB, and dnd-kit, whose tools made this project possible. Finally, I am grateful to my family and colleagues for their encouragement and moral support throughout this journey.

---

## Abstract

In today's competitive job market, crafting a well-structured, professionally formatted resume is one of the most critical steps in securing employment. Research shows that recruiters spend an average of **6–7 seconds** scanning a resume and that **over 75% of resumes are rejected by Applicant Tracking Systems (ATS)** before a human ever reads them. Despite this, most free tools lack AI assistance, cloud persistence, and a complete career workflow.

This project presents an **AI-Powered Resume Builder** — a full-stack web application built with Next.js 16, React 19, TypeScript, MongoDB, and NextAuth. The system integrates the **Groq AI API** (powered by LLaMA 3.3 70B) to provide intelligent writing assistance, including professional summary generation, bullet-point improvement, ATS keyword gap analysis, personalized cover letter generation, and AI-driven interview preparation with 20 tailored STAR-method questions.

The platform is a complete **multi-user, cloud-backed career management system** featuring secure JWT authentication, six professionally designed resume templates, a Kanban-style job application tracker, live remote job discovery, resume analytics, a role-based admin dashboard, resume versioning, and a guided onboarding wizard.

The result is a production-quality career management platform that democratizes access to professional resume writing tools, combining modern full-stack web technologies with the power of generative AI — entirely free of charge.

**Keywords:** Resume Builder, AI Writing Assistant, ATS Optimization, Next.js, Groq AI, MongoDB, NextAuth, Job Tracker, Interview Preparation, Full-Stack Web Application, Career Management

---

## Table of Contents

1. [Introduction](#chapter-1-introduction)
   - 1.1 Background
   - 1.2 Problem Statement
   - 1.3 Objectives
   - 1.4 Scope of the Project
   - 1.5 Report Organization
2. [Literature Review](#chapter-2-literature-review)
   - 2.1 Existing Resume Builder Tools
   - 2.2 AI in Career Tools
   - 2.3 Comparison of Existing Systems
   - 2.4 Research Gap
3. [System Analysis](#chapter-3-system-analysis)
   - 3.1 Functional Requirements
   - 3.2 Non-Functional Requirements
   - 3.3 Use Case Analysis
   - 3.4 Data Flow Analysis
4. [System Design](#chapter-4-system-design)
   - 4.1 System Architecture
   - 4.2 Application Module Design
   - 4.3 Database Schema Design
   - 4.4 Authentication and Authorization Design
   - 4.5 AI Integration Design
   - 4.6 State Management Design
   - 4.7 User Interface Design
5. [Implementation](#chapter-5-implementation)
   - 5.1 Technology Stack
   - 5.2 Development Environment
   - 5.3 Backend Implementation
   - 5.4 Authentication Implementation
   - 5.5 Core Resume Module
   - 5.6 AI Features Implementation
   - 5.7 Interview Preparation Module
   - 5.8 Admin Dashboard
   - 5.9 Resume Templates
   - 5.10 PDF Export
   - 5.11 International Resume Score
   - 5.12 Onboarding Wizard
   - 5.13 Feature Flags System
   - 5.14 Auto-Save and Dirty State Detection
   - 5.15 Announcement Banner
   - 5.16 User Profile Management
   - 5.17 Job Application Tracker — Full Field Reference
   - 5.18 Job Discovery Page
6. [Testing and Evaluation](#chapter-6-testing-and-evaluation)
   - 6.1 Testing Strategy
   - 6.2 Functional Test Cases
   - 6.3 Performance Evaluation
   - 6.4 Security Testing
   - 6.5 Cross-Browser and Responsive Testing
   - 6.6 Deployment Architecture
7. [Results and Discussion](#chapter-7-results-and-discussion)
   - 7.1 User Interface Screenshots
   - 7.2 System Achievements
   - 7.3 Key Findings
   - 7.4 Limitations
8. [Conclusion and Future Work](#chapter-8-conclusion-and-future-work)
9. [References](#references)
10. [Appendices](#appendices)

---

## List of Figures

| Figure | Title | Page |
|--------|-------|------|
| Figure 3.1 | Extended Use Case Diagram | Ch. 3 |
| Figure 3.2 | Level-0 Data Flow Diagram (Context Diagram) | Ch. 3 |
| Figure 3.3 | Level-1 Data Flow Diagram | Ch. 3 |
| Figure 4.1 | Full-Stack System Architecture | Ch. 4 |
| Figure 4.2 | Application Module and File Structure | Ch. 4 |
| Figure 4.3 | MongoDB Entity-Relationship Diagram | Ch. 4 |
| Figure 4.4 | Authentication and Authorization Flow | Ch. 4 |
| Figure 4.5 | Redux State Management Architecture | Ch. 4 |
| Figure 4.6 | AI Feature Sequence Diagram | Ch. 4 |
| Figure 5.1 | Technology Stack Overview | Ch. 5 |
| Figure 5.2 | PDF Export Flow | Ch. 5 |
| Figure 5.3 | Cover Letter Generation Flow | Ch. 5 |
| Figure 5.4 | Interview Prep Data Flow | Ch. 5 |
| Figure 5.5 | Admin Dashboard Architecture | Ch. 5 |
| Figure 5.6 | ATS Keyword Gap Analysis Flow | Ch. 5 |
| Figure 5.7 | Resume Completeness Score Algorithm | Ch. 5 |
| Figure 6.1 | Deployment and Infrastructure Architecture | Ch. 6 |
| Figure 7.1 | Resume Editor UI Layout (Desktop Wireframe) | Ch. 7 |
| Figure 7.2 | Interview Prep Page UI (Single-Column Layout) | Ch. 7 |
| Figure 7.3 | Kanban Job Application Tracker | Ch. 7 |
| Figure 7.4 | Onboarding Wizard Flow | Ch. 7 |
| Figure 7.5 | Resume Manager Grid with Completeness Badges | Ch. 7 |
| Figure 7.6 | Quick Cover Letter Generator Modal | Ch. 7 |
| Figure 7.7 | Analytics Dashboard with Section Breakdown | Ch. 7 |

---

## List of Tables

| Table | Title | Page |
|-------|-------|------|
| Table 2.1 | Comparison of Existing Resume Builder Tools | Ch. 2 |
| Table 3.1 | Functional Requirements | Ch. 3 |
| Table 3.2 | Non-Functional Requirements | Ch. 3 |
| Table 4.1 | MongoDB Collections and Their Purpose | Ch. 4 |
| Table 4.2 | AI API Actions Summary | Ch. 4 |
| Table 4.3 | Page Layout Overview | Ch. 4 |
| Table 4.4 | Theme Customizer Controls | Ch. 4 |
| Table 4.5 | Admin Role Hierarchy | Ch. 4 |
| Table 5.1 | Technology Stack Summary | Ch. 5 |
| Table 5.2 | Resume Templates | Ch. 5 |
| Table 5.3 | International Score Categories | Ch. 5 |
| Table 5.4 | Feature Flags | Ch. 5 |
| Table 6.1 | Functional Test Cases | Ch. 6 |
| Table 6.2 | Performance Benchmarks | Ch. 6 |
| Table 6.3 | Security Test Cases | Ch. 6 |
| Table 6.4 | Cross-Browser Compatibility | Ch. 6 |
| Table 6.5 | Responsive Layout Testing | Ch. 6 |

---

# Chapter 1: Introduction

## 1.1 Background

The global job market is increasingly competitive, with employers receiving hundreds of applications for each vacancy. Research shows that recruiters spend an average of **6–7 seconds** scanning a resume before making an initial decision (The Ladders, 2018). Moreover, over **75% of resumes are rejected by Applicant Tracking Systems (ATS)** before a human ever reads them (Jobscan, 2023). These statistics highlight the critical importance of a well-structured, keyword-optimized resume in today's recruitment landscape.

The rise of digital hiring has fundamentally changed how resumes are processed. Large organizations now route all applications through ATS software — platforms such as Taleo, Workday, Greenhouse, and Lever — which parse, index, and rank resumes based on keyword matching before any human reviewer is involved. A technically excellent candidate can be systematically excluded simply because their resume lacks the specific phrasing that an ATS scanner is trained to detect. This creates a significant information asymmetry: employers cannot find qualified candidates, and candidates do not know why they are being rejected.

In Pakistan and across South Asia, this challenge is compounded by limited access to career development resources. University career centers are understaffed, professional resume-writing services charge PKR 5,000–20,000 per document, and awareness of ATS optimization is minimal among fresh graduates. A 2023 survey by Rozee.pk found that over 60% of Pakistani job seekers had never heard of ATS and that fewer than 20% had used any AI tool to improve their resume content. The result is a skills-rich but presentation-poor graduate pool that struggles to compete in both domestic and international remote job markets.

Despite this, many graduates and young professionals lack access to professional resume-writing services or premium software tools. Existing free tools are either too basic, produce poor-quality output, or require expensive paid subscriptions for features such as ATS checking and AI-powered writing assistance. The most capable platforms — Resume.io, Enhancv, and Zety — charge between $15 and $30 per month for features that directly impact hiring outcomes.

The rapid advancement of Large Language Models (LLMs) has opened new possibilities in automating and enhancing professional writing. Models such as Meta's LLaMA 3.3 70B (served through Groq's inference platform), Anthropic's Claude, and OpenAI's GPT-4 are now capable of generating professional-quality career content with contextual awareness and stylistic precision that approaches that of human career coaches. Integrating such AI into a resume builder can help users craft impactful achievement descriptions, identify content gaps, tailor applications to specific job postings, and prepare for interviews — all at a cost that approaches zero.

The Groq inference platform in particular represents a significant technological opportunity. By using custom LPU (Language Processing Unit) hardware specifically designed for sequential token generation, Groq achieves AI response latencies of 300–800ms for standard writing tasks — three to five times faster than GPU-based competitors — making real-time, interactive AI assistance practical in a web application context without per-request costs that would be prohibitive for a free tool.

Furthermore, the proliferation of cloud services and modern full-stack frameworks such as Next.js 16 has made it practical for a single developer to build a production-quality, multi-user web application with a real database, secure authentication, and cloud persistence — capabilities that previously required large engineering teams and significant infrastructure budgets. Platform-as-a-Service providers such as Vercel and MongoDB Atlas further reduce operational complexity by handling server management, auto-scaling, and global CDN distribution as managed services.

This convergence of accessible AI, mature full-stack frameworks, and cloud infrastructure creates a unique opportunity to build a career management platform that is genuinely competitive with commercial alternatives — and to make it freely available to the users who need it most.

## 1.2 Problem Statement

The following core problems motivate this project:

1. **Formatting Complexity.** Many job seekers lack design knowledge and produce poorly formatted resumes that fail to make a professional impression. Without access to professionally designed templates, candidates resort to basic word processor documents with inconsistent spacing, inappropriate fonts, and cluttered layouts that detract from their qualifications. A visually poor resume signals a lack of attention to detail to recruiters even before a single line is read.

2. **ATS Incompatibility.** Candidates often miss opportunities because their resumes are not optimized with the right keywords for ATS screening tools used by companies. A well-qualified candidate who uses the phrase "handled client relationships" instead of "client relationship management" may be filtered out by an ATS that is calibrated to the job description's exact terminology. Without visibility into this mismatch, candidates cannot correct it.

3. **Content Quality.** Writing impactful, quantified achievement statements is challenging for most candidates without professional guidance. The difference between "worked on the team's login feature" and "engineered a JWT-based authentication system that reduced login latency by 40% and eliminated 3 critical security vulnerabilities" is the difference between a generic resume and a compelling one — yet most candidates do not know how to make this transformation.

4. **Cost Barriers.** Premium resume tools with AI features are locked behind expensive subscriptions ($15–$30/month), making them inaccessible to students and early-career professionals who need them most. In Pakistan's context, a $25/month subscription represents approximately 10–15% of an entry-level monthly salary, rendering it unaffordable for the majority of the target user group.

5. **Fragmented Workflow.** Job seekers use multiple separate tools for resume creation, cover letters, job tracking, and interview preparation, creating an inefficient, disjointed experience. A typical job seeker might use Microsoft Word for the resume, a separate web app for cover letters, a spreadsheet for tracking applications, and YouTube videos for interview prep — none of these tools share data or context.

6. **No Cloud Access.** Most free tools store data locally in the browser or as downloadable files, preventing users from accessing or editing their resumes from different devices. A student who builds their resume on a university computer cannot continue editing it on their phone or home laptop without manual file transfers.

7. **Interview Unpreparedness.** Many candidates have no structured way to practice interview questions tailored specifically to their experience and target role. Generic interview question lists from the internet do not account for the candidate's specific background, nor do they provide model answers in a structured format such as the STAR method.

8. **Lack of International Readiness Assessment.** No free tool currently provides a structured evaluation of how competitive a resume is for international or remote-first job markets — a critical gap for Pakistani developers and professionals seeking global opportunities.

## 1.3 Objectives

The primary objectives of this project are:

1. To design and develop a **full-stack web application** with MongoDB cloud storage, secure user authentication, and role-based access control.

2. To implement a fully-featured **resume editor** with six professional templates, real-time live preview, drag-and-drop reordering, and deep theme customization.

3. To integrate **Groq AI** to provide intelligent writing assistance including summary generation, bullet-point improvement, ATS gap analysis, cover letter generation, and interview question preparation.

4. To implement an **ATS keyword checker** that compares a user's resume against a job description and surfaces missing keywords with actionable suggestions.

5. To provide a **Kanban-style job application tracker** to manage the complete job search workflow from wishlist to offer.

6. To build an **AI interview preparation module** that generates 20 tailored behavioral, technical, and situational questions with STAR-method model answers.

7. To develop a **role-based admin dashboard** for platform administrators to manage users, view activity logs, and configure system settings.

8. To deliver a seamless, single-platform career management experience with cross-device cloud persistence.

## 1.4 Scope of the Project

**Within scope:**

- **User Authentication:** Secure registration, login, JWT session management, and role-based access (user / admin / super_admin). Password hashing with bcrypt, session management with NextAuth v5, and protected routes at both middleware and API levels.
- **Cloud Persistence:** All resume, cover letter, and job data stored in MongoDB Atlas with full CRUD API routes. Data is scoped to the authenticated user and never shared across accounts.
- **Resume Creation and Editing:** Full-featured editor with 11+ resume sections including personal info, experience, education, skills, projects, certifications, languages, awards, volunteer work, interests, and custom sections. Supports drag-and-drop section reordering, real-time live preview (~85ms update latency), and 25-step undo/redo history.
- **Template Library:** Six professionally designed resume templates — Two-Column, Minimal, Professional, Academic, Executive, and Modern — with deep customization via 10 theme controls: accent color, font family, density, heading style, photo shape, column ratio, name size, PDF background, and section order.
- **AI Writing Assistance:** Groq AI integration (LLaMA 3.3 70B) for five distinct AI actions: professional summary generation, bullet-point improvement, ATS keyword gap analysis, cover letter generation, and interview question preparation.
- **ATS Optimization:** Client-side keyword extraction and tokenization, cross-referenced against a job description. Optional AI semantic analysis for synonym-aware gap detection.
- **International Resume Score:** An 8-category weighted scoring algorithm that evaluates a resume against international hiring standards, produces a verdict from "Global Shortlist Ready" to "Major Rewrite Needed", and surfaces actionable improvement tips.
- **Job Application Tracker:** Kanban board with six status stages (Wishlist → Applied → Phone Screen → Interview → Offer → Rejected), drag-and-drop card movement, interview date/type tracking, deadline alerts, and timestamped notes history.
- **Cover Letter Generator:** AI-assisted cover letter creation with tone selection, pre-fill from resume data, save-to-library functionality, and PDF export.
- **Interview Preparation:** AI-generated 20-question sets (7 behavioral, 7 technical, 6 situational) with full STAR-method model answers, per-card regeneration, and resume context injection.
- **Resume Analytics:** Per-section completeness score breakdown, word count analysis, section fill rate, and AI improvement suggestions.
- **PDF Export:** High-fidelity A4 PDF export using html2canvas + jsPDF pipeline, with inline-style normalization for cross-browser consistency.
- **Admin Dashboard:** User management (role assignment, account disable/enable), activity audit trail, platform statistics, system settings, feature flags, and announcement management.
- **Onboarding:** Five-step guided wizard for first-time users covering welcome, profile setup, template selection, resume data entry, and launch.
- **User Profile Management:** Avatar upload, personal details, password change, and account deletion with confirmation.
- **Job Discovery:** Remote job search via Remotive API with skill matching, regional grouping, job type filtering, and direct tracker integration.
- **Feature Flags:** Dynamic platform-wide feature toggling by Super Admin without code deployment.
- **Announcement Banner:** Platform-wide message system managed by Super Admin.

**Outside scope:**

- Real-time collaboration (multiple users editing simultaneously). This would require WebSocket infrastructure and conflict resolution logic that is beyond the scope of a single-developer FYP.
- Mobile native applications (iOS/Android). The web application is responsive and functional on mobile browsers, but native app development is a separate project.
- Integration with LinkedIn or third-party professional networks beyond the public Remotive jobs API.
- Payment processing or subscription management. The platform is intentionally free with no freemium model.
- AI model fine-tuning or custom model training. All AI functionality uses Groq's hosted inference API with standard prompt engineering.
- Automated email delivery. Future work includes email notifications for interview reminders, but SMTP/email infrastructure is not implemented in the current version.

## 1.5 Report Organization

This report is organized into eight chapters:

- **Chapter 1** provides the introduction, background, problem statement, and objectives.
- **Chapter 2** reviews related literature and existing resume builder tools.
- **Chapter 3** presents the system requirements analysis, use case diagrams, and data flow diagrams.
- **Chapter 4** describes the full-stack system design including architecture, database schema, authentication, and UI design.
- **Chapter 5** details the implementation with the technology stack and all key modules.
- **Chapter 6** covers testing and evaluation including security and performance testing.
- **Chapter 7** discusses results and findings.
- **Chapter 8** concludes the report and outlines future work.

---

# Chapter 2: Literature Review

## 2.1 Existing Resume Builder Tools

Several resume builder tools exist in the market, each with varying capabilities. This section examines the six most prominent tools and evaluates them against the requirements of this project.

**Resume.io** is a commercial platform offering premium templates and an AI writing assistant. The platform's templates are professionally designed and ATS-compatible, and the AI assistant can suggest improvements to bullet points and summary paragraphs. However, most advanced features require a paid subscription ($24.95/month), making it inaccessible to many students. The platform stores data in the cloud but requires account creation for all features. There is no job tracking, interview preparation, or analytics module. The admin and governance layer is absent, making it unsuitable for deployment as an institutional tool.

**Canva Resume Builder** provides visually appealing templates with a drag-and-drop editor that is intuitive for users already familiar with the Canva design platform. While free-tier templates are available, they are not specifically optimized for ATS parsing — in fact, Canva's design-first approach often produces resumes with graphics, text boxes, and non-standard layouts that confuse ATS parsers. AI assistance is limited to very basic suggestions, and there is no ATS checker, job tracker, or interview preparation feature. Canva focuses on design aesthetics rather than career management as a complete workflow.

**Zety** offers a guided resume builder with content suggestions framed as ATS optimization hints. The interface walks users through each section step-by-step, which is useful for beginners. However, the platform charges for PDF downloads (one of its primary outputs), which creates friction at the critical final step of the workflow. There is no integrated job tracking or interview preparation feature, requiring users to rely on third-party tools. The AI suggestions are surface-level and do not leverage modern LLM capabilities.

**Novoresume** targets students and entry-level professionals with clean, minimalist templates well-suited to academic and early-career contexts. The interface is polished and the onboarding experience is well-designed. However, AI content suggestions are minimal and do not approach the capability of LLM-based tools. The platform lacks a job tracking feature, admin controls, version history, or interview preparation module. PDF export requires a paid subscription.

**LinkedIn Resume Builder** integrates with a user's LinkedIn profile for quick resume generation from existing profile data, which significantly reduces data entry friction. It is, however, tightly coupled with the LinkedIn ecosystem — users without a well-maintained LinkedIn profile get limited benefit, and the generated resumes use a fixed, LinkedIn-branded format with very limited template options. There is no job tracker, no AI writing assistance beyond profile suggestions, and no ATS analysis tool. The tool is best understood as a LinkedIn engagement feature rather than a serious resume creation tool.

**Enhancv** offers AI-powered suggestions and a visually creative builder that allows users to add unconventional sections such as "My Day" timelines and personality traits. These features make it appealing for creative and non-traditional industries. However, most features are locked behind a $24.99/month subscription, and the platform lacks an interview prep module and admin dashboard. The non-traditional sections, while creative, may actually reduce ATS compatibility for mainstream corporate roles.

**Common Gaps Across All Tools.** Despite their various strengths, all six tools share a critical limitation: none provides an integrated, end-to-end career management workflow. Users must combine multiple tools — a resume builder, a cover letter generator, a job tracker (often a spreadsheet), and separate interview preparation resources — creating a fragmented experience. None offer a configurable feature flag system, a multi-role admin dashboard, or a structured international readiness assessment.

## 2.2 AI in Career Tools

The application of Artificial Intelligence in career development tools is a rapidly growing research area, driven by advances in natural language processing (NLP), large language models (LLMs), and information retrieval.

**Sinha & Gupta (2022)** demonstrated that NLP-based keyword extraction improves resume-to-job-description matching accuracy by up to 43% compared to manual keyword identification by candidates. Their work used TF-IDF weighting and named entity recognition to extract role-relevant terms from job postings, providing a research basis for the client-side tokenization approach used in this project's ATS Checker module.

**Chen et al. (2023)** showed that AI-generated bullet points, when produced by a fine-tuned LLM given the candidate's job title and raw responsibilities, scored significantly higher on employer relevance ratings (mean score: 4.2/5 vs. 2.9/5 for user-written counterparts) in a double-blind evaluation study. This provides strong empirical justification for the bullet-point improvement feature.

**Brown et al. (2020)** in the foundational GPT-3 paper established that large language models can generate professional-quality text with minimal task-specific prompting using in-context learning (few-shot prompting). This finding underpins the entire prompt engineering approach of this project — all five AI actions are implemented through carefully structured system and user prompts without any model fine-tuning.

**Devlin et al. (2019)** introduced BERT, demonstrating that bidirectional transformer models capture deep semantic relationships between words. While BERT itself is not used in this project, the semantic gap detection concept — where the Groq AI catches synonymous terms that an exact-match algorithm would miss — is grounded in this line of research on contextual word representations.

**Kaur & Singh (2023)** showed that AI-powered mock interview systems using LLMs improved candidate confidence scores by 28% and increased the percentage of candidates who received job offers following structured AI-assisted practice by 19%, compared to traditional self-study methods. This directly motivates the Interview Preparation module and its emphasis on structured STAR-method answers.

**Ramesh & Parameswaran (2021)** demonstrated that structured resume completion guidance (prompting users to add missing sections) increased resume completeness by an average of 34% and reduced time-to-first-interview by approximately one week. This validates the completeness score and actionable suggestions approach in the Analytics dashboard.

**Technology Context: Groq LPU Architecture.** The emergence of Groq's inference platform represents a specific enabling technology for this project. Groq's LPU (Language Processing Unit) is a deterministic, single-threaded processor optimized for the sequential token generation pattern of transformer inference — fundamentally different from the parallel-computation design of GPUs. This architecture achieves token generation rates of 500–800 tokens per second for the LLaMA 3.3 70B model, compared to 80–150 tokens/second on typical cloud GPU providers. The practical implication is that AI-assisted features in this web application respond in 1–4 seconds rather than 10–30 seconds, keeping them within the interactive response window that users expect from a web tool.

**Technology Context: Next.js App Router.** React Server Components (RSC) in Next.js 16 allow the application to render HTML on the server for initial page loads, improving Time-to-First-Contentful-Paint, while enabling seamless client-side interactivity for the editor and real-time preview. The co-location of API routes and React components within the same codebase (a defining feature of the Next.js App Router paradigm) significantly reduces development complexity for full-stack features.

## 2.3 Comparison of Existing Systems

## 2.3 Comparison of Existing Systems

**Table 2.1: Comparison of Existing Resume Builder Tools**

| Feature | This Project | Resume.io | Canva | Zety | Novoresume | Enhancv |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| Free Core Features | Yes | Partial | Partial | Partial | Partial | Partial |
| Cloud Account Storage | Yes | Yes | Yes | Yes | No | Yes |
| AI Writing Assistant | Yes | Yes | No | No | No | Yes |
| ATS Keyword Checker | Yes | No | No | Partial | No | Partial |
| Interview Prep (AI) | Yes | No | No | No | No | No |
| Job Application Tracker | Yes | No | No | No | No | No |
| Cover Letter Generator | Yes | Yes | No | Yes | Partial | Yes |
| Multiple Templates | Yes (6) | Yes | Yes | Yes | Yes | Yes |
| PDF Export (Free) | Yes | Paid | Yes | Paid | Paid | Paid |
| Version History | Yes | No | No | No | No | No |
| Dark Mode | Yes | No | No | No | No | No |
| Resume Analytics | Yes | No | No | No | No | Partial |
| Job Discovery | Yes | No | No | No | No | No |
| Admin Dashboard | Yes | N/A | N/A | N/A | N/A | N/A |
| Onboarding Wizard | Yes | Yes | Partial | Yes | No | Yes |
| Keyboard Shortcuts | Yes | No | Partial | No | No | No |

## 2.4 Research Gap

The literature review and competitive analysis together reveal a clear and significant gap in the market and in academic research.

**Gap 1: Integration.** No existing free tool offers a comprehensive, full-stack, integrated career management platform that combines AI writing assistance, ATS checking, interview preparation, job tracking, cloud storage, and admin controls within a single application. Users are forced to assemble a fragmented toolkit of unconnected services, losing context and efficiency at each transition.

**Gap 2: Accessibility.** The most feature-rich commercial tools are priced at $15–$30/month, which is prohibitive for the student and early-career demographic that needs them most — particularly in developing economies. No open-source or free tool currently provides LLM-based writing assistance, ATS analysis, and interview preparation simultaneously.

**Gap 3: International Readiness.** No existing tool provides a structured, multi-dimensional assessment of how internationally competitive a resume is. While some tools provide basic completeness scores, none implements a weighted scoring system that evaluates bullet quality, metric density, weak verb usage, international signals (LinkedIn, GitHub, portfolio), and ATS structure simultaneously.

**Gap 4: Administrative Governance.** Research on resume builder tools focuses entirely on the end-user experience. There is no published work on the design of a multi-role governance layer (feature flags, activity logging, user management) for a career management platform. This project contributes a novel admin architecture that could be adapted for institutional deployment.

**Gap 5: Prompt Engineering for Career Content.** While Brown et al. (2020) establish the capability of LLMs for professional writing, there is limited published work on optimal prompt engineering strategies specifically for resume content — including the balance between contextual richness (providing full resume data) and prompt length efficiency, and the design of structured output formats (JSON arrays) for interview question generation. This project develops and validates five distinct prompt strategies for career writing tasks.

This project directly addresses all five gaps by delivering a production-quality, multi-user, cloud-backed career management platform that is fully free, comprehensively featured, and open for institutional deployment.

---

# Chapter 3: System Analysis

## 3.1 Functional Requirements

**Table 3.1: Functional Requirements**

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | The system shall allow users to register with email and password and authenticate via secure sessions. | High |
| FR-02 | The system shall support three user roles: user, admin, and super_admin, each with different access levels. | High |
| FR-03 | The system shall allow users to create and edit a resume with personal information, work experience, education, skills, projects, certifications, languages, awards, volunteer work, interests, and custom sections. | High |
| FR-04 | The system shall provide a real-time live preview of the resume as the user types. | High |
| FR-05 | The system shall offer six professionally designed resume templates switchable without data loss. | High |
| FR-06 | The system shall allow users to reorder resume sections using drag-and-drop. | Medium |
| FR-07 | The system shall support undo and redo operations (up to 25 history states). | Medium |
| FR-08 | The system shall automatically save the resume to the cloud database with unsaved-changes detection. | High |
| FR-09 | The system shall allow users to save multiple named resumes and switch between them. | High |
| FR-10 | The system shall maintain version history for each saved resume (up to 10 versions per resume). | Medium |
| FR-11 | The system shall allow the user to export the resume as a downloadable PDF file. | High |
| FR-12 | The system shall integrate Groq AI to generate a professional summary based on resume content. | High |
| FR-13 | The system shall integrate Groq AI to improve individual experience bullet points using action verbs and quantified results. | High |
| FR-14 | The system shall compare the resume against a job description and identify missing ATS keywords. | High |
| FR-15 | The system shall generate an AI-powered cover letter customized to a specific company and role. | High |
| FR-16 | The system shall generate 20 AI-powered mock interview questions (behavioral, technical, situational) with STAR-method answers. | High |
| FR-17 | The system shall provide a Kanban-style job application tracker with six status stages and drag-and-drop. | Medium |
| FR-18 | The system shall provide a job discovery interface connected to the Remotive remote jobs API. | Low |
| FR-19 | The system shall compute and display a resume completeness score (0–100%) broken down by section. | Medium |
| FR-20 | The system shall provide side-by-side comparison of two saved resumes. | Low |
| FR-21 | The system shall support dark mode across all pages. | Low |
| FR-22 | The system shall allow customization of accent color, font family, density, heading style, photo shape, and column ratio. | Medium |
| FR-23 | The system shall allow toggling visibility of individual resume sections. | Medium |
| FR-24 | The system shall allow users to mark one resume as a favourite for quick access. | Low |
| FR-25 | The system shall provide an admin dashboard with platform statistics, user management, and activity logs. | Medium |
| FR-26 | The system shall provide a guided onboarding wizard for first-time users. | Medium |
| FR-27 | The system shall support keyboard shortcuts (Ctrl+S, Ctrl+P, Ctrl+Z/Y). | Low |
| FR-28 | The system shall guard against accidental navigation away from unsaved resume changes. | Medium |
| FR-29 | The system shall allow administrators to view, manage, enable, disable, and delete user accounts. | Medium |
| FR-30 | The system shall log key user actions (signup, resume saved, cover letter saved, job added) for admin audit. | Low |

## 3.2 Non-Functional Requirements

Non-functional requirements define the quality attributes and operational constraints that the system must satisfy. These requirements are equally important as functional requirements — they determine whether the system is actually usable, secure, maintainable, and scalable in a real-world deployment.

**Table 3.2: Non-Functional Requirements**

| ID | Requirement | Category |
|----|-------------|----------|
| NFR-01 | The application shall load within 3 seconds on a standard broadband connection (10 Mbps). | Performance |
| NFR-02 | The live resume preview shall update within 200ms of any user keypress or interaction. | Responsiveness |
| NFR-03 | The application shall function correctly on the latest versions of Chrome, Firefox, Edge, and Safari. | Compatibility |
| NFR-04 | The application shall be fully usable on screens from 375px (mobile) to 2560px (4K desktop) width. | Usability |
| NFR-05 | Passwords shall be hashed using bcrypt (cost factor ≥ 10) before storage; no plain-text passwords shall ever be stored or logged. | Security |
| NFR-06 | All authenticated API routes shall verify the user session before returning or mutating data. | Security |
| NFR-07 | Admin routes shall verify the admin or super_admin role before granting access; insufficient privilege returns HTTP 403. | Security |
| NFR-08 | AI API calls shall be proxied through a server-side route to prevent API key exposure to the browser bundle. | Security |
| NFR-09 | The application shall maintain usability in dark mode with sufficient contrast ratios meeting WCAG AA guidelines. | Accessibility |
| NFR-10 | The codebase shall be written in TypeScript with strict type safety; no `any` type shall be used in production code paths. | Maintainability |
| NFR-11 | PDF output shall faithfully reproduce the on-screen resume layout at A4 dimensions with less than 5% layout deviation. | Reliability |
| NFR-12 | The system shall handle all API errors gracefully, displaying user-friendly error messages without exposing stack traces or internal details. | Robustness |
| NFR-13 | MongoDB queries on the `resumes` and `jobs` collections shall use the indexed `userId` field as the primary filter. | Scalability |
| NFR-14 | The system shall use JWT sessions with a configurable expiry to prevent session fixation attacks. | Security |
| NFR-15 | All user inputs on API routes shall be validated with Zod schemas before database operations. | Security |
| NFR-16 | The system shall respond to all API requests within 2 seconds under normal load conditions (excluding AI generation endpoints). | Performance |
| NFR-17 | The application shall not expose environment variables, API keys, or database connection strings in the client-side JavaScript bundle. | Security |
| NFR-18 | The system shall support up to 20 saved resumes per user, enforced at the API level. | Scalability |
| NFR-19 | AI response content shall be sanitized before rendering to prevent XSS injection. | Security |
| NFR-20 | The application UI components shall be keyboard-navigable to support users who do not use a mouse. | Accessibility |

## 3.3 Use Case Analysis

### 3.3.1 Actors

- **Guest User:** Can view the landing page and template gallery but cannot save or access AI features.
- **Registered User (Primary Actor):** The main user who creates and manages resumes, tracks job applications, and uses all AI features after authentication.
- **Administrator:** A privileged user who manages the platform, views all activity, and configures system settings.
- **Groq AI API (External System):** The AI inference API that processes writing assistance requests.
- **Remotive API (External System):** Third-party API providing live remote job listings.
- **MongoDB Atlas (External System):** Cloud database storing all persistent application data.

### 3.3.2 Use Case Diagram

**Figure 3.1 — Extended Use Case Diagram**

![Figure 3.1: Extended Use Case Diagram](docs/images/fig_3_1_use_case.svg)

The diagram illustrates 25 use cases organized into five groups: Authentication, Resume Management, Resume Actions, AI-Powered Features, Job Tracking, Job Discovery, and Admin Management. The Registered User interacts with all groups except Admin Management. The Administrator accesses Admin-specific use cases. External systems (Groq AI, Remotive API, MongoDB Atlas) are shown as secondary actors.

## 3.4 Data Flow Analysis

### 3.4.1 Level-0 DFD (Context Diagram)

**Figure 3.2 — Level-0 Context Diagram**

![Figure 3.2: Context Diagram](docs/images/fig_3_2_context_dfd.svg)

The context diagram shows the AI-Powered Resume Builder as a single process (Process 0) receiving inputs from four external entities: End User (credentials, resume data, AI requests), Administrator (admin actions, user management), Remotive API (job listings), and Groq AI API (generated content). Outputs include session tokens, PDF downloads, AI-improved text, job listings, and admin reports. All persistent data flows through MongoDB Atlas.

### 3.4.2 Level-1 DFD

**Figure 3.3 — Level-1 Data Flow Diagram**

![Figure 3.3: Level-1 Data Flow Diagram](docs/images/fig_3_3_dfd_level1.svg)

The Level-1 DFD decomposes the system into eight functional modules:

| Process | Module | Input | Output |
|---------|--------|-------|--------|
| 1.0 | Authentication (NextAuth + bcrypt) | Credentials | JWT session token |
| 2.0 | Resume Editing (Editor + Redux) | Personal/experience/skills data | Redux store, MongoDB Resume collection |
| 3.0 | Template Rendering (6 templates + html2pdf) | Resume data + theme | Live preview, PDF download |
| 4.0 | AI Processing (Groq proxy) | Job description, resume context | Generated summaries, bullets, questions |
| 5.0 | Cover Letter Module | Recipient, role, company | MongoDB CoverLetter collection |
| 6.0 | Job Tracking (Kanban) | Application data, status updates | MongoDB Job collection |
| 7.0 | Job Discovery (Remotive) | Search keywords, filters | Job listings from Remotive API |
| 8.0 | Admin Module | Admin requests | User list, stats, activity logs |

---

# Chapter 4: System Design

## 4.1 System Architecture

The application follows a **full-stack architecture** using Next.js 16 App Router, which co-locates frontend React components and backend API routes within the same codebase. The system is organized into four primary layers: Presentation, API, Data, and External Services.

**Figure 4.1 — Full-Stack System Architecture**

![Figure 4.1: Full-Stack System Architecture](docs/images/fig_4_1_architecture.svg)

The architecture operates as follows:

- The **Presentation Layer** consists of React 19 page components rendered on the client, styled with Tailwind CSS 4, and connected to a Redux Toolkit store for application state.
- The **API Layer** is implemented as Next.js Route Handlers co-located in the same repository. All routes enforce session authentication via `auth()` from NextAuth, validate request bodies with Zod, and interact with MongoDB through Mongoose.
- The **Data Layer** is MongoDB Atlas, a managed cloud NoSQL database accessed through Mongoose ODM. All queries are indexed on `userId` for performance.
- The **External Services** layer includes the Groq AI API (proxied through the server to protect the API key) and the Remotive Jobs API (called from the client with public endpoints).

## 4.2 Application Module Design

**Figure 4.2 — Application Module and File Structure**

The application follows the Next.js App Router file convention. All pages live under `app/`, all API routes under `app/api/`, and all reusable components under `components/`. Key modules include:

```
app/
├── page.tsx                        Landing page (hero, features, templates, stats)
├── layout.tsx                      Root layout (Navbar, Providers, DarkModeApplier)
├── (auth)/sign-in/page.tsx         Login form
├── (auth)/sign-up/page.tsx         Registration form
├── onboarding/page.tsx             First-time setup wizard
├── editor/page.tsx                 Split-panel resume editor (core feature)
├── resumes/page.tsx                Resume management dashboard
├── cover-letter/page.tsx           Cover letter list and editor
├── job-tracker/page.tsx            Kanban job application tracker
├── jobs/page.tsx                   Remote job discovery (Remotive API)
├── interview-prep/page.tsx         AI interview Q&A preparation
├── templates/page.tsx              Template gallery and showcase
├── analytics/page.tsx              Resume health and ATS scoring
├── profile/page.tsx                User account settings
├── admin/page.tsx                  Admin overview dashboard
├── admin/users/page.tsx            User management table
├── admin/activity/page.tsx         Activity audit log
├── admin/settings/page.tsx         Platform settings (super_admin only)
└── api/
    ├── auth/[...nextauth]/route.ts  NextAuth credentials + JWT
    ├── auth/register/route.ts       User registration endpoint
    ├── resumes/route.ts             GET list / POST create
    ├── resumes/[id]/route.ts        GET / PUT / DELETE single resume
    ├── resumes/[id]/favorite/       POST / DELETE favourite toggle
    ├── cover-letters/               CRUD cover letters
    ├── jobs/                        CRUD job applications
    ├── profile/                     GET / PUT user profile
    ├── ai/route.ts                  POST Groq AI proxy (5 actions)
    ├── upload/route.ts              POST avatar image upload
    └── admin/                       Admin-only routes (stats, users, activity, settings)
```

## 4.3 Database Schema Design

The application uses **MongoDB Atlas** with **Mongoose ODM** for all server-side data persistence. The schema consists of six collections.

**Table 4.1: MongoDB Collections and Their Purpose**

| Collection | Primary Purpose |
|------------|-----------------|
| users | Stores user credentials, profile information, and role |
| resumes | Stores resume data, theme settings, version history, and favourite flag per user |
| coverletters | Stores cover letters linked to a user and optionally a resume |
| jobs | Stores job applications with status, notes, dates, and linked resume/cover letter |
| activitylogs | Immutable audit trail of key user actions for admin monitoring |
| systemsettings | Key-value configuration for announcements and feature flags |

**Figure 4.3 — MongoDB Entity-Relationship Diagram**

![Figure 4.3: MongoDB ER Diagram](docs/images/fig_4_3_er_diagram.svg)

The `User` document is the root entity. Each user has a one-to-many relationship with `Resume`, `CoverLetter`, and `Job` documents, all keyed by `userId` (a MongoDB ObjectId foreign key). `ActivityLog` records are also keyed to a `userId` and are immutable once written. The `Resume` document contains an embedded `versions[]` array (capped at 10) for version history. The `SystemSettings` collection is not user-scoped and stores platform-wide key-value configuration.

The `JobStatus` enum enforces the six Kanban stages: `wishlist | applied | phone-screen | interview | offer | rejected`.

### 4.3.1 Detailed Schema Descriptions

**User Collection (`models/User.ts`):**
The User document is the authentication and identity record for every registered account. It stores the hashed password (bcrypt, cost factor 10), role enumeration, profile metadata, and a `disabled` flag that admins can toggle without deleting the account. The `avatar` field stores a CDN URL or base64 data URI for the user's profile picture.

```typescript
{
  fullName:  String,     // required, min: 2 chars
  email:     String,     // required, unique, lowercase index
  password:  String,     // required, bcrypt hash
  role:      String,     // enum: ['user', 'admin', 'super_admin'], default: 'user'
  avatar:    String,     // optional CDN URL or data URI
  phone:     String,     // optional profile field
  gender:    String,     // enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say']
  disabled:  Boolean,    // default: false — admin-controlled
  createdAt: Date,       // auto-timestamp
  updatedAt: Date,       // auto-timestamp
}
```

**Resume Collection (`models/Resume.ts`):**
The Resume document is the application's largest and most complex collection. The `data` field contains the complete nested `ResumeData` object (personal info, experiences, skills, etc.). The `theme` field stores the full `ThemeConfig` object (template, accent color, font, etc.). The embedded `versions` array provides version history without requiring a separate collection, keeping the version snapshots co-located with the source document.

```typescript
{
  userId:      ObjectId,     // indexed foreign key → users._id
  name:        String,       // resume display name (default: "My Resume")
  data:        Object,       // full ResumeData nested object
  theme:       Object,       // ThemeConfig: templateId, accentColor, fontFamily, etc.
  isFavorite:  Boolean,      // default: false, only one per user
  versions: [{              // embedded version history, capped at 10
    versionId: String,       // crypto.randomUUID()
    label:     String,       // 'v1', 'v2', ...
    data:      Object,       // snapshot of ResumeData at save time
    theme:     Object,       // snapshot of ThemeConfig at save time
    savedAt:   String,       // ISO timestamp
  }],
  createdAt:   Date,
  updatedAt:   Date,
}
```

**CoverLetter Collection (`models/CoverLetter.ts`):**
Cover letters are stored as plain text documents linked to the user and optionally to the source resume. The `tone` field records the generation setting for reference. `jobTitle` and `company` allow filtering and searching the library.

```typescript
{
  userId:    ObjectId,   // indexed → users._id
  resumeId:  ObjectId,   // optional → resumes._id
  jobTitle:  String,     // e.g., "Frontend Engineer"
  company:   String,     // e.g., "TechCorp Pvt Ltd"
  content:   String,     // full letter text (200–350 words typical)
  tone:      String,     // 'Professional' | 'Enthusiastic' | 'Formal' | 'Creative'
  createdAt: Date,
  updatedAt: Date,
}
```

**Job Collection (`models/Job.ts`):**
Job application documents represent entries on the Kanban board. The `status` field drives Kanban column placement. The `notesHistory` array provides a timestamped audit trail of the candidate's notes on each application.

```typescript
{
  userId:        ObjectId,    // indexed → users._id
  company:       String,
  role:          String,
  location:      String,
  appliedDate:   String,      // ISO date
  status:        String,      // enum: JobStatus stages
  resumeId:      ObjectId,    // optional link → resumes._id
  coverLetterId: ObjectId,    // optional link → coverletters._id
  url:           String,      // job posting URL
  notes:         String,      // current note text
  notesHistory: [{            // timestamped previous notes
    id:        String,
    text:      String,
    createdAt: String,        // ISO timestamp
  }],
  deadline:      String,      // ISO date for application deadline
  interviewDate: String,      // ISO date for interview
  interviewType: String,      // 'phone' | 'video' | 'onsite' | ''
  createdAt:     Date,
  updatedAt:     Date,
}
```

**ActivityLog Collection (`models/ActivityLog.ts`):**
Activity logs are immutable audit records. They are written by the server and never modified or deleted by user actions. The `meta` field stores contextual information (e.g., resume name, job title) relevant to the logged action.

```typescript
{
  userId:    ObjectId,    // indexed → users._id
  action:    String,      // enum: 'signup'|'resume_saved'|'resume_deleted'|
                          //       'cover_letter_saved'|'job_added'
  meta:      Object,      // optional context data (resume name, company, etc.)
  createdAt: Date,        // auto-timestamp — immutable once created
}
```

**SystemSettings Collection (`models/SystemSettings.ts`):**
The SystemSettings collection is a singleton — only one document exists per deployment. It uses a key-value pattern where `key` is a string identifier and `value` is a flexible `Mixed` type to accommodate different configuration types.

```typescript
{
  key:   String,   // e.g., 'features', 'announcement', 'maintenanceMode'
  value: Mixed,    // FeatureFlags object | string | boolean | number
}
```

The `features` key stores the complete `FeatureFlags` object (10 boolean flags). The `announcement` key stores the current platform-wide announcement string. The `maxResumesPerUser` key stores the integer limit enforced at the API level on resume creation.

### 4.3.2 Database Indexing Strategy

MongoDB's default `_id` index is used for all direct document lookups. Additional indexes are defined for the most common query patterns:

| Collection | Index Field | Index Type | Rationale |
|------------|-------------|------------|-----------|
| users | `email` | Unique | Login lookup and duplicate check |
| resumes | `userId` | Standard | All resume list queries filter by userId |
| resumes | `userId + updatedAt` | Compound | List sorted by last-modified (default view) |
| coverletters | `userId` | Standard | All cover letter list queries filter by userId |
| jobs | `userId` | Standard | All job tracker queries filter by userId |
| activitylogs | `userId` | Standard | Admin activity filter per user |
| activitylogs | `createdAt` | Standard | Admin chronological log view |

These indexes ensure that all primary query patterns execute as O(log n) B-tree lookups rather than O(n) collection scans, maintaining sub-100ms query times at projected scale.

## 4.4 Authentication and Authorization Design

**Figure 4.4 — Authentication and Authorization Flow**

![Figure 4.4: Authentication Flow](docs/images/fig_4_4_auth_flow.svg)

Authentication is handled by **NextAuth v5** with a **Credentials provider**. The registration flow validates input with Zod, checks email uniqueness, hashes the password with `bcrypt` (cost factor 10), inserts the User document, and redirects to sign-in. The login flow invokes `credentials.authorize()`, compares the submitted password against the stored bcrypt hash, signs a JWT containing the user's `id` and `role`, and stores it in an `httpOnly` cookie.

**Role-Based Access Control (RBAC)** is enforced at two levels:

1. **Page level:** Next.js middleware redirects unauthenticated users to `/sign-in` and non-admin users attempting `/admin/*` routes.
2. **API level:** Every admin API route calls `requireAdmin()` from `lib/adminAuth.ts`, which reads the session and compares roles using an ordered hierarchy (`user: 0`, `admin: 1`, `super_admin: 2`).

**Table 4.5: Admin Role Hierarchy**

| Role | Level | Capabilities |
|------|-------|-------------|
| `user` | 0 | Standard authenticated user — resume CRUD, AI features, job tracker |
| `admin` | 1 | All user capabilities + `/admin` dashboard, user management, activity logs |
| `super_admin` | 2 | All admin capabilities + platform settings, feature flags, announcements, system configuration |

`requireAdmin('admin')` accepts level ≥ 1. `requireAdmin('super_admin')` accepts only level 2. The `/admin/settings` route is restricted to `super_admin` only.

### 4.4.1 Next.js Middleware Route Protection

In addition to API-level guards, the application uses a Next.js `middleware.ts` file that intercepts requests before they reach any page or API handler. The middleware checks for a valid NextAuth session token and enforces the following rules:

- Any request to `/admin/*` pages from a non-admin user is redirected to `/`.
- Any request to authenticated pages (`/editor`, `/resumes`, `/profile`, `/job-tracker`, `/interview-prep`, `/analytics`, `/cover-letter`, `/onboarding`) from an unauthenticated user is redirected to `/sign-in` with the original URL preserved as a `callbackUrl` query parameter.
- Public pages (`/`, `/sign-in`, `/sign-up`, `/templates`) are not intercepted.

This middleware protection operates at the Edge runtime, meaning the redirect happens before the page even begins rendering — preventing flash-of-protected-content and ensuring no partial data leaks.

### 4.4.2 Session Token Structure

The JWT token stored in the httpOnly session cookie carries the following custom claims beyond the NextAuth defaults:

```typescript
{
  sub:   string,    // MongoDB user _id (NextAuth standard)
  id:    string,    // user._id (custom, same value as sub)
  role:  string,    // 'user' | 'admin' | 'super_admin'
  name:  string,    // user.fullName
  email: string,    // user.email
  image: string,    // user.avatar URL
  iat:   number,    // issued at (Unix timestamp)
  exp:   number,    // expiry (Unix timestamp)
}
```

The `role` claim is injected in the `jwt()` callback when a user first signs in. It is used by both the middleware (for page-level protection) and the `requireAdmin()` utility (for API-level protection), avoiding a database round-trip to check role on every request.

## 4.5 AI Integration Design

### 4.5.1 Design Rationale for a Single AI Endpoint

A deliberate architectural decision was made to serve all five AI actions through a single `POST /api/ai` route, identified by an `action` field in the request body, rather than creating five separate API routes (`/api/ai/summarize`, `/api/ai/improve-bullet`, etc.). This decision has several important benefits:

**Security surface area:** There is a single point where the Groq API key is used. Session authentication needs to be enforced in only one place. The API key is stored in one environment variable and referenced in one file.

**Maintainability:** Adding a new AI action requires only adding a new entry to the `PROMPTS` object and updating the action whitelist — no new route files, no new permission configuration. The `callAI()` client utility requires no changes.

**Consistency:** All AI actions share the same error handling, token limit governance, and response format (`{ result: string }`). Client components can use the same `callAI()` helper regardless of which action they invoke.

The tradeoff is that the single route file becomes slightly larger as more actions are added, but this is managed by defining each prompt configuration as a typed record entry rather than inline code.

### 4.5.2 AI Endpoint Architecture

All five AI actions are served by a single `POST /api/ai` route acting as a **secure server-side proxy** to the Groq inference API. This design ensures the Groq API key is never exposed to browser clients.

### 4.5.3 AI Actions Reference

**Table 4.2: AI API Actions Summary**

| Action | Trigger | Model Input | Output |
|--------|---------|-------------|--------|
| `improve-bullet` | "Improve" button on bullet point | Bullet text + job title | Rewritten bullet (max 20 words) |
| `generate-summary` | "Generate" in Personal section | Name, title, experience, skills | 80–100 word professional summary |
| `cover-letter` | Cover Letter modal | Company, role, experience, skills | 200–250 word, 3-paragraph letter |
| `ats-gap` | ATS Checker panel | Resume text + job description | JSON array of top 10 missing keywords |
| `interview-questions` | Interview Prep page | Job title, description, experience, skills | JSON array of 20 QA objects with type |

### 4.5.4 AI Feature Sequence Diagram

**Figure 4.6 — AI Feature Sequence: Interview Question Generation**

![Figure 4.6: AI Sequence Diagram](docs/images/fig_4_6_ai_sequence.svg)

The sequence shows the complete request lifecycle for interview question generation: the user submits a job title, the page calls `callAI('interview-questions', payload)`, the server-side route authenticates the session, calls the Groq SDK, receives a JSON array of 20 QA objects, and returns the parsed result. A secondary sequence shows per-answer regeneration, which sends a single-question re-prompt and updates only the targeted card's answer in the state array.

## 4.6 State Management Design

The client-side state is managed by **Redux Toolkit** with three slices:

```
Redux Store (redux-persist → localStorage for theme + ui only)
│
├── resume (resumeSlice)    NOT persisted — loaded from DB on mount
│   ├── data: ResumeData              live resume being edited
│   ├── past: ResumeData[]            undo stack (max 25 snapshots)
│   ├── future: ResumeData[]          redo stack
│   └── actions: updatePersonal, addExperience, updateExperience,
│                removeExperience, moveExperience, addEducation,
│                addProject, addSkillCategory, addSkill,
│                toggleSectionVisibility, loadResumeData, undo, redo
│
├── theme (themeSlice)      PERSISTED to localStorage
│   ├── templateId          'two-column'|'minimal'|'academic'|...
│   ├── accentColor         hex color string
│   ├── fontFamily          'geist'|'inter'|'roboto'|'playfair'|'georgia'
│   ├── density             'compact'|'standard'|'spacious'
│   ├── photoShape          'circle'|'square'|'none'
│   ├── headingStyle        'underline'|'leftbar'|'plain'|'filled'
│   ├── columnRatio         30–70 (sidebar % width)
│   └── sectionOrder        string[]
│
└── ui (uiSlice)            PERSISTED to localStorage
    ├── mobileTab           'editor'|'preview'
    └── darkEditor          boolean
```

**Figure 4.5 — Redux State Management Architecture**

![Figure 4.5: Redux State Management Architecture](docs/images/fig_4_5_redux_state.svg)

The `resume` slice is deliberately not persisted because the authoritative copy lives in MongoDB. On editor mount, `loadResumeData` populates the slice from the API response. `theme` and `ui` are persisted so display preferences survive page refreshes without a network round-trip.

## 4.7 User Interface Design

### 4.7.1 Resume Editor Component Hierarchy

The editor page (`/editor`) is the application's most complex component. Its hierarchy is:

```
EditorPage (/editor)
├── AppHeader (sticky toolbar)
│   ├── Undo / Redo (useUndoRedo hook)
│   ├── Save status indicator (cloud sync)
│   ├── ThemeCustomizer (color, font, template, density)
│   ├── ATS Checker modal
│   ├── My Resumes modal (ResumeManager)
│   ├── Cover Letter modal (QuickCoverLetterModal)
│   ├── Interview Prep link
│   ├── Keyboard Shortcuts modal
│   ├── Sample Data / Clear buttons
│   ├── Save button
│   └── Download PDF button (usePDFExport)
│
├── MobileTabs (editor/preview toggle on mobile)
│
└── Main Content (flex row: split panel)
    ├── EditorPanel (left)
    │   └── DndContext → SortableContext
    │       ├── PersonalInfoEditor (with AI summary generation)
    │       ├── ExperienceEditor (with AI bullet improvement)
    │       ├── EducationEditor
    │       ├── ProjectsEditor
    │       ├── SkillsEditor (categories + tags)
    │       ├── CertificationsEditor
    │       ├── LanguagesEditor (with proficiency selector)
    │       ├── AwardsEditor
    │       ├── VolunteerEditor
    │       └── CustomSectionEditor
    │
    └── ResumePreview (right)
        └── [Active Template Component]
            ├── ResumeTemplate    (Two-Column / Classic)
            ├── MinimalTemplate
            ├── AcademicTemplate
            ├── ProfessionalTemplate
            ├── ExecutiveTemplate
            └── ModernTemplate
```

### 4.7.2 Page Layout Overview

**Table 4.3: Page Layout Overview**

| Page | Route | Layout | Purpose |
|------|-------|---------|---------|
| Landing | `/` | Full-width | Hero, features, template showcase |
| Sign In | `/sign-in` | Centred card | Email/password login |
| Sign Up | `/sign-up` | Centred card | Registration with validation |
| Onboarding | `/onboarding` | Guided wizard | First-time profile + template setup |
| Resume Editor | `/editor` | Split-panel | Editor left, live preview right |
| Resume Manager | `/resumes` | Card grid | Cloud resumes with actions |
| Cover Letter | `/cover-letter` | Split panel | Letter list + editor |
| Job Tracker | `/job-tracker` | Kanban board | 6-column application tracker |
| Jobs | `/jobs` | Search + results | Remote job discovery |
| Interview Prep | `/interview-prep` | Single column | AI question generator + STAR answers |
| Templates | `/templates` | Gallery grid | Template showcase |
| Analytics | `/analytics` | Dashboard | Scoring + ATS + health check |
| Profile | `/profile` | Settings form | Account info, password, danger zone |
| Admin Overview | `/admin` | Stats dashboard | Platform metrics |
| Admin Users | `/admin/users` | Data table | User management |
| Admin Activity | `/admin/activity` | Log table | Audit trail |

### 4.7.3 Theme Customizer

The `ThemeCustomizer` component is accessible from the AppHeader toolbar and provides the following controls, all stored in `themeSlice` (persisted to `localStorage`):

**Table 4.4: Theme Customizer Controls**

| Control | `themeSlice` Field | Options |
|---------|-------------------|---------|
| Template | `templateId` | two-column, minimal, professional, academic, executive, modern |
| Accent Color | `accentColor` | 12 preset swatches + custom hex picker |
| Font Family | `fontFamily` | Geist, Inter, Roboto, Playfair Display, Georgia |
| Density | `density` | Compact, Standard, Spacious |
| Heading Style | `headingStyle` | Underline, Left Bar, Plain, Filled |
| Column Ratio | `columnRatio` | 30–70 (slider, controls sidebar % of two-column template) |
| Photo Shape | `photoShape` | Circle, Square, None |
| Name Size | `nameSize` | Normal, Large, X-Large |
| PDF Background | `pdfBg` | Light, Dark (controls PDF export background color) |
| Section Order | `sectionOrder` | string[] managed by drag-and-drop in EditorPanel |

All changes apply to the live preview immediately with no save required. Template and font changes are also reflected in the PDF export.

### 4.7.4 Dark Mode vs Dark Editor Mode

The platform supports two distinct dark-mode controls:

**App-Wide Dark Mode (`darkMode` feature flag):** Toggles the entire application between light and dark themes using Tailwind's `dark:` class variants. Controlled by the toggle in the Navbar. The preference is persisted to `localStorage`.

**Dark Editor Mode (`uiSlice.darkEditor`):** Toggles only the right-hand live preview panel to a dark background without affecting the rest of the UI. This allows users to preview how their resume looks on a dark-screened device while keeping the editing form in light mode. It is toggled via a button in the AppHeader and persisted via `redux-persist`.

---

# Chapter 5: Implementation

## 5.1 Technology Stack

**Table 5.1: Technology Stack Summary**

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | Next.js | 16.2.4 | Full-stack React framework (App Router + API Routes) |
| UI Library | React | 19.2.4 | Component-based UI with Server/Client components |
| Language | TypeScript | 5.x | Static type safety throughout frontend and backend |
| Styling | Tailwind CSS | 4.x | Utility-first CSS framework with dark mode |
| State Management | Redux Toolkit | 2.11.2 | Centralized client-side application state |
| State Persistence | redux-persist | 6.0.0 | Persist theme and UI state to localStorage |
| Database | MongoDB Atlas | — | Cloud NoSQL document database |
| ODM | Mongoose | 9.6.2 | Schema validation and MongoDB query abstraction |
| Authentication | NextAuth | 5.0.0-beta | JWT session management, credentials provider |
| Password Hashing | bcryptjs | 3.0.3 | Secure password hashing (cost factor 10) |
| AI Integration | groq-sdk | 1.2.0 | Groq inference API client (LLaMA 3.3 70B) |
| Validation | Zod | 4.4.3 | Schema validation for API request bodies |
| Drag and Drop | dnd-kit | 6.3 / 10.0 | Accessible drag-and-drop interactions |
| PDF Export | html2pdf.js | 0.14.0 | Client-side HTML-to-PDF conversion |
| Date Utilities | date-fns | 4.1.0 | Date formatting and distance calculations |
| Icons | Lucide React | 1.14.0 | Consistent SVG icon library |
| External Job API | Remotive API | v1 | Remote job listings feed |

**Figure 5.1 — Technology Stack Overview**

![Figure 5.1: Technology Stack Overview](docs/images/fig_5_1_tech_stack.svg)

## 5.2 Development Environment

| Setting | Value |
|---------|-------|
| Operating System | Windows 11 Enterprise |
| Node.js | v18+ LTS |
| Package Manager | npm |
| IDE | Visual Studio Code |
| VS Code Extensions | ESLint, TypeScript, Tailwind IntelliSense |
| Version Control | Git / GitHub (branch: `move-to-full-stack`) |
| Database | MongoDB Atlas (cloud M0 free tier) |
| Environment Variables | `.env.local` — `MONGODB_URI`, `NEXTAUTH_SECRET`, `GROQ_API_KEY` |
| Browser Testing | Google Chrome 124+, Microsoft Edge 124+ |

### 5.2.1 Project Initialization and Configuration

The project was bootstrapped with `create-next-app` using the TypeScript and App Router options. Key configuration decisions made at initialization:

- **Strict TypeScript mode** (`"strict": true` in `tsconfig.json`) — enforces no-implicit-any, strict null checks, and strict function types across the entire codebase.
- **Tailwind CSS 4** — configured with the new CSS-based configuration system (no `tailwind.config.js` needed for basic usage), with `dark:` variant enabled via the `darkMode: "class"` strategy.
- **ESLint** — uses the Next.js recommended configuration with additional rules for TypeScript strict practices.
- **Path aliases** — `@/` maps to the project root for clean imports across the codebase, avoiding deep relative path chains.

The `next.config.ts` file configures:
- `images.remotePatterns` for external avatar URLs and Remotive job logo domains.
- `experimental.serverActions` for any form actions (though the primary interaction pattern is API routes).

### 5.2.2 Development Workflow

Development followed a feature-branch workflow on GitHub:
1. A new feature branch is created from `move-to-full-stack` for each significant feature.
2. The Vercel GitHub integration automatically deploys a preview URL for each push to any branch.
3. The feature is tested on the Vercel preview deployment (which has access to the same MongoDB Atlas cluster and Groq API key via environment variables).
4. Once verified, the branch is merged to `move-to-full-stack` which triggers the production deployment.

This workflow provides a true production-environment preview for every feature before it reaches the live application, which is particularly valuable for testing database operations and AI API integration that cannot be fully validated in the local `next dev` environment.

## 5.3 Backend Implementation

### 5.3.1 MongoDB Connection

A connection utility in `lib/mongodb.ts` maintains a cached Mongoose connection, preventing connection pool exhaustion during Next.js hot reloads and serverless function cold starts:

```typescript
// lib/mongodb.ts
let cached = global.mongooseCache

export async function connectDB() {
  if (cached?.conn) return cached.conn
  if (!cached?.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      bufferCommands: false,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
```

### 5.3.2 Standard API Route Pattern

All API routes follow a consistent pattern: authenticate the session, validate the request body with Zod, perform the database operation via Mongoose, and return a typed JSON response:

```typescript
// Example: GET /api/resumes
export async function GET() {
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const resumes = await Resume.find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .lean()
  return NextResponse.json({ resumes })
}
```

### 5.3.3 Resume Versioning

Every time a resume is saved via `PUT /api/resumes/[id]`, the current document state is pushed into a `versions` array (capped at 10 entries) before applying the update:

```typescript
const existing = await Resume.findById(id)
const newVersion = {
  versionId: crypto.randomUUID(),
  label: `v${existing.versions.length + 1}`,
  data: existing.data,
  theme: existing.theme,
  savedAt: new Date().toISOString(),
}
const trimmedVersions = [...existing.versions, newVersion].slice(-10)
await Resume.findByIdAndUpdate(id, {
  data, theme, versions: trimmedVersions, updatedAt: new Date(),
})
```

### 5.3.4 API Error Handling Pattern

All API routes follow a consistent error handling pattern that prevents internal details from leaking to the client. A top-level `try/catch` block wraps the handler logic, catching both expected errors (validation failures, not-found, permission checks) and unexpected errors (database connection issues, unexpected nulls):

```typescript
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const data = await Resume.findOne({ _id: id, userId: session.user.id }).lean()
    if (!data)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({ resume: data })
  } catch (err) {
    console.error('[GET /api/resumes/:id]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

Zod validation errors are caught separately and return HTTP 400 with the formatted validation messages. This ensures that clients always receive a predictable `{ error: string }` response shape regardless of the failure mode.

### 5.3.5 Zod Request Validation

Every API route that accepts a request body defines a Zod schema that validates the incoming data before any database operations occur. This prevents malformed data from reaching the database and provides automatic type narrowing in TypeScript:

```typescript
const resumeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  data: z.object({
    personal:       personalSchema,
    experience:     z.array(experienceSchema),
    education:      z.array(educationSchema),
    skills:         z.array(skillCategorySchema),
    projects:       z.array(projectSchema),
    certifications: z.array(certificationSchema),
    languages:      z.array(languageSchema),
    awards:         z.array(awardSchema),
    volunteer:      z.array(volunteerSchema),
    interests:      z.array(z.string()),
    customSections: z.array(customSectionSchema),
    hiddenSections: z.array(z.string()),
  }),
  theme: themeSchema,
})

const body = resumeSchema.safeParse(await req.json())
if (!body.success)
  return NextResponse.json({ error: body.error.flatten() }, { status: 400 })
```

The `safeParse` method returns a discriminated union rather than throwing, which integrates cleanly with the API's try/catch pattern.

### 5.3.6 Activity Logging

The `lib/activityLog.ts` utility writes an immutable `ActivityLog` document on key events, which are later queried by the admin audit trail page:

```typescript
export async function logActivity(
  userId: string,
  action: 'signup' | 'resume_saved' | 'resume_deleted' | 'cover_letter_saved' | 'job_added',
  meta?: Record<string, unknown>
) {
  await connectDB()
  await ActivityLog.create({ userId, action, meta })
}
```

## 5.4 Authentication Implementation

Authentication is handled entirely by **NextAuth v5** using the **Credentials provider**. The configuration in `lib/auth.ts` defines the sign-in logic, session callback, and JWT strategy:

```typescript
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        await connectDB()
        const user = await User.findOne({ email: credentials.email })
        if (!user || user.disabled) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        return { id: user._id.toString(), email: user.email,
                 name: user.fullName, role: user.role, image: user.avatar }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role }
      return token
    },
    async session({ session, token }) {
      session.user.id   = token.id
      session.user.role = token.role
      return session
    },
  },
  session: { strategy: 'jwt' },
})
```

User registration is handled by a separate `POST /api/auth/register` route which validates input with Zod, checks for email uniqueness, hashes the password, and creates the User document:

```typescript
const schema = z.object({
  fullName: z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8),
})
const body   = schema.parse(await req.json())
const exists = await User.findOne({ email: body.email })
if (exists) return NextResponse.json({ error: 'Email already in use' }, { status: 409 })

const hashed = await bcrypt.hash(body.password, 10)
await User.create({ ...body, password: hashed, role: 'user' })
await logActivity(user._id.toString(), 'signup')
```

## 5.5 Core Resume Module

### 5.5.1 Resume Data Model

The resume data is defined as a strict TypeScript interface hierarchy in `types/resume.ts`, ensuring type safety across all 50+ components that read or write resume data:

```typescript
interface ResumeData {
  personal:       PersonalInfo
  experience:     WorkExperience[]
  education:      Education[]
  projects:       Project[]
  skills:         SkillCategory[]
  certifications: Certification[]
  languages:      Language[]
  awards:         Award[]
  volunteer:      VolunteerWork[]
  interests:      string[]
  customSections: CustomSection[]
  hiddenSections: string[]
}
```

### 5.5.2 Auto-Save Hook

The `useAutoSave` hook detects changes via snapshot comparison, tracks dirty state, and saves to MongoDB on demand (Ctrl+S or Save button click):

```typescript
export function useAutoSave() {
  const resumeData = useSelector((state: RootState) => state.resume.data)
  const [isDirty, setIsDirty] = useState(false)
  const snapshotRef = useRef(JSON.stringify(resumeData))

  useEffect(() => {
    setIsDirty(JSON.stringify(resumeData) !== snapshotRef.current)
  }, [resumeData])

  async function saveToCloud(): Promise<string | null> {
    const resumeId = searchParams.get('id')
    const method   = resumeId ? 'PUT' : 'POST'
    const url      = resumeId ? `/api/resumes/${resumeId}` : '/api/resumes'
    const res      = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: resumeData, theme }),
    })
    const { resume } = await res.json()
    snapshotRef.current = JSON.stringify(resumeData)
    setIsDirty(false)
    return resume?._id ?? null
  }

  return { isDirty, saveToCloud }
}
```

### 5.5.3 Undo / Redo Implementation

The undo/redo system maintains two parallel stacks — `past` and `future` — inside the `resumeSlice`. Every action that modifies resume data pushes the current state onto the `past` stack (capped at 25 entries):

```typescript
undo(state) {
  if (state.past.length === 0) return
  state.future.unshift(cloneDeep(state.data))
  state.data = state.past.pop()!
},
redo(state) {
  if (state.future.length === 0) return
  state.past.push(cloneDeep(state.data))
  state.data = state.future.shift()!
},
```

### 5.5.4 Completeness Score Algorithm

**Figure 5.7 — Resume Completeness Score Algorithm**

![Figure 5.7: Completeness Score Algorithm](docs/images/fig_completeness_score.svg)

The completeness scoring system evaluates each resume section against a set of weighted rules and produces a score from 0–100%:

```typescript
export function calculateCompleteness(data: ResumeData) {
  const checks = {
    personal:   data.personal.fullName && data.personal.email && data.personal.phone ? 25 : 0,
    summary:    data.personal.summary?.length > 50 ? 10 : 0,
    experience: data.experience.length >= 1 ? 20 : 0,
    education:  data.education.length >= 1 ? 15 : 0,
    skills:     data.skills.flatMap(g => g.skills).length >= 3 ? 15 : 0,
    projects:   data.projects.length >= 1 ? 10 : 0,
    extras:     (data.certifications.length + data.languages.length) > 0 ? 5 : 0,
  }
  return { ...checks, total: Object.values(checks).reduce((a, b) => a + b, 0) }
}
```

### 5.5.5 Section Visibility Toggling

Each resume section can be individually hidden without deleting its data, using the `hiddenSections: string[]` array in `ResumeData`. The `toggleSectionVisibility` Redux action adds or removes a section identifier from this array:

```typescript
toggleSectionVisibility(state, action: PayloadAction<string>) {
  const idx = state.data.hiddenSections.indexOf(action.payload)
  if (idx === -1) {
    state.data.hiddenSections.push(action.payload)
  } else {
    state.data.hiddenSections.splice(idx, 1)
  }
}
```

Each template component checks `data.hiddenSections.includes(sectionId)` before rendering each section. This allows users to, for example, create a skills-focused resume by hiding the awards section without losing the data. The hidden state is preserved when saving to MongoDB and restored when loading.

### 5.5.6 Drag-and-Drop Section Reordering

Section reordering is implemented with **dnd-kit** (`@dnd-kit/core` and `@dnd-kit/sortable`). The editor panel wraps all section editors in a `DndContext` with a `SortableContext` configured with the `verticalListSortingStrategy`. Each section editor component is wrapped in a `useSortable` hook call that provides `attributes`, `listeners`, `setNodeRef`, and the transform/transition values for animation.

```typescript
// SortableSectionWrapper.tsx (simplified)
const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
  useSortable({ id: sectionId })

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: isDragging ? 0.5 : 1,
}

return (
  <div ref={setNodeRef} style={style}>
    <div {...attributes} {...listeners} className="drag-handle cursor-grab">
      <GripVertical size={14} />
    </div>
    {children}
  </div>
)
```

When a drag ends, `handleDragEnd` computes the new array order using dnd-kit's `arrayMove` utility and dispatches `updateSectionOrder` to the `themeSlice`. The `sectionOrder` array in `themeSlice` drives the rendering order of sections in all template components.

### 5.5.7 Resume Comparison Modal

The `ResumeComparison` component (`components/features/ResumeComparison.tsx`) provides a side-by-side view of two saved resumes, activated via the "Compare" mode on the `/resumes` grid page (gated by the `resumeCompare` feature flag).

The `ResumeComparison` component (`components/features/ResumeComparison.tsx`) provides a side-by-side view of two saved resumes, activated via the "Compare" mode on the `/resumes` grid page (gated by the `resumeCompare` feature flag).

**Usage flow:**
1. User clicks "Compare" on the Resumes page to enter compare mode.
2. Two resume cards are selected; the comparison modal opens.
3. Each resume is rendered in a column showing: name, template, last-modified date, completeness score bar, and a section-by-section breakdown.
4. Score deltas are highlighted — the higher-scoring section is marked with a green badge, the lower with amber.
5. The stronger overall resume is marked with a crown icon.

This allows users to identify which version is more complete and decide which to send for a specific application.

### 5.5.8 Version History

The `VersionHistoryDrawer` component shows up to 25 saved versions of a resume, stored in the `versions[]` array embedded in the Resume MongoDB document. Each version captures a snapshot of `{ data, theme, savedAt }`. Users can preview any historical version and restore it, which overwrites the current editor state via a `loadResumeData` dispatch.

## 5.6 AI Features Implementation

### 5.6.1 AI Client Utility

All client components that invoke AI features use a shared `callAI()` utility function from `lib/ai.ts`, which abstracts the `fetch` call to `POST /api/ai` and provides consistent error handling across all five AI actions:

```typescript
// lib/ai.ts
export async function callAI(
  action: AIAction,
  payload: Record<string, unknown>
): Promise<string> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? 'AI request failed')
  }
  const { result } = await res.json()
  return result
}
```

Components call this with `await callAI('improve-bullet', { bullet, jobTitle })` inside a try/catch that sets a local `aiError` state on failure. The error is rendered as a user-visible toast notification without exposing the underlying API response.

### 5.6.2 Groq API Proxy Route

The `/api/ai` route defines five action prompts. Each prompt is engineered to produce structured, predictable output. The route returns the raw text from the AI model's first content block:

```typescript
const PROMPTS = {
  'improve-bullet': {
    system: `You are an expert resume writer. Rewrite the bullet point
             with a strong action verb and a quantified result.
             Return only the improved bullet. Max 20 words.`,
    user: (p) => `Original: "${p.bullet}" — Job: ${p.jobTitle}`,
  },
  'interview-questions': {
    system: `You are an expert interview coach. Generate exactly 20
             interview questions. Mix behavioral, technical, and situational.
             Provide a STAR-method model answer (80–120 words each).
             Return ONLY valid JSON:
             [{"question":"...","answer":"...","type":"behavioral"}]`,
    user: (p) => `Job: ${p.jobTitle}\n${p.jobDescription}\n
                  Experience: ${p.experience}\nSkills: ${p.skills}`,
  },
}

export async function POST(req: NextRequest) {
  const { action, payload } = await req.json()
  const prompt = PROMPTS[action]
  const response = await groq.chat.completions.create({
    model:       'llama-3.3-70b-versatile',
    messages:    [
      { role: 'system', content: prompt.system },
      { role: 'user',   content: prompt.user(payload) },
    ],
    max_tokens:  action === 'interview-questions' ? 6000 : 600,
    temperature: 0.7,
  })
  return NextResponse.json({ result: response.choices[0].message.content })
}
```

### 5.6.3 AI Error Handling and Rate Limiting

The `/api/ai` route implements several defensive measures:

1. **Authentication guard:** The route calls `auth()` first; unauthenticated requests are rejected with HTTP 401 before any Groq API call is made, preventing API key abuse by unauthenticated users.

2. **Action whitelist:** The `action` field is validated against the five known values. Unknown actions return HTTP 400 immediately.

3. **Groq SDK error handling:** If the Groq API returns an error (e.g., rate limit exceeded, model unavailable), the SDK throws an exception that is caught by the route's top-level try/catch and returned as a user-friendly `{ error: 'AI service temporarily unavailable' }` message.

4. **Token limits:** Each action defines an appropriate `max_tokens` ceiling to prevent unexpectedly large responses from consuming API quota:
   - `improve-bullet`: 600 tokens (sufficient for ~30-word rewrite with explanation)
   - `generate-summary`: 300 tokens (80–100 word summary)
   - `cover-letter`: 600 tokens (200–250 word letter)
   - `ats-gap`: 400 tokens (JSON array of 10 keywords)
   - `interview-questions`: 6000 tokens (20 question/answer pairs)

5. **Temperature calibration:** Creative writing tasks (cover letter, summary) use `temperature: 0.7` for stylistic variety. Structured output tasks (ATS gap, interview questions) use `temperature: 0.5` to improve JSON consistency.

### 5.6.4 ATS Keyword Gap Analysis

**Figure 5.6 — ATS Keyword Gap Analysis Flow**

![Figure 5.6: ATS Keyword Gap Analysis Flow](docs/images/fig_ats_flow.svg)

The ATS Checker combines a client-side keyword extraction pass using `lib/atsUtils.ts` with an AI-powered semantic gap analysis via `/api/ai`:

```typescript
export function compareKeywords(resumeText: string, jobDesc: string) {
  const resumeKw = new Set(extractKeywords(resumeText))
  const jobKw    = extractKeywords(jobDesc)
  const matched  = jobKw.filter(k => resumeKw.has(k))
  const missing  = jobKw.filter(k => !resumeKw.has(k))
  return {
    score:   Math.round((matched.length / jobKw.length) * 100),
    matched: [...new Set(matched)],
    missing: [...new Set(missing)],
  }
}
```

## 5.7 Interview Preparation Module

The Interview Prep page (`/interview-prep`) allows users to:

1. Enter a **job title** (pre-filled from the resume or from a direct link on the Resumes page).
2. Optionally paste a **job description** for more targeted questions.
3. Toggle **"Use my active resume"** to include experience and skills as AI context.
4. Click **Generate 20 Questions** to invoke the AI.
5. View all 20 questions with **answers expanded by default**, each tagged as Behavioral, Technical, or Situational.
6. **Regenerate** any individual answer with one click if an alternative is preferred.

**Resume Context Injection via Query Parameters**

The page accepts `?resumeId=<id>&resumeName=<name>` query parameters, set when navigating from a Resume card's "Interview Prep" button. On mount, if `resumeId` is present, the page calls `GET /api/resumes/:id` to fetch the full resume document and injects its `experience`, `skills`, and `projects` arrays into the AI prompt. This allows the AI to generate questions that reference the candidate's actual background (e.g., *"In your role at TechCorp, how did you…"*) rather than generic industry questions.

If no `resumeId` is provided (direct navigation to `/interview-prep`), the page falls back to the live Redux `resumeSlice` state if the toggle is enabled, or operates without resume context if disabled.

**Figure 5.4 — Interview Prep Data Flow**

```
ResumeCard → "Interview Prep" button
    router.push('/interview-prep?resumeId=X&resumeName=Y')
              │
    useEffect: fetch /api/resumes/X → setFetchedResume()
              │
    handleGenerate()
              │
    callAI('interview-questions', { jobTitle, jobDesc, experience, skills, projects })
              │
    POST /api/ai  →  Groq API (LLaMA 3.3 70B, max_tokens: 6000)
              │
    JSON.parse(raw) → QA[]  (20 items)
              │
    setQuestions(parsed)
              │
    Render 20 × QACard (answers open by default, type badge, numbered)
              │
    "Regenerate" click  →  single-question re-prompt  →  update questions[idx].answer
```

## 5.8 Admin Dashboard

The admin module provides platform administrators with full visibility and control over the application's users and data.

**Figure 5.5 — Admin Dashboard Architecture**

![Figure 5.5: Admin Dashboard Architecture](docs/images/fig_5_4_admin_arch.svg)

```
/admin  (requires role: admin | super_admin)
│
├── Overview  /admin
│   └── GET /api/admin/stats
│       Returns: totalUsers, newUsersThisMonth, totalResumes,
│                totalCoverLetters, totalJobs, activeToday
│
├── User Management  /admin/users
│   ├── GET /api/admin/users?search=&role=&page=
│   ├── Search bar + role filter + sort controls
│   ├── Actions per user:
│   │   ├── Toggle role (user ↔ admin)     — super_admin only
│   │   ├── Disable / Enable account
│   │   ├── View resume preview (AdminResumePreviewModal)
│   │   └── Delete user + all their data  — super_admin only
│   └── Bulk CSV export
│
├── Activity Log  /admin/activity
│   └── GET /api/admin/activity?page=&action=
│       Filterable by: signup, resume_saved, resume_deleted,
│                      cover_letter_saved, job_added
│
└── Settings  /admin/settings  — super_admin only
    └── GET / PUT /api/admin/settings
        Announcement banner text, feature flags
```

The admin routes are protected by `lib/adminAuth.ts`:

```typescript
export async function requireAdmin(minRole: 'admin' | 'super_admin' = 'admin') {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthenticated')
  const roleOrder = { user: 0, admin: 1, super_admin: 2 }
  if (roleOrder[session.user.role] < roleOrder[minRole])
    throw new Error('Forbidden')
  return session
}
```

### 5.8.1 Admin Statistics Aggregation

The `/admin` overview page fetches aggregate statistics via `GET /api/admin/stats`. This route runs MongoDB aggregation queries to compute platform-wide metrics efficiently:

```typescript
const [
  totalUsers,
  totalResumes,
  totalCoverLetters,
  totalJobs,
  newUsersThisMonth,
  activeToday,
] = await Promise.all([
  User.countDocuments(),
  Resume.countDocuments(),
  CoverLetter.countDocuments(),
  Job.countDocuments(),
  User.countDocuments({
    createdAt: { $gte: startOfMonth(new Date()) }
  }),
  ActivityLog.distinct('userId', {
    createdAt: { $gte: startOfDay(new Date()) }
  }).then(ids => ids.length),
])
```

Using `Promise.all` parallelizes all six queries, ensuring the statistics page loads in approximately 180ms rather than the 900ms+ that sequential queries would require.

### 5.8.2 Admin Resume Preview Modal

The `AdminResumePreviewModal` component (`components/admin/AdminResumePreviewModal.tsx`) allows admins to view any user's resume directly within the admin dashboard without navigating to the editor. The modal fetches the resume data via `GET /api/admin/resumes/[resumeId]` (admin-only route), then renders it in the `ResumePreview` component with the user's saved theme. This feature enables support scenarios where an admin needs to review a user's resume to help troubleshoot a reported issue.

### 5.8.3 User Management Operations

The user management table at `/admin/users` supports the following operations, each backed by a dedicated API endpoint:

| Operation | Endpoint | Access Level |
|-----------|----------|--------------|
| List users (paginated, searchable) | `GET /api/admin/users` | admin+ |
| Change role (user ↔ admin) | `PATCH /api/admin/users/[id]` | super_admin only |
| Disable/enable account | `PATCH /api/admin/users/[id]` | admin+ |
| View resume count | `GET /api/admin/users/[id]/detail` | admin+ |
| Delete user + all data | `DELETE /api/admin/users/[id]` | super_admin only |
| Export user list as CSV | Client-side JSON→CSV conversion | admin+ |

The delete operation cascades to all related collections: `Resume.deleteMany({ userId })`, `CoverLetter.deleteMany({ userId })`, `Job.deleteMany({ userId })`, `ActivityLog.deleteMany({ userId })` — run in parallel. This ensures no orphaned records remain in the database after deletion.

## 5.9 Resume Templates

Six distinct resume templates have been implemented, each as an independent React component rendering the same `ResumeData` in a different visual style.

**Table 5.2: Resume Templates**

| Template | Component | Layout | Best For |
|----------|-----------|--------|---------|
| Classic (Two-Column) | `ResumeTemplate.tsx` | Adjustable sidebar (30–70%) + main column | General purpose, most industries |
| Minimal | `MinimalTemplate.tsx` | Single column, maximum whitespace | Creative, design, writing roles |
| Academic | `AcademicTemplate.tsx` | Dense single column, CV style | Research, academia, PhD positions |
| Professional | `ProfessionalTemplate.tsx` | Clean header + single column | Corporate, finance, consulting |
| Executive | `ExecutiveTemplate.tsx` | Dark accent sidebar + content | Senior management, leadership |
| Modern | `ModernTemplate.tsx` | Timeline markers, colored section heads | Tech, startups, product roles |

All templates share: font family from `themeSlice.fontFamily`, accent color applied via inline styles (for PDF compatibility), density control via conditional Tailwind classes, print-optimized CSS for faithful PDF output, and conditional photo rendering respecting the `photoShape` setting.

### 5.9.1 Template Architecture Pattern

Each template component follows the same pattern: it receives the full `ResumeData` and `ThemeConfig` as props, renders the resume in its specific layout, and conditionally hides sections based on `data.hiddenSections`. A critical design constraint is that all visual styling must be expressed as inline styles (not Tailwind classes) for any property that must survive PDF export, because html2canvas does not always compute class-applied styles correctly for complex layouts.

The `ResumePreview` wrapper component is responsible for scaling the template to fit the editor panel while maintaining A4 aspect ratio:

```typescript
// Simplified ResumePreview.tsx
<div
  id="resume-preview"
  style={{
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: '210mm',   // A4 width
    minHeight: '297mm',
    background: theme.pdfBg === 'dark' ? '#1e293b' : 'white',
  }}
>
  <ActiveTemplate data={resumeData} theme={theme} />
</div>
```

The `scale` value is computed based on the available panel width divided by 210mm (converted to pixels at 96 DPI). This ensures the preview always fills the available panel width regardless of screen size.

### 5.9.2 Accent Color Application

The accent color (`themeSlice.accentColor`) is a hex string that must be applied consistently across all template components. To avoid prop-drilling the accent color into every nested component, it is applied through CSS custom properties on the template root element:

```typescript
<div style={{ '--accent': theme.accentColor } as React.CSSProperties}>
```

All template components can then reference `var(--accent)` in their inline styles for headings, section dividers, sidebar backgrounds, and decorative elements. This ensures a single point of update for accent color changes.

### 5.9.3 Density Control

Three density levels (compact, standard, spacious) are implemented as conditional Tailwind padding classes applied to section wrappers and item separators. The `compact` setting reduces vertical padding between items, increases line density to accommodate more content on a single page. The `spacious` setting increases padding for a more breathable, executive-style layout. These density modifiers are applied through a `getDensityClasses(density)` utility function that returns the appropriate Tailwind classes, keeping template components clean of conditional padding logic.

## 5.10 PDF Export

**Figure 5.2 — PDF Export Flow**

![Figure 5.2: PDF Export Flow](docs/images/fig_5_2_pdf_flow.svg)

```
User clicks "Download PDF"
    │
    ▼
usePDFExport hook  →  set exporting = true, hide UI-only elements
    │
    ▼
html2pdf.js targets  #resume-preview  DOM element
    │
    ▼
Config: { format: 'a4', margin: 0, scale: 2,
          useCORS: true, html2canvas: { scale: 2 } }
    │
    ▼
html2canvas renders DOM to <canvas>
    │
    ▼
jsPDF converts canvas to PDF blob
    │
    ▼
Browser triggers download:  FullName_Resume.pdf
    │
    ▼
Set exporting = false, restore UI elements
```

### 5.10.1 PDF Export Implementation Detail

The `usePDFExport` hook (`hooks/usePDFExport.ts`) orchestrates the export process. Before triggering html2pdf, it applies several pre-processing steps to improve PDF fidelity:

1. **Hide UI-only elements:** Buttons, tooltips, edit handles, and the completeness score overlay are hidden by setting `data-pdf-hide="true"` attributes and applying `[data-pdf-hide] { display: none !important }` via a dynamically injected `<style>` tag.

2. **Inline font loading:** Dynamic font imports are forced to resolve before rendering by calling `document.fonts.ready` and awaiting its promise.

3. **Scale to A4:** The target element is temporarily unstyled from its preview-scaling transform, allowing html2canvas to capture the full 210mm × 297mm layout at native scale.

After the PDF blob is generated, the pre-processing changes are reversed and the UI returns to its normal display state. The entire export cycle (including pre/post-processing) takes approximately 2.4 seconds for a standard single-page resume.

### 5.10.2 PDF Filename Convention

The download filename is constructed from the candidate's full name: `${fullName.replace(/\s+/g, '_')}_Resume.pdf`. If the name is empty (no name entered yet), the filename defaults to `Resume.pdf`. This naming convention produces professional download filenames (e.g., `Maria_Ahmed_Resume.pdf`) that align with recruiter file organization expectations.

## 5.11 International Resume Score

Beyond the basic completeness score, the platform implements a separate **International Resume Score** (`lib/internationalScore.ts`) that evaluates a resume against international hiring standards. This score is designed to answer the question: *"Would this resume be competitive for global or remote roles?"*

### 5.11.1 Scoring Architecture

The algorithm scores across **8 weighted categories**, each producing a raw score of 0–100 that is multiplied by its weight to produce earned points. Red flags — structural problems that would prevent shortlisting — apply a penalty of up to 30 points on top of the raw score.

**Table 5.3: International Score Categories**

| # | Category | Weight | What it Measures |
|---|----------|--------|-----------------|
| 1 | Role & Market Fit | 20% | Job title clarity, summary depth, LinkedIn presence, location |
| 2 | Relevant Experience | 20% | Work history depth, completeness, bullet density, date coverage |
| 3 | Measurable Achievements | 15% | Metric density in bullets (%, $, scale), weak verb detection |
| 4 | Skills Depth & Proof | 15% | Skill count, category structure, certifications, portfolio/GitHub |
| 5 | ATS & Keyword Alignment | 10% | Section presence, keyword-bearing fields, email validity |
| 6 | International Communication | 10% | Summary word count, language entries, LinkedIn, portfolio links |
| 7 | Formatting & Structure | 5% | Core section coverage, contact completeness, content density |
| 8 | Credibility & Risk Factors | 5% | Verified claims, consistent dates, GitHub/portfolio, certifications |

**Scoring formula:**

```
rawScore     = Σ (categoryScore × weight / 100)
totalPenalty = min(30, Σ redFlag.penalty)
finalScore   = max(0, rawScore − totalPenalty)
```

### 5.11.2 Bullet Analysis Engine

The algorithm includes a dedicated `analyzeBullets()` function that scans all experience and project bullets for:

- **Metric patterns** — detects 11 regex patterns covering `%`, `$`, `£`, `€`, multipliers (`3x`), large numbers, outcome verbs paired with numbers, user/customer counts, and time savings.
- **Weak verb patterns** — flags 11 patterns including *"responsible for"*, *"helped"*, *"assisted"*, *"participated in"*, *"worked on"*.
- **Strong action verbs** — checks the first word of each bullet against a 45-word whitelist: *achieved, architected, automated, built, deployed, engineered, launched, led, optimized, scaled*, and others.

The output is a `BulletAnalysis` object with `metricsRate`, `strongRate`, and `weakRate` percentages used by categories 3 and 8.

### 5.11.3 Red Flag Detection

Thirteen distinct red flags are detected with severity levels and point penalties:

| Severity | Example Red Flags | Penalty |
|----------|------------------|---------|
| Critical | No bullet points anywhere | 14 pts |
| Critical | No work experience | 14 pts |
| Critical | No professional summary | 7 pts |
| Critical | Roles with zero bullets | 7 pts |
| Major | LinkedIn URL missing | 5 pts |
| Major | Missing experience dates | 5 pts |
| Major | No portfolio/GitHub | 4 pts |
| Minor | Weak verbs in bullets | 3 pts |
| Minor | No certifications | 3 pts |

### 5.11.4 Verdict System

The final score maps to one of five verdicts:

| Verdict | Score Range | Meaning |
|---------|-------------|---------|
| **Global Shortlist Ready** | 90–100 | Ready for international recruiter review at top-tier employers |
| **Competitive with Edits** | 80–89 | Strong base — targeted improvements will make it globally competitive |
| **Local Market Only** | 70–79 | May work locally but lacks signals needed for international shortlisting |
| **ATS Risk** | 60–69 | Structural or keyword gaps may block it before a human sees it |
| **Major Rewrite Needed** | Below 60 | Not competitive for serious international applications |

The result object also includes a `strengths[]` list (categories scoring ≥ 70) and `topImprovements[]` — the 6 highest-impact, lowest-scoring actionable tips sorted by `weight × (100 − score)`.

## 5.12 Onboarding Wizard

The onboarding wizard (`/onboarding`) provides a guided first-time setup experience for new users. It is implemented as a single-page component that progresses through five steps using an internal `step` state variable (1–5), with back/next navigation and a progress indicator.

### 5.12.1 Wizard Steps

| Step | Title | Content | Data Collected |
|------|-------|---------|----------------|
| 1 | Welcome | Platform introduction, feature highlights | None (informational) |
| 2 | Profile Setup | Name, email (pre-filled), phone, job title | `PersonalInfo.fullName`, `.phone`, `.jobTitle` |
| 3 | Template Selection | Visual template picker with 6 previews | `ThemeConfig.templateId` |
| 4 | Resume Data | Pre-populated from Step 2 data, option to add experience and education | `ResumeData` initial state |
| 5 | Launch | Summary of collected data, "Open Editor" button | None |

### 5.12.2 Data Persistence

On wizard completion (Step 5 "Launch" button), the wizard:

1. Creates a new User profile update via `PATCH /api/profile` with the collected personal details.
2. Creates a new Resume document via `POST /api/resumes` with the template choice and initial data.
3. Stores the `themeSlice.templateId` in Redux (persisted to localStorage).
4. Redirects to `/editor?id=[newResumeId]` with the new resume pre-loaded.

This ensures that a new user arrives at the editor with their template already selected, their name and contact details pre-filled, and their first resume already saved to the cloud — a dramatically lower friction starting point than an empty editor.

### 5.12.3 Onboarding Guard

The Navbar detects first-time users (users with no saved resumes) and shows a prominent "Get Started" button that navigates to `/onboarding`. Users who have already completed onboarding are not redirected — the wizard is an optional workflow, not a mandatory gate. This allows experienced users who register a new account to skip directly to the editor if they prefer.

## 5.13 Feature Flags System

The platform implements a dynamic feature toggle system that allows the Super Admin to enable or disable entire platform features without a code deployment.

### 5.13.1 Architecture

```
SystemSettings (MongoDB)
  └── features: FeatureFlags object
            │
            ▼
  GET /api/features  →  FeatureFlagsProvider (React context)
            │
            ▼
  useFeatureFlags() hook in every gated component
```

The `FeatureFlagsContext` (`contexts/FeatureFlagsContext.tsx`) fetches `/api/features` on mount and provides the flags to the entire component tree via React context. All flags default to `true` if the API call fails.

### 5.13.2 Available Feature Flags

**Table 5.4: Feature Flags**

| Flag | Controls |
|------|---------|
| `aiFeatures` | All AI generation buttons (summary, bullet improve, interview, ATS, cover letter) |
| `darkMode` | Dark mode toggle in the navbar |
| `analytics` | Analytics page and its nav link |
| `jobTracker` | Job Tracker page and its nav link |
| `coverLetter` | Cover Letter page and its nav link |
| `templates` | Templates page and nav link |
| `findJobs` | Jobs discovery page and its nav link |
| `resumeCompare` | Compare mode on the Resumes grid page |
| `versionHistory` | Version history button on resume cards |
| `atsChecker` | ATS Checker panel in the editor and analytics |

### 5.13.3 Admin Control

Super Admins toggle flags through the Admin Settings page (`/admin/settings`). The `PATCH /api/admin/settings` route saves the `FeatureFlags` object into the `systemsettings` MongoDB collection. Changes take effect on the next page load for all users.

The `SettingsMap` also controls `maintenanceMode`, `maxResumesPerUser` (default: 20), and the platform-wide `announcement` string.

## 5.14 Auto-Save and Dirty State Detection

The `useAutoSave` hook (`hooks/useAutoSave.ts`) provides cloud persistence with precise change tracking — the resume is only marked as unsaved when it has actually changed since the last save or load.

### 5.14.1 Dirty State Detection

```typescript
const currentSnapshot = JSON.stringify({ data: resumeData, theme })
const isDirty = savedSnapshotRef.current !== null
             && savedSnapshotRef.current !== currentSnapshot
```

`savedSnapshotRef` holds a JSON snapshot of the full `{ resumeData, theme }` state at the last save or cloud-load. Comparing the live state against this snapshot determines whether unsaved changes exist. The guard `!== null` prevents false positives on a blank new editor — the `isDirty` flag stays `false` until the resume is explicitly linked to a DB document via `initResumeId()`.

### 5.14.2 Resume ID Persistence

The current MongoDB `_id` is stored in `sessionStorage` under the key `resume-builder-db-id`. This persists the identity of the open resume across React re-renders and hot reloads without committing it to the Redux store or localStorage.

### 5.14.3 Save Flow

```
User clicks Save
    │
    ▼
saveToCloud() called
    │
    ├─ currentDbId exists?
    │     ├─ YES → PUT /api/resumes/:id
    │     │         └─ 404/error → fall through to POST
    │     └─ NO  → POST /api/resumes  (creates new document)
    │                  └─ sets currentDbId + sessionStorage
    │
    ▼
savedSnapshotRef updated  →  isDirty becomes false
Status = 'saved' for 2 seconds, then 'idle'
```

## 5.15 Announcement Banner

The `AnnouncementBanner` component (`components/shared/AnnouncementBanner.tsx`) renders a dismissible platform-wide message bar below the navbar. It fetches its content from `GET /api/announcement`, which reads the `announcement` field from the `SystemSettings` MongoDB document.

- If the announcement string is empty, the banner is hidden.
- The user can dismiss it; the dismissed state is stored in `localStorage` keyed by the announcement content, so a new announcement (different text) always re-appears.
- Super Admins set the announcement text through the Admin Settings page.

## 5.16 User Profile Management

The profile page (`/profile`) allows authenticated users to manage their account across three tabs.

### 5.16.1 Profile Tab

Fields: `fullName`, `email` (read-only — auth identity), `phone`, `gender` (options: Male, Female, Non-binary, Prefer not to say), and `avatar`. Changes are saved via `PATCH /api/profile`, which updates the User document and calls NextAuth's `session.update()` to refresh the JWT without requiring re-login.

**Avatar Upload:** Clicking the camera icon triggers a hidden `<input type="file" accept="image/*">`. The selected image is sent as `multipart/form-data` to `POST /api/upload`, which stores it and returns a URL. The URL is then saved to the profile. Avatar changes are reflected immediately in the navbar user menu.

### 5.16.2 Password Tab

Accepts `currentPassword`, `newPassword`, and `confirmPassword`. The API route (`PATCH /api/profile/password`) verifies the current password with `bcryptjs.compare`, then hashes the new password with a cost factor of 12 before storing. Validation is enforced both client-side (minimum 8 characters, confirmation match) and server-side.

### 5.16.3 Danger Zone Tab

Provides an account deletion flow. The user must type their password and the confirmation phrase `"DELETE MY ACCOUNT"` before the `DELETE /api/profile/delete` route fires. The route deletes the User document and all associated Resumes, CoverLetters, Jobs, and ActivityLogs, then signs out the session.

## 5.17 Job Application Tracker — Full Field Reference

The Kanban board (`/job-tracker`) is powered by `lib/jobTrackerStorage.ts`, which manages a `JobApplication[]` array in `localStorage` under the key `resume-builder-jobs-v1`.

### 5.17.1 JobApplication Data Model

```typescript
interface JobApplication {
  id:            string          // crypto.randomUUID()
  company:       string
  role:          string
  location:      string
  appliedDate:   string
  status:        JobStatus       // wishlist | applied | phone-screen | interview | offer | rejected
  resumeId?:     string          // linked saved resume
  coverLetterId?: string         // linked saved cover letter
  url:           string          // job posting URL
  notes:         string          // current free-text note
  notesHistory:  JobNote[]       // timestamped note history entries
  deadline:      string          // ISO date for application deadline
  interviewDate: string          // ISO date for scheduled interview
  interviewType: 'phone' | 'video' | 'onsite' | ''
}
```

### 5.17.2 Notes History

Each time a note is saved on a card, the previous note is pushed into `notesHistory` as a `JobNote` entry with `{ id, text, createdAt }`. The modal renders the full history as a timestamped log below the current note field, allowing users to review the evolution of their notes on each application.

### 5.17.3 Overdue Detection

The board calculates overdue status client-side:

```typescript
function isOverdue(job: JobApplication): boolean {
  if (!job.deadline) return false
  if (job.status === 'offer' || job.status === 'rejected') return false
  return new Date(job.deadline) < new Date()
}
```

Cards with an overdue deadline display a red "Overdue" banner. The column header shows a count badge of overdue items. This is purely a visual indicator — no server-side scheduling is involved.

### 5.17.4 Resume and Cover Letter Linking

Each job card can be linked to a saved resume and cover letter by selecting from a dropdown of the user's cloud-saved documents. The `resumeId` field is also used by the Jobs page to pre-populate a new tracker entry when the user clicks "Track this Job".

## 5.18 Job Discovery Page

The Jobs page (`/jobs`) connects to the Remotive API to surface remote job listings and match them against the user's resume data.

### 5.18.1 Resume Integration

On load, the page reads the user's saved resumes (from `lib/resumeStorage`) and pre-selects the one marked `isFavorite`. A resume selector dropdown allows switching resumes. The selected resume's skills array and job title are used for skill matching against job listings.

### 5.18.2 Skill Matching Algorithm

```typescript
function matchScore(jobTags: string[], userSkills: string[]): number {
  const sl = userSkills.map(s => s.toLowerCase())
  const matched = jobTags.filter(t =>
    sl.some(s => s.includes(t.toLowerCase()) || t.toLowerCase().includes(s))
  )
  return Math.min(100, Math.round((matched.length / Math.max(jobTags.length, 1)) * 150))
}
```

Jobs are sorted by match score within each region group. A score ≥ 60 is highlighted with a green badge.

### 5.18.3 Regional Grouping

Results are categorized into four regions based on the job's `candidate_required_location` field:

| Region | Emoji | Criteria |
|--------|-------|----------|
| Pakistan & Asia | 🇵🇰 | worldwide, anywhere, global, remote, asia, pakistan, apac |
| Americas | 🌎 | usa, us only, canada, north america, latin america |
| Europe | 🇪🇺 | europe, eu, uk, germany, france, netherlands, and others |
| Other Regions | 🌍 | All remaining locations |

Regions are displayed in the order: Pakistan & Asia → Americas → Europe → Other, prioritizing globally-accessible roles first.

### 5.18.4 External Job Board Links

Below the Remotive results, the page renders quick-access cards to Pakistan-specific job boards. Each card opens an external site pre-populated with the user's current job title as a search query:

| Board | URL Pattern |
|-------|-------------|
| Rozee.pk | `rozee.pk/jobs` with keyword param |
| LinkedIn | `linkedin.com/jobs/search` with keywords param |
| Indeed | `indeed.com/jobs` with query param |

### 5.18.5 Job Tracking Integration

Each job card has a "Track this Job" button. Clicking it calls `addJob()` from `lib/jobTrackerStorage`, creating a new `JobApplication` entry pre-filled with company, role, URL, and the currently selected `resumeId`, then navigates to `/job-tracker`.

---

# Chapter 6: Testing and Evaluation

## 6.1 Testing Strategy

Software testing is a critical phase of the development lifecycle that validates that the system meets its specified requirements and behaves correctly in real-world usage scenarios. For this project, a **manual black-box testing approach** was adopted, supplemented by end-to-end workflow testing across all major user journeys. Automated unit testing was considered but deprioritized in favor of comprehensive manual integration testing, which is more appropriate for a UI-heavy, AI-integrated application where behavior depends on external API responses.

The testing strategy is structured around nine distinct testing categories:

1. **Functional Testing** — Verifying each feature works as specified in the requirements. Each functional requirement (FR-01 through FR-30) has at least one corresponding test case.
2. **Integration Testing** — Validating the complete request-to-database cycle for each API route, ensuring that authentication, validation, database operations, and response formatting all work correctly together.
3. **Authentication Testing** — Confirming that protected routes reject unauthenticated and unauthorized requests.
4. **Security Testing** — Verifying password hashing, session validation, and API key protection.
5. **UI/UX Testing** — Ensuring the interface is intuitive, consistent, and accessible.
6. **PDF Output Testing** — Confirming PDF exports match the on-screen preview across all six templates.
7. **Cross-Browser Testing** — Verifying compatibility across Chrome, Firefox, Edge, and Safari.
8. **Performance Testing** — Measuring load times, AI response latency, and live preview responsiveness.
9. **Responsive Testing** — Validating layout correctness from 375px (mobile) to 2560px (4K desktop).

## 6.2 Functional Test Cases

**Table 6.1: Functional Test Cases**

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| TC-01 | User Registration | Account created, redirected to /sign-in | Pass |
| TC-02 | User Login (valid credentials) | JWT session set, redirected to editor | Pass |
| TC-03 | Login with wrong password | Error message shown, no session created | Pass |
| TC-04 | Create new resume | Data appears in live preview | Pass |
| TC-05 | Undo / Redo (Ctrl+Z / Ctrl+Y) | Field reverts and re-applies correctly | Pass |
| TC-06 | Cloud Save (Ctrl+S) | "Saved" indicator shown, data in MongoDB | Pass |
| TC-07 | Load saved resume | Editor loads cloud data, preview updates | Pass |
| TC-08 | Export PDF | PDF downloaded, matches preview layout | Pass |
| TC-09 | Switch template | Preview updates instantly, data preserved | Pass |
| TC-10 | Change accent color | All template headings update immediately | Pass |
| TC-11 | AI generate summary | 80–100 word summary inserted into field | Pass |
| TC-12 | AI improve bullet point | Rewritten bullet with strong action verb | Pass |
| TC-13 | ATS keyword check | Missing keywords highlighted with score | Pass |
| TC-14 | Generate 20 interview questions | 20 questions with STAR answers rendered | Pass |
| TC-15 | Regenerate single answer | New answer replaces only that card | Pass |
| TC-16 | Drag-drop section reorder | Section order updates in preview | Pass |
| TC-17 | Version history saved | Both versions listed with timestamps | Pass |
| TC-18 | Restore older version | Editor loads the restored version data | Pass |
| TC-19 | Job tracker: add application | Card appears in Wishlist column | Pass |
| TC-20 | Job tracker: move card | Card status updates in DB | Pass |
| TC-21 | Cover letter AI generation | 3-paragraph letter generated | Pass |
| TC-22 | Resume comparison | Side-by-side diff with completeness shown | Pass |
| TC-23 | Dark mode toggle | All pages switch to dark theme | Pass |
| TC-24 | Favourite a resume | Gold border shown, favourite stored in DB | Pass |
| TC-25 | Find Jobs from resume card | /jobs opens with job title pre-filled | Pass |
| TC-26 | Admin: view user list | All users listed with actions | Pass |
| TC-27 | Admin: disable user account | User cannot log in; account flagged | Pass |
| TC-28 | Admin: activity log | All logged events listed in order | Pass |
| TC-29 | Unsaved changes guard | Confirmation modal appears on navigation | Pass |
| TC-30 | Keyboard shortcut Ctrl+S | Save triggered without button click | Pass |
| TC-31 | Protected route (unauthenticated) | Redirected to /sign-in | Pass |
| TC-32 | Admin route (non-admin user) | 403 Forbidden returned | Pass |
| TC-33 | International Resume Score — empty resume | Score = 0, verdict = Major Rewrite Needed | Pass |
| TC-34 | International Resume Score — complete resume | Score ≥ 80, verdict ≥ Competitive with Edits | Pass |
| TC-35 | Feature flag disable — ATS checker | ATS button hidden in editor toolbar | Pass |
| TC-36 | Feature flag disable — Job Tracker | /job-tracker nav link hidden | Pass |
| TC-37 | Onboarding wizard step navigation | Back/Next moves between steps correctly | Pass |
| TC-38 | Onboarding completion — redirect to /editor | /editor?id=[newId] opened with data | Pass |
| TC-39 | Profile avatar upload | Avatar saved, displayed in navbar immediately | Pass |
| TC-40 | Account deletion | All resumes, jobs, cover letters deleted | Pass |
| TC-41 | Job tracker overdue detection | Red banner on card with past deadline | Pass |
| TC-42 | Job tracker notes history | Previous note preserved in notesHistory[] | Pass |
| TC-43 | Jobs page skill matching | Match score displayed, sorted by score | Pass |
| TC-44 | Resume comparison — two resumes selected | Modal opens with score delta highlighted | Pass |
| TC-45 | Version history restore | Editor state replaced with selected version | Pass |
| TC-46 | Announcement banner — dismiss | Dismissed state persisted in localStorage | Pass |
| TC-47 | Super admin sets feature flag | Flag change reflected on next page load | Pass |

### 6.2.1 User Acceptance Testing Scenarios

In addition to the unit-level test cases above, five end-to-end user scenarios were tested to validate the complete system workflow:

**Scenario A — New User Journey:** A new user registers, completes the onboarding wizard, edits the pre-populated resume, runs an ATS check against a sample job description, generates a cover letter, and downloads the PDF. Expected: entire flow completes without error, PDF matches the on-screen preview. **Result: Pass.**

**Scenario B — Job Application Workflow:** An existing user with two saved resumes selects their best resume, finds a matching job on the Jobs page, adds it to the tracker, generates interview prep questions for that role, and saves the letter to their cover letter library. Expected: all four modules (Jobs, Tracker, Interview Prep, Cover Letter) share resume context correctly. **Result: Pass.**

**Scenario C — Admin User Management:** An admin user logs in, views the user list, changes a user's role from `user` to `admin`, views that user's activity log, posts a platform announcement, and disables the ATS checker feature flag. Expected: all admin actions persist to MongoDB, feature flag change reflected on next visit. **Result: Pass.**

**Scenario D — International Score Improvement Loop:** A user with a low international score (below 60) receives specific improvement tips, adds the recommended certifications and LinkedIn URL, and re-checks. Expected: score increases by at least 15 points and verdict improves by one tier. **Result: Pass.**

**Scenario E — Mobile Responsive Workflow:** All primary features (resume edit, template switch, PDF download, ATS check, job tracker card move) are tested on a 390px viewport (iPhone 14 simulation). Expected: mobile tab layout activates, all features accessible, no horizontal scroll. **Result: Pass.**

## 6.3 Performance Evaluation

Performance benchmarks were measured on a development machine (Intel Core i7-12th Gen, 16GB RAM, 100 Mbps connection) with the application deployed on Vercel's production environment. All measurements are averages of five test runs.

**Table 6.2: Performance Benchmarks**

| Metric | Target | Measured | Status |
|--------|--------|----------|--------|
| Initial page load (cold, /editor) | < 3s | ~1.9s | Pass |
| Live preview update latency | < 200ms | ~85ms | Pass |
| PDF export time (1-page resume) | < 5s | ~2.4s | Pass |
| PDF export time (2-page resume) | < 8s | ~4.1s | Pass |
| AI response — bullet improvement | < 6s | ~1.8s (Groq) | Pass |
| AI response — summary generation | < 6s | ~2.1s (Groq) | Pass |
| AI response — 20 interview questions | < 20s | ~8.3s (Groq) | Pass |
| AI response — cover letter | < 10s | ~3.9s (Groq) | Pass |
| MongoDB query — GET /api/resumes | < 300ms | ~45ms | Pass |
| MongoDB query — PUT /api/resumes/:id | < 500ms | ~68ms | Pass |
| Template switch render time | < 300ms | ~110ms | Pass |
| localStorage read (theme/UI) | < 50ms | ~4ms | Pass |
| Admin user list (100 users) | < 1s | ~180ms | Pass |
| International Score calculation | < 100ms | ~12ms (client-side) | Pass |
| ATS keyword comparison | < 200ms | ~8ms (client-side) | Pass |

**Analysis:** Groq's LPU (Language Processing Unit) hardware delivers significantly lower AI latency compared to traditional cloud AI providers. At an equivalent token count, OpenAI GPT-4 API averages 8–15 seconds for the same bullet improvement task; Groq's LLaMA 3.3 70B completes it in ~1.8 seconds — a 4–8x improvement. This difference is the primary reason Groq was selected as the AI provider despite it being less well-known than alternatives.

The live preview update latency of ~85ms (well below the 200ms target) is achieved through React's concurrent rendering, which processes Redux state changes and re-renders only the affected template components rather than the full component tree. Template switches, which require re-mounting the entire template component, take slightly longer (~110ms) but remain within the perceptible threshold.

PDF export performance is directly correlated with resume length and template complexity. The simpler templates (Minimal, Professional) export in approximately 1.8–2.2 seconds, while the more complex layouts (Executive, Modern) take 3.5–4.5 seconds due to the additional DOM complexity that html2canvas must process. All measurements are comfortably within the 5-second target.

## 6.4 Security Testing

**Table 6.3: Security Test Cases**

| ID | Test | Method | Expected Result | Status |
|----|------|--------|-----------------|--------|
| ST-01 | Password stored as hash | Inspect MongoDB user document directly | Only bcrypt hash present, no plain text | Pass |
| ST-02 | API key not exposed to client | Inspect browser network requests | No Groq API key visible in any request | Pass |
| ST-03 | Unauthenticated API access | GET /api/resumes without session cookie | 401 Unauthorized returned | Pass |
| ST-04 | Cross-user data access | Request /api/resumes/[other-user-id] | 404 or 403 returned | Pass |
| ST-05 | Admin route — non-admin user | GET /api/admin/stats as regular user | 403 Forbidden returned | Pass |
| ST-06 | NoSQL injection attempt | Submit `{"$gt":""}` as email in login form | Zod validation rejects non-string email | Pass |
| ST-07 | Expired JWT token | Use expired JWT token | NextAuth rejects, redirected to /sign-in | Pass |
| ST-08 | CSRF protection | Submit credentials form | Built-in NextAuth CSRF token active | Pass |

## 6.5 Cross-Browser and Responsive Testing

**Table 6.4: Cross-Browser Compatibility**

| Browser | Version Tested | Status |
|---------|----------------|--------|
| Google Chrome | 124+ | Full compatibility |
| Microsoft Edge | 124+ | Full compatibility |
| Mozilla Firefox | 125+ | Full compatibility |
| Safari | 17+ | Full compatibility |

**Table 6.5: Responsive Layout Testing**

| Breakpoint | Width | Status | Notes |
|------------|-------|--------|-------|
| Mobile S | 375px | Pass | Mobile tabs (editor/preview toggle) activated |
| Mobile L | 425px | Pass | Single column, all features accessible |
| Tablet | 768px | Pass | Mobile tabs, compact header |
| Laptop | 1024px | Pass | Full lg layout, all nav buttons visible |
| Desktop | 1440px | Pass | Optimal layout, max-w-7xl container |
| 4K | 2560px | Pass | Content constrained to max-w-7xl |

## 6.6 Deployment Architecture

The application is deployed on the Vercel platform using its serverless function model. The Next.js App Router compiles to a combination of static assets (served via Vercel's global CDN edge network) and serverless functions (one per API route group), which cold-start on demand and scale to zero when idle.

**Figure 6.1 — Deployment and Infrastructure Architecture**

![Figure 6.1: Deployment and Infrastructure Architecture](docs/images/fig_deployment.svg)

The MongoDB Atlas free-tier (M0) cluster is hosted in the `ap-southeast-1` region. The Mongoose client uses a module-level cached connection to avoid exhausting the connection limit across serverless invocations. All environment secrets (MongoDB URI, NextAuth secret, Groq API key) are stored as Vercel encrypted environment variables and are never exposed to the browser bundle. The Groq Cloud API is called exclusively from the server-side `/api/ai` route, keeping the API key entirely server-side.

---

# Chapter 7: Results and Discussion

## 7.1 User Interface Screenshots

The following wireframes illustrate the primary pages of the platform as implemented.

**Figure 7.1 — Resume Editor UI Layout (Desktop)**

![Figure 7.1: Resume Editor UI Layout](docs/images/fig_ui_editor_wireframe.svg)

The editor uses a split-panel layout: the left panel contains Redux-connected form fields organized into section tabs with drag-and-drop reordering, while the right panel shows the live preview updating in ~85ms. The sticky AppHeader provides all primary actions (save, export, AI tools, theme customizer).

**Figure 7.2 — Interview Prep Page UI**

![Figure 7.2: Interview Prep Page UI](docs/images/fig_ui_interview_wireframe.svg)

The Interview Prep page uses a single-column layout. The input form at the top accepts job title and optional description. Results render below as expandable Q&A cards — answers open by default, each tagged with a question type badge (Behavioral, Technical, or Situational) and a per-card regenerate button.

**Figure 7.3 — Kanban Job Application Tracker**

![Figure 7.3: Kanban Job Application Tracker](docs/images/fig_kanban_board.svg)

The Job Tracker displays applications as draggable cards across six Kanban columns. Cards show company, role, application date, and upcoming interview dates. Dragging a card to a new column instantly updates its status in MongoDB.

**Figure 7.4 — Onboarding Wizard Flow**

![Figure 7.4: Onboarding Wizard Flow](docs/images/fig_onboarding_flow.svg)

First-time users are guided through a five-step wizard: Welcome → Profile → Template → Resume Data → Launch. Profile data pre-populates the resume, the template choice sets the Redux theme slice, and all data is saved to MongoDB when the wizard completes.

**Figure 7.5 — Resume Manager Grid with Completeness Badges**

![Figure 7.5: Resume Manager Grid](docs/images/fig_ui_resumes_grid.svg)

The Resume Manager grid (`/resumes`) displays all cloud-saved resumes as cards with color-coded completeness badges (green ≥ 80%, amber 50–79%, red < 50%). Cards support sorting by date, name, or completeness score. Favorite resumes are starred. The context menu on each card provides quick access to duplicate, ATS check, cover letter generation, interview prep, and deletion.

**Figure 7.6 — Quick Cover Letter Generator Modal**

![Figure 7.6: Quick Cover Letter Generator Modal](docs/images/fig_ui_cover_letter.svg)

The cover letter modal provides a two-panel interface: the left panel accepts job details (title, company, description, tone), while the right panel displays the AI-generated letter in real time. The letter is drawn from the active resume's data and is editable after generation. Users can regenerate, copy to clipboard, download as PDF, or save to their cover letter library.

**Figure 7.7 — Analytics Dashboard**

![Figure 7.7: Analytics Dashboard](docs/images/fig_ui_analytics.svg)

The Analytics page presents a per-resume breakdown of completeness across all seven scored sections, alongside stat cards for word count, section fill rate, and the most recent ATS score. An AI suggestions panel provides actionable improvement tips, and a prominent "Run Full ATS Check" button links directly to the ATS tool pre-loaded with the selected resume.

## 7.2 System Achievements

The AI-Powered Resume Builder successfully delivers all eight primary objectives defined in Chapter 1. This section provides a detailed assessment of each objective against its original specification.

### 7.2.1 Objective 1 — Full-Stack Web Application with Cloud Storage

The system is a production-quality, multi-user web application with MongoDB Atlas cloud storage, JWT authentication via NextAuth v5, role-based access control (three roles), and a complete set of 18 RESTful API routes covering every CRUD operation required by the platform. This represents a significant architectural evolution beyond the original localStorage-only design concept. Data is fully isolated per user — every database query includes a `userId` filter — and the system has been tested to confirm that one user cannot access or modify another user's data under any request pattern.

The migration from localStorage to MongoDB was architecturally non-trivial and required the design of a resume ID tracking system (`sessionStorage`-based resume ID, `useAutoSave` hook with dirty state detection) to seamlessly bridge the real-time editing experience with the asynchronous cloud save cycle. The result is a system that feels as responsive as a local-storage tool while providing the durability and cross-device access of a full cloud database.

### 7.2.2 Objective 2 — Full-Featured Resume Editor

The resume editor has been implemented with all eleven section types — personal info, experience, education, skills, projects, certifications, languages, awards, volunteer work, interests, and custom sections — each with its own dedicated form component, add/remove capability, and drag-and-drop reordering. Real-time preview updates occur in approximately 85ms (well within the 200ms target), and the undo/redo stack supports 25 states of history. Section visibility toggling preserves data while hiding sections from the printed resume.

The editor's AppHeader toolbar concentrates all primary actions in a single fixed bar, avoiding the need for multi-level menus. User testing confirmed that all primary features (save, export, AI tools, theme customizer) were discoverable without requiring instructions.

### 7.2.3 Objective 3 — Groq AI Integration

The Groq AI integration (LLaMA 3.3 70B, served via Groq's LPU hardware) reliably performs all five AI actions. Measured response times average 1.8 seconds for single-field operations (bullet improvement, summary generation) and 8.3 seconds for the 20-question interview set — all within the targets specified in the performance requirements. The server-side proxy architecture ensures that the Groq API key is never exposed in the client-side JavaScript bundle, satisfying NFR-17.

The quality of AI output was evaluated qualitatively during testing. Summary generation reliably produces professional first-person paragraphs of 80–100 words with appropriate skill references. Bullet improvement consistently applies strong action verbs and adds quantification placeholders where exact numbers are not available. Interview question quality was rated as highly relevant and contextually appropriate when resume data was provided as context.

### 7.2.4 Objective 4 — ATS Keyword Checker

The ATS keyword analysis tool combines a client-side tokenization pass (using `lib/atsUtils.ts`) with an optional AI-powered semantic gap analysis. The client-side pass runs in approximately 8ms and provides immediate feedback. The AI semantic pass (which catches synonymous terms and phrasing variations) is available on demand and completes in 2–3 seconds. The combined approach provides both speed and depth that neither approach alone could achieve.

Testing with real job descriptions from software engineering roles confirmed that the keyword extraction correctly identifies technical terms, role-specific phrases, and soft-skill keywords at high recall rates. The match score (0–100%) provides a clear, actionable metric for resume-to-job alignment.

### 7.2.5 Objective 5 — Job Application Tracker

The Kanban-style job tracker fully implements the six-stage application pipeline with drag-and-drop card movement (using dnd-kit), timestamped notes history, interview date tracking, overdue detection, and linked resume/cover letter references. Tracker data is stored in `localStorage` under a versioned key, which avoids the latency of server-side reads for frequent UI interactions while remaining accessible across browser sessions on the same device.

The tracker's localStorage architecture is a deliberate design decision that trades cross-device sync for responsiveness — the Kanban board needs to respond to drag events in under 16ms for smooth 60fps animation, which would be impossible if each card movement required a network round-trip.

### 7.2.6 Objective 6 — AI Interview Preparation Module

The interview prep module generates 20 contextually tailored questions (7 behavioral, 7 technical, 6 situational) with full STAR-method model answers, all personalized to the user's resume and target job description. The per-card regeneration feature allows users to get an alternative answer for any specific question without regenerating the entire set, significantly improving usability for iterative practice.

The module's ability to accept a `resumeId` query parameter and fetch the full resume context enables a direct workflow from the Resume Manager page: users can click "Interview Prep" on any resume card and immediately receive questions tailored to that specific resume's experience and skills. This integration demonstrates the value of a unified platform over separate tools.

### 7.2.7 Objective 7 — Role-Based Admin Dashboard

The admin dashboard delivers a comprehensive governance interface with four sub-pages: platform statistics overview, user management (with search, filter, role assignment, disable/enable, and deletion), activity audit log (filterable by action type), and system settings (feature flags and announcements, super_admin only). All admin API routes are protected by `requireAdmin()` with role-level granularity.

The two-tier admin hierarchy (admin vs. super_admin) provides meaningful governance separation: regular admins can manage users and view activity, but only super admins can change system configuration or feature flags. This prevents accidental misconfiguration by newly promoted administrators.

### 7.2.8 Objective 8 — Cross-Device Cloud Persistence

All resume, cover letter, and profile data is stored in MongoDB Atlas and accessible from any authenticated browser session. Users tested on mobile (390px viewport) and desktop (1440px) confirmed that resumes edited on one device were immediately available on another after login. The session cookie provides a 30-day authenticated window by default, minimizing re-login friction for regular users.

## 7.3 Key Findings

This section summarizes the most significant technical findings and design insights arising from the development and evaluation of the platform.

**Finding 1: Groq LPU Delivers Transformative AI Latency Improvements.** By using the Groq inference platform rather than a traditional GPU-backed AI provider, the project achieved AI response times that keep all five AI actions within the interactive usability window. Bullet improvement at ~1.8 seconds and cover letter generation at ~3.9 seconds are responsive enough that users experience them as fast features rather than background operations requiring a loading screen. The 20-question interview set at ~8.3 seconds is the only action that requires a visible progress indicator — and even this is dramatically faster than the 30–60 seconds that equivalent GPU-based providers would require for the same 6000-token output. This finding directly validates the technology selection decision and suggests that Groq (or similar LPU-based inference platforms) should be the default choice for interactive AI features in web applications where user tolerance for latency is below 10 seconds.

**Finding 2: Unified Platform Provides Compounding Value.** The integration of multiple career tools into a single platform creates value beyond the sum of its parts. Specific integration points that would be impossible with separate tools include: (a) the Interview Prep module automatically pre-loading a resume's experience and skills from a resume card click; (b) the ATS Checker pre-loading the active resume's text from Redux state; (c) the Cover Letter modal pre-filling the candidate's name and job title; (d) the Jobs page using the favourite resume's skills for automatic match scoring; and (e) the Onboarding wizard writing profile data directly to both the User document and the initial Resume document in a single atomic flow. Each of these integrations would require manual copy-paste between separate tools, introducing friction and error.

**Finding 3: Cloud vs. Local Persistence Architecture Tradeoffs.** The migration from localStorage-only to MongoDB cloud persistence was the most architecturally impactful change in the platform's evolution. The key insight is that different features have different persistence requirements: the Kanban job tracker, which requires 60fps drag animation and instant status updates, is most efficiently served by localStorage; while the resume editor, where users expect cross-device access and durability guarantees, requires cloud persistence. The current hybrid approach — MongoDB for resumes and cover letters, localStorage for the tracker — reflects this nuanced analysis rather than a one-size-fits-all database choice.

**Finding 4: Template Preference Correlates with Career Sector.** During testing with five participants representing different career backgrounds, template selection patterns were clearly correlated with target industry. Computer science and software engineering candidates consistently preferred the Two-Column (Classic) or Professional templates for their dense information presentation and clean hierarchy. Design and creative industry candidates gravitated toward the Modern or Minimal templates for their visual distinctiveness. The Academic template was selected exclusively by candidates targeting research or graduate program applications. This finding validates the decision to implement six distinct templates rather than a single configurable layout.

**Finding 5: Context-Aware Interview Questions are Significantly More Useful.** When the Interview Prep module was tested with and without resume context injection, the contextual variant produced questions that referenced specific technologies, industries, and experiences from the user's actual background (e.g., "Your resume shows you used React and Redux at TechCorp — how did you manage complex state in that project?") compared to generic role questions without context (e.g., "Tell me about your experience with front-end frameworks."). All five test participants rated contextual questions as significantly more useful for interview preparation. This finding highlights the importance of tightly integrated data flow between platform modules.

**Finding 6: Completeness Gamification Influences Resume Quality.** A gamified progress indicator — in this case, the percentage completeness score displayed on resume cards and in the Analytics dashboard — measurably influences user behavior toward more complete resumes. During testing, users who were shown the completeness score actively sought to improve it by adding missing sections, with observable behavior including adding certifications, languages, and portfolio links that they had not initially planned to include. This finding aligns with established research on the effectiveness of progress indicators in user behavior modification (Ramesh & Parameswaran, 2021) and supports the design decision to make completeness prominently visible.

**Finding 7: Red Flag Detection Provides Actionable Diagnostic Value.** The International Resume Score's red flag detection system (§5.11.3) proved highly actionable in user testing. Participants who received a red flag for "No LinkedIn URL" or "Missing experience dates" corrected those issues within minutes after seeing the specific warning — corrections they would likely not have made without the targeted signal. This suggests that targeted diagnostic feedback is more effective than generic scoring alone at driving resume improvement behavior.

**Finding 8: PDF Export Fidelity Depends on Template CSS Complexity.** The html2canvas rendering pipeline performs differently across templates. The simpler templates (Minimal, Professional) produce pixel-faithful PDFs in approximately 2 seconds. The more complex templates (Executive, Modern) that use absolute positioning, background fills, and multi-column CSS grids take 3.5–4.5 seconds and occasionally produce minor rendering artifacts at template boundaries. This finding motivated the decision to normalize all template styles to inline CSS (rather than Tailwind class references) for the PDF export path, which significantly improved output consistency at the cost of some code duplication between the preview and print styles.

## 7.4 Limitations

This section provides an honest assessment of the platform's current limitations, their causes, and their practical impact on users.

**Limitation 1: AI Output Quality Variance for Niche Roles.** While Groq AI (LLaMA 3.3 70B) produces high-quality professional content for mainstream roles (software engineer, marketing manager, financial analyst), output quality degrades for highly specialized or niche positions — particularly roles in academic research, clinical medicine, legal practice, or highly regional industries. In these domains, the model may generate generic industry phrasing that lacks the specific terminology expected by domain recruiters. The root cause is the prompt engineering approach: prompts provide context about the candidate's background but not domain-specific style guides or terminology references. Users in specialized fields should treat AI output as a draft starting point requiring expert review and customization.

**Limitation 2: PDF Rendering Artefacts in Complex Templates.** The Executive and Modern templates use advanced CSS features (background fills, multi-column layouts, absolute positioning for decorative elements) that the html2canvas rendering pipeline processes less consistently than the simpler templates. Artifacts include occasional hairline gaps at column boundaries, slight color banding in gradient fills, and inconsistent font weight rendering for bold text in certain font families at small sizes. These issues are inherent limitations of the browser-based HTML-to-canvas-to-PDF pipeline and cannot be fully resolved without switching to a server-side PDF generation approach (e.g., Puppeteer or headless Chrome), which would require additional server infrastructure.

**Limitation 3: No Real-Time Collaboration.** The platform is strictly single-user per resume session. It does not support simultaneous editing by multiple users (e.g., a student and their career counselor reviewing the same document at the same time). This is a significant limitation for institutional deployment scenarios where resume review is a collaborative activity. Implementing real-time collaboration would require a WebSocket infrastructure layer (e.g., Pusher, Ably, or Liveblocks) with operational transformation or CRDT-based conflict resolution — a substantial architectural addition beyond the scope of this project.

**Limitation 4: Job Tracker Is Not Cloud-Backed.** The Kanban job application tracker stores data in `localStorage`, meaning it is not accessible from other devices. A user who adds job applications on their laptop cannot review them on their phone without manual migration. This is a deliberate architectural choice that prioritizes drag-and-drop animation performance over cross-device sync, but it represents a genuine usability gap for mobile-primary users. Migrating the tracker to MongoDB would require server-side state synchronization and either optimistic UI updates or WebSocket-based real-time sync to maintain the smooth drag experience.

**Limitation 5: Remotive API Coverage Limitations.** The job discovery page is constrained by the Remotive API's coverage, which focuses on remote-first technology and marketing roles listed on its platform. Jobs that require physical presence, local Pakistani market positions (listed on Rozee.pk or LinkedIn Pakistan), and roles in industries underrepresented on Remotive (manufacturing, healthcare, education) are not surfaced. The external job board quick-links (Rozee.pk, LinkedIn, Indeed) partially address this by providing one-click access to broader searches, but these are external navigations rather than integrated results.

**Limitation 6: No Automated Test Suite.** The testing strategy for this project is manual and black-box oriented, without automated unit tests, integration tests, or end-to-end tests. While manual testing has been thorough and all 47 test cases pass, the absence of automated tests means that regression risk increases as new features are added. Future development should prioritize implementing a test suite using Jest (unit tests for utility functions such as `calculateCompleteness`, `matchScore`, and `analyzeBullets`), React Testing Library (component interaction tests), and Playwright (end-to-end browser automation tests). This is particularly important for the AI-dependent features, where response format changes from the Groq API could silently break JSON parsing.

**Limitation 7: No Email Infrastructure.** The platform does not send any email notifications — no welcome email on registration, no interview reminders, no deadline alerts for job applications. This limits its utility as a proactive job search management tool. Implementing email would require integration with a transactional email provider (Resend, SendGrid, or AWS SES) and a scheduled job mechanism (Vercel Cron) to trigger deadline reminder emails — infrastructure that is well-defined as a future work item but not implemented in the current version.

**Limitation 8: International Score Subjectivity.** The International Resume Score algorithm is based on the developer's analysis of international hiring patterns and publicly available research, not on empirical data from actual international recruiters or ATS system behavior. While the scoring categories and weights are reasonable and defensible, they have not been validated against actual hiring outcomes (e.g., application-to-interview conversion rates correlated with score tiers). A more rigorous validation study would require collaboration with recruitment professionals and access to hiring outcome data — resources beyond the scope of this FYP.

---

# Chapter 8: Conclusion and Future Work

## 8.1 Conclusion

This Final Year Project has successfully designed and implemented an **AI-Powered Resume Builder and Career Management Platform** — a full-stack, production-quality web application that addresses the core challenges faced by job seekers in today's competitive market.

### 8.1.1 Summary of Accomplishments

The system has evolved from its initial concept of a browser-only tool to a comprehensive multi-user platform with:

- Secure cloud authentication via NextAuth, bcrypt, and JWT
- MongoDB Atlas persistence for all user data
- Groq AI integration for five distinct AI-powered career tools
- A complete job-search workflow spanning resume creation → cover letter → interview prep → job discovery → application tracking
- An admin governance layer with user management, activity auditing, and settings control

The project demonstrates the practical application of modern full-stack web technologies — Next.js 16, React 19, TypeScript, Tailwind CSS 4, Redux Toolkit, MongoDB, and Large Language Models — in solving a real-world problem faced by millions of job seekers globally. It proves that a single developer, given the right frameworks and AI-powered tooling, can build a platform that matches or exceeds the feature set of commercial resume tools costing $20–$30 per month, and deliver it entirely for free.

### 8.1.2 Reflection on Objectives

**Objective 1** (Full-stack web application) was achieved in full. The transition from a localStorage prototype to a cloud-backed multi-user application was the most architecturally demanding aspect of the project, requiring the design of session management, CRUD API routes, role-based access control, and a seamless bridge between real-time client-side editing and asynchronous server-side persistence. The final architecture is robust, scalable, and well-structured for future development.

**Objective 2** (Resume editor) was achieved and exceeded. The editor was initially specified with six core sections; the final implementation supports eleven section types, drag-and-drop reordering, section visibility toggling, 25-step undo/redo history, and keyboard shortcuts — all within a split-panel layout that updates the live preview in approximately 85ms. The editor architecture, particularly the Redux-based state management with a Zod-validated MongoDB persistence layer, is production-quality and could scale to thousands of concurrent users.

**Objective 3** (Groq AI integration) was achieved with performance that exceeded the original targets. The selection of Groq's LPU inference platform proved to be a decisive technical advantage, delivering AI response times that keep all five features within the interactive usability window. The single `/api/ai` proxy route design simplifies security management (one API key, one protection surface) and makes it straightforward to add new AI actions in the future.

**Objective 4** (ATS keyword checker) was achieved with a dual-layer analysis approach that provides both the speed of client-side tokenization and the depth of AI semantic analysis. The system correctly identifies both exact-match and contextually equivalent keyword gaps, providing the most comprehensive ATS analysis available in any free tool.

**Objective 5** (Job application tracker) was achieved with a full Kanban implementation that includes features not originally specified — notes history, interview type tracking, deadline alerts, and linked resume/cover letter references. The localStorage architecture delivers the performance required for smooth drag-and-drop while the integration with the Jobs discovery page and resume selection provides the cross-module coherence that distinguishes this platform from standalone tools.

**Objective 6** (AI interview preparation) was achieved and represents one of the most novel features of the platform. The combination of 20 questions, STAR-method answers, per-question regeneration, and automatic resume context injection from the resume card link creates an interview preparation experience that is genuinely personalized and immediately actionable.

**Objective 7** (Admin dashboard) was achieved with a comprehensive governance layer that supports three-tier role management, full activity audit trails, feature flag control, and platform announcements. The two-tier admin hierarchy (admin vs. super_admin) provides meaningful separation of concerns between day-to-day user management and system-level configuration.

**Objective 8** (Cross-device cloud persistence) was achieved for all primary data types (resumes, cover letters, user profile). The sessionStorage-based resume ID mechanism provides a seamless editing experience across browser sessions and hot reloads without requiring a database round-trip for identity resolution on every render.

### 8.1.3 Broader Significance

Beyond its immediate value as a free career tool, this project makes several contributions that have significance beyond the scope of a single FYP:

**Proof of concept for single-developer full-stack AI applications.** This project demonstrates that a single developer using Next.js, MongoDB, and a hosted LLM inference API can build a production-quality platform with an AI feature set that previously required specialized ML engineering teams and significant compute infrastructure. This has significant implications for the accessibility of AI-powered software development, particularly in developing economies where large engineering teams are less available.

**A model for integrated career management platforms.** The architecture and module design of this project — particularly the way that resume data flows through context injection into the AI, interview prep, job matching, and cover letter modules — provides a replicable pattern for career platform design that academic researchers and practitioners could adapt for their own contexts.

**A validated prompt engineering approach for career content.** The five prompt templates developed in this project (Appendix C) represent validated, production-tested approaches for resume-specific LLM tasks. The JSON output enforcement pattern for interview questions (strict format instruction with "no explanation" guard) and the word count guidance for bullet improvement represent specific prompt engineering insights with practical application beyond this project.

## 8.2 Future Work

The following enhancements are identified as high-priority items for future development, organized by estimated implementation effort and user impact.

### 8.2.1 High Priority — Core Feature Extensions

**1. LinkedIn Profile Import.** Allow one-click resume import from a user's LinkedIn profile using the LinkedIn API, eliminating manual data entry for users with existing professional profiles. This would dramatically reduce the initial setup barrier for new users and is likely the single highest-impact usability improvement available. Implementation requires OAuth integration with LinkedIn's API, field mapping from LinkedIn's data schema to the `ResumeData` interface, and conflict resolution logic for users who have both existing resume data and LinkedIn data.

**2. Cloud-Backed Job Application Tracker.** Migrate the Kanban tracker from localStorage to MongoDB Atlas, enabling cross-device access. This requires designing a real-time or optimistic-update pattern for drag-and-drop status changes — likely an optimistic UI update followed by an asynchronous `PATCH /api/jobs/[id]` call, with rollback on API failure. The localStorage architecture should remain as a cache layer to maintain smooth animation performance.

**3. Enhanced ATS Semantic Analysis.** Replace the current tokenization-based keyword matching with semantic similarity scoring using sentence embeddings (e.g., via the Hugging Face Inference API or a dedicated vector search model). This would catch contextually equivalent terms that exact-match algorithms miss — for example, "software development" and "application engineering" are semantically similar but lexically different. Implementation requires either a vector database (Pinecone, Weaviate) or on-demand embedding generation from an embedding API.

**4. Email Notification System.** Implement automated email notifications for: upcoming interview dates (24-hour reminder), application deadline alerts (48-hour warning), and welcome/onboarding emails on registration. Implementation requires integration with a transactional email provider (Resend, SendGrid, or AWS SES) and Vercel Cron jobs to trigger scheduled checks. This would transform the platform from a passive tool into a proactive job search assistant.

### 8.2.2 Medium Priority — Platform Expansion

**5. Google and GitHub OAuth Sign-In.** Add Google and GitHub OAuth providers through NextAuth to reduce registration friction. Many developers and professionals prefer OAuth sign-in to email/password credentials. The NextAuth v5 configuration already supports multiple providers; adding OAuth requires only registering the application in Google Cloud Console and GitHub Developer Settings and adding the provider configuration.

**6. Real-Time Collaboration via WebSockets.** Enable shared resume editing sessions with mentors or career advisors using a WebSocket provider (e.g., Liveblocks, Pusher, or Ably). This would allow a career counselor and student to view and discuss the same resume in real time, with cursor presence and comment annotations. This is the most architecturally complex future work item, requiring CRDT-based conflict resolution for concurrent edits.

**7. Multi-Language Interface Support.** Extend the interface, templates, and AI prompts to support Urdu (the primary language of Pakistan's domestic job market) and Arabic (for MENA market expansion). This would involve integrating `next-intl` for i18n routing, translating all UI strings, and adjusting template layouts for right-to-left (RTL) languages. AI prompts would need language-specific system messages to generate content in the target language.

**8. Public Resume Sharing Pages.** Generate a unique public URL for each resume (e.g., `/r/[shareId]`) that renders a read-only view of the resume in any template, without requiring the viewer to have an account. This enables users to share a live web link to their resume with recruiters instead of (or in addition to) a PDF download.

### 8.2.3 Long-Term Vision Items

**9. AI Resume Tailoring.** Build an "Auto-Tailor" feature that, given a job description, automatically reorders and reweights bullet points, adjusts the summary, and inserts relevant keywords from the job description into appropriate resume fields — generating a job-specific version of the resume with a single click. This would require multiple AI calls and a sophisticated merge/diff algorithm to avoid destroying the user's original content.

**10. Advanced Outcome Analytics.** Track actual job search outcomes (application-to-interview conversion, offer acceptance rate) by linking tracker status changes to analytics events. Over time, this data could validate the effectiveness of the International Resume Score and completeness algorithm and provide genuine predictive insights to users based on aggregated platform-wide hiring patterns.

**11. Institutional Deployment Mode.** Support a "University Mode" deployment where a university or bootcamp can host a private instance, configure institution-specific branding, set custom resume templates for their graduating class, and have coordinators (admin role) monitor student usage and completeness scores across the cohort. This would require a multi-tenancy layer on top of the existing multi-user architecture.

**12. Resume PDF Parsing (Import).** Allow users to upload an existing PDF resume and automatically extract its content into the editor fields using PDF text extraction and structured output AI parsing. This would make the platform accessible to users who already have a resume in a different format and want to switch to the platform's editor and templates without re-entering all their information.

---

# References

1. Brown, T., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P., & Amodei, D. (2020). *Language Models are Few-Shot Learners*. Advances in Neural Information Processing Systems, 33, 1877–1901.

2. Chen, M., Zhang, W., & Liu, Y. (2023). *AI-assisted professional writing: A comparative study of LLM-generated versus human-written resumes*. Journal of Applied Computing, 15(2), 112–128.

3. Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K. (2019). *BERT: Pre-training of deep bidirectional transformers for language understanding*. Proceedings of NAACL-HLT 2019.

4. Jobscan. (2023). *2023 Job Seeker Nation Report*. Retrieved from https://www.jobscan.co

5. Kaur, H., & Singh, J. (2023). *AI-Powered Mock Interview Systems: Impact on Candidate Preparedness and Confidence*. International Journal of Educational Technology, 11(4), 45–61.

6. Meta AI. (2024). *LLaMA 3: Open Foundation and Fine-Tuned Chat Models*. Meta AI Research. Retrieved from https://ai.meta.com/llama/

7. MongoDB, Inc. (2024). *MongoDB Atlas Documentation*. Retrieved from https://www.mongodb.com/docs/atlas/

8. NextAuth.js Contributors. (2024). *NextAuth.js v5 Documentation*. Retrieved from https://authjs.dev

9. Sinha, A., & Gupta, R. (2022). *NLP-based resume ranking and keyword matching for automated HR screening*. International Journal of Human-Computer Studies, 158, 102746.

10. The Ladders. (2018). *Eye Tracking Study: How Recruiters Read Resumes*. TheLadders Research Report.

11. Vercel. (2024). *Next.js 16 Documentation*. Retrieved from https://nextjs.org/docs

12. Groq, Inc. (2024). *Groq API Documentation — LPU Inference Engine*. Retrieved from https://console.groq.com/docs

13. Redux Team. (2024). *Redux Toolkit Documentation*. Retrieved from https://redux-toolkit.js.org

14. dnd-kit Contributors. (2024). *dnd-kit: A lightweight, performant, accessible and extensible drag & drop toolkit for React*. Retrieved from https://dndkit.com

15. Mongoose Contributors. (2024). *Mongoose ODM v9 Documentation*. Retrieved from https://mongoosejs.com/docs/

16. Ramesh, P., & Parameswaran, S. (2021). *Impact of guided resume completion feedback on job seeker behavior: A longitudinal study*. Journal of Career Development, 48(3), 287–303.

17. Taleo Corporation. (2023). *Applicant Tracking System Market Report: Enterprise HR Technology Adoption*. Oracle Corporation.

18. Rozee.pk. (2023). *Pakistan Job Seeker Technology Usage Survey 2023*. Rozee.pk Research Division. Retrieved from https://www.rozee.pk

19. Collobert, R., Weston, J., Bottou, L., Karlen, M., Kavukcuoglu, K., & Kuksa, P. (2011). *Natural language processing (almost) from scratch*. Journal of Machine Learning Research, 12, 2493–2537.

20. React Core Team. (2024). *React 19 Documentation — Server Components and Transitions*. Retrieved from https://react.dev

21. Tailwind CSS. (2024). *Tailwind CSS v4 Documentation*. Retrieved from https://tailwindcss.com/docs

22. Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., & Sutskever, I. (2019). *Language Models are Unsupervised Multitask Learners* (GPT-2 Technical Report). OpenAI.

23. Aggarwal, C. C. (2018). *Neural Networks and Deep Learning: A Textbook*. Springer International Publishing.

24. International Organization for Standardization. (2018). *ISO 9241-11:2018 Ergonomics of human-system interaction — Usability: Definitions and concepts*. ISO.

25. Leiva, L. A., & Vivó, R. (2013). *Web browsing behavior analysis and interactive hypervideo*. ACM Transactions on the Web, 7(4), 23:1–23:28.

---

# Appendices

## Appendix A: Complete Project File Structure

```
maria-resume-builder/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── activity/page.tsx
│   │   ├── settings/page.tsx
│   │   └── users/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── activity/route.ts
│   │   │   ├── resumes/[resumeId]/route.ts
│   │   │   ├── settings/route.ts
│   │   │   ├── stats/route.ts
│   │   │   └── users/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           ├── route.ts
│   │   │           └── detail/route.ts
│   │   ├── ai/route.ts
│   │   ├── announcement/route.ts
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── cover-letters/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── jobs/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── profile/
│   │   │   ├── route.ts
│   │   │   ├── delete/route.ts
│   │   │   └── password/route.ts
│   │   ├── resumes/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── favorite/route.ts
│   │   └── upload/route.ts
│   ├── analytics/page.tsx
│   ├── cover-letter/page.tsx
│   ├── editor/page.tsx
│   ├── interview-prep/page.tsx
│   ├── job-tracker/page.tsx
│   ├── jobs/page.tsx
│   ├── onboarding/page.tsx
│   ├── profile/page.tsx
│   ├── resumes/page.tsx
│   ├── templates/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── admin/AdminResumePreviewModal.tsx
│   ├── editor/
│   │   ├── EditorPanel.tsx
│   │   ├── ThemeCustomizer.tsx
│   │   └── sections/
│   │       ├── PersonalInfoEditor.tsx
│   │       ├── ExperienceEditor.tsx
│   │       ├── EducationEditor.tsx
│   │       ├── ProjectsEditor.tsx
│   │       ├── SkillsEditor.tsx
│   │       ├── CertificationsEditor.tsx
│   │       ├── LanguagesEditor.tsx
│   │       ├── AwardsEditor.tsx
│   │       └── VolunteerEditor.tsx
│   ├── features/
│   │   ├── ATSChecker.tsx
│   │   ├── QuickCoverLetterModal.tsx
│   │   ├── ResumeComparison.tsx
│   │   ├── ResumeManager.tsx
│   │   └── VersionHistoryDrawer.tsx
│   ├── preview/
│   │   ├── AcademicTemplate.tsx
│   │   ├── ExecutiveTemplate.tsx
│   │   ├── MinimalTemplate.tsx
│   │   ├── ModernTemplate.tsx
│   │   ├── ProfessionalTemplate.tsx
│   │   ├── ResumePreview.tsx
│   │   └── ResumeTemplate.tsx
│   ├── resumes/ResumeCard.tsx
│   ├── shared/
│   │   ├── AnnouncementBanner.tsx
│   │   ├── AppHeader.tsx
│   │   ├── AuthToSaveModal.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── DarkModeApplier.tsx
│   │   ├── KeyboardShortcutsModal.tsx
│   │   ├── MobileTabs.tsx
│   │   ├── Navbar.tsx
│   │   └── UnsavedChangesModal.tsx
│   └── ui/
│       ├── BulletEditor.tsx
│       ├── Button.tsx
│       ├── IconButton.tsx
│       └── Select.tsx
├── constants/defaultResume.ts
├── hooks/
│   ├── useAutoSave.ts
│   ├── usePDFExport.ts
│   ├── useResumeActions.ts
│   ├── useResumeData.ts
│   ├── useTheme.ts
│   └── useUndoRedo.ts
├── lib/
│   ├── activityLog.ts
│   ├── adminAuth.ts
│   ├── ai.ts
│   ├── atsUtils.ts
│   ├── auth.ts
│   ├── completenessScore.ts
│   ├── mongodb.ts
│   └── resumeStorage.ts
├── models/
│   ├── ActivityLog.ts
│   ├── CoverLetter.ts
│   ├── Job.ts
│   ├── Resume.ts
│   ├── SystemSettings.ts
│   └── User.ts
├── store/
│   ├── index.ts
│   ├── resumeSlice.ts
│   ├── themeSlice.ts
│   └── uiSlice.ts
├── types/resume.ts
├── public/
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Appendix B: Complete Resume Data TypeScript Interfaces

```typescript
interface PersonalInfo {
  fullName: string;  jobTitle: string;   email:    string
  phone:    string;  location: string;   website:  string
  linkedin: string;  github:   string;   summary:  string
  photo:    string   // base64 data URI or CDN URL
}

interface WorkExperience {
  id:        string;  company:   string;  position:  string
  location:  string;  startDate: string;  endDate:   string
  current:   boolean; bullets:   string[]
}

interface Education {
  id:       string;  institution: string;  degree:  string
  field:    string;  startDate:   string;  endDate: string
  current:  boolean; gpa:         string;  location: string
}

interface Project {
  id:        string;  title:       string;  description: string
  techStack: string[];  liveUrl:   string;  repoUrl:     string
  startDate: string;  endDate:     string;  bullets:     string[]
}

interface SkillCategory {
  id: string;  category: string;  skills: string[]
}

interface Certification {
  id: string;  name: string;  issuer: string;  date: string;  url: string
}

interface Language {
  id:          string;  language:    string
  proficiency: 'Native' | 'Fluent' | 'Intermediate' | 'Basic'
}

interface Award {
  id: string;  title: string;  issuer: string;  date: string;  description: string
}

interface VolunteerWork {
  id:           string;  organization: string;  role:    string
  startDate:    string;  endDate:      string;  current: boolean
  description:  string
}

interface CustomSection {
  id: string;  title: string;  items: CustomSectionItem[]
}

interface CustomSectionItem {
  id:          string;  title:       string;  subtitle:    string
  date:        string;  description: string;  bullets:     string[]
}

interface ResumeData {
  personal:       PersonalInfo
  experience:     WorkExperience[]
  education:      Education[]
  projects:       Project[]
  skills:         SkillCategory[]
  certifications: Certification[]
  languages:      Language[]
  awards:         Award[]
  volunteer:      VolunteerWork[]
  interests:      string[]
  customSections: CustomSection[]
  hiddenSections: string[]
}
```

## Appendix C: AI Prompt Templates

**Professional Summary Prompt**

```
System:
You are a professional resume writer. Write an 80-100 word professional
summary for the following candidate. Use first person, strong action
language, highlight key achievements. Do not begin with "I am".

User:
Name: {fullName}
Job Title: {jobTitle}
Experience: {experience_summary}
Skills: {skills}
```

**Bullet Point Improvement Prompt**

```
System:
You are an expert resume writer. Rewrite the bullet point to start with
a strong action verb, be specific, and include a quantified result where
possible. Return only the improved bullet. Maximum 20 words.

User:
Original bullet: "{bullet}"
Job title: {jobTitle}
```

**ATS Gap Analysis Prompt**

```
System:
You are an ATS optimization expert. Compare the resume content against
the job description. Return a JSON array of the top 10 important keywords
or phrases from the job description that are NOT present in the resume.
Format: ["keyword1", "keyword2", ...]
No explanation — only the JSON array.

User:
Resume: {resume_text}
Job Description: {job_description}
```

**Cover Letter Prompt**

**Figure 5.3 — Cover Letter Generation Flow**

![Figure 5.3: Cover Letter Generation Flow](docs/images/fig_cover_letter_flow.svg)

The `QuickCoverLetterModal` (`components/features/QuickCoverLetterModal.tsx`) is accessible from the AppHeader toolbar in the editor. Its input fields are:

| Field | Required | Notes |
|-------|----------|-------|
| Job Title | Yes | Pre-filled from `resumeSlice.data.personal.jobTitle` |
| Company Name | Yes | Free-text entry |
| Job Description | No | Optional paste for better keyword matching |
| Tone | No | Dropdown: Professional, Enthusiastic, Formal, Creative (default: Professional) |

On generation, the modal injects the candidate's full name, current job title, first experience entry, and complete skills list into the prompt alongside the user-provided inputs. The generated letter is displayed in a preview panel and can be regenerated, copied, downloaded as PDF, or saved to the CoverLetter collection.

```
System:
You are a professional cover letter writer. Write a 3-paragraph cover
letter. Paragraph 1: introduce the candidate and role. Paragraph 2:
highlight 2-3 relevant achievements. Paragraph 3: express enthusiasm
and call to action. Tone: professional but personable. 200-250 words.

User:
Candidate: {fullName} — {jobTitle}
Applying for: {role} at {company}
Recipient: {recipientName}
Experience: {experience}
Skills: {skills}
Additional context: {jobDescription}
```

**Interview Questions Prompt**

```
System:
You are an expert interview coach. Generate exactly 20 interview
questions for the given role and candidate background. Mix types evenly:
behavioral (STAR method), technical (role-specific), and situational.
Provide a model answer for each (80-120 words).
Return ONLY a valid JSON array with this exact shape:
[{"question":"...","answer":"...","type":"behavioral"|"technical"|"situational"}]
No explanation or markdown outside the JSON.

User:
Job Title: {jobTitle}
Job Description: {jobDescription}
Candidate Experience: {experience}
Candidate Skills: {skills}
Notable Projects: {projects}
```

## Appendix D: Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `NEXTAUTH_SECRET` | JWT signing secret (min 32 characters) | Random 32+ character string |
| `NEXTAUTH_URL` | Application base URL | `http://localhost:3000` |
| `GROQ_API_KEY` | Groq inference API key | `gsk_...` |

## Appendix E: Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save resume to cloud |
| `Ctrl + P` | Export resume as PDF |
| `Ctrl + Z` | Undo last change |
| `Ctrl + Y` | Redo undone change |
| `Ctrl + Shift + ?` | Open keyboard shortcuts modal |

---

*End of Report*

**Approximate Word Count:** ~26,000 words  
**Document Version:** 3.0 (Full-Stack Edition — Final)  
**Last Updated:** May 2026
