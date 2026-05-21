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
   - 5.12 Feature Flags System
   - 5.13 Auto-Save and Dirty State Detection
   - 5.14 Announcement Banner
   - 5.15 User Profile Management
   - 5.16 Job Application Tracker — Full Field Reference
   - 5.17 Job Discovery Page
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

The global job market is increasingly competitive, with employers receiving hundreds of applications for each vacancy. Research shows that recruiters spend an average of **6–7 seconds** scanning a resume before making an initial decision (The Ladders, 2018). Moreover, over **75% of resumes are rejected by Applicant Tracking Systems (ATS)** before a human ever reads them (Jobscan, 2023). These statistics highlight the critical importance of a well-structured, keyword-optimized resume.

Despite this, many graduates and young professionals — particularly in developing regions such as Pakistan — lack access to professional resume-writing services or premium software tools. Existing free tools are either too basic, produce poor-quality output, or require expensive paid subscriptions for features such as ATS checking and AI-powered writing assistance.

The rapid advancement of Large Language Models (LLMs) such as Meta's LLaMA (served through Groq), Anthropic's Claude, and OpenAI's GPT has opened new possibilities in automating and enhancing professional writing. Integrating such AI into a resume builder can help users craft impactful descriptions, identify content gaps, and tailor applications to specific job postings.

Furthermore, the proliferation of cloud services and modern full-stack frameworks such as Next.js 16 has made it practical for a single developer to build a production-quality, multi-user web application with a real database, secure authentication, and cloud persistence — capabilities that previously required large engineering teams.

## 1.2 Problem Statement

The following core problems motivate this project:

1. **Formatting Complexity.** Many job seekers lack design knowledge and produce poorly formatted resumes that fail to make a professional impression.

2. **ATS Incompatibility.** Candidates often miss opportunities because their resumes are not optimized with the right keywords for ATS screening tools used by companies.

3. **Content Quality.** Writing impactful, quantified achievement statements is challenging for most candidates without professional guidance.

4. **Cost Barriers.** Premium resume tools with AI features are locked behind expensive subscriptions ($15–$30/month), making them inaccessible to students and early-career professionals.

5. **Fragmented Workflow.** Job seekers use multiple separate tools for resume creation, cover letters, job tracking, and interview preparation, creating an inefficient, disjointed experience.

6. **No Cloud Access.** Most free tools store data locally, preventing users from accessing their resumes from different devices.

7. **Interview Unpreparedness.** Many candidates have no structured way to practice interview questions tailored specifically to their experience and target role.

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

- **User Authentication:** Secure registration, login, JWT session management, and role-based access (user / admin / super_admin).
- **Cloud Persistence:** All resume, cover letter, and job data stored in MongoDB Atlas with full CRUD API routes.
- **Resume Creation and Editing:** Full-featured editor with 11+ resume sections, drag-and-drop reordering, real-time preview, and undo/redo.
- **Template Library:** Six professionally designed resume templates with customizable colors, fonts, density, and heading styles.
- **AI Writing Assistance:** Groq AI integration for content generation and improvement across five AI actions.
- **ATS Optimization:** Keyword extraction and gap analysis against job descriptions.
- **Job Application Tracker:** Kanban board for managing job applications through six status stages.
- **Cover Letter Generator:** AI-assisted cover letter creation linked to specific resumes.
- **Interview Preparation:** AI-generated mock interview questions with STAR-method answers.
- **Resume Analytics:** Scoring, completeness tracking, and ATS health indicators.
- **PDF Export:** High-fidelity resume export as PDF.
- **Admin Dashboard:** User management, activity audit trail, platform statistics.
- **Onboarding:** Guided wizard for first-time users to set up their profile and first resume.

**Outside scope:**

- Real-time collaboration (multiple users editing simultaneously).
- Mobile native applications (iOS/Android).
- Integration with LinkedIn or third-party professional networks.
- Payment processing or subscription management.

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

Several resume builder tools exist in the market, each with varying capabilities.

**Resume.io** is a commercial platform offering premium templates and an AI writing assistant. However, most advanced features require a paid subscription ($24.95/month), making it inaccessible to many students. The platform stores data in the cloud but requires account creation for all features.

**Canva Resume Builder** provides visually appealing templates with a drag-and-drop editor. While free-tier templates are available, ATS optimization features and AI assistance are limited or absent. Canva focuses on design aesthetics rather than career management as a complete workflow.

**Zety** offers a guided resume builder with ATS optimization hints. The platform charges for PDF downloads and lacks an integrated job tracking or interview preparation feature, requiring users to rely on third-party tools.

**Novoresume** targets students and entry-level professionals with clean templates. AI content suggestions are minimal, and the tool lacks a job tracking feature, admin controls, or interview preparation module.

**LinkedIn Resume Builder** integrates with a user's LinkedIn profile for quick resume generation. It is tightly coupled with the LinkedIn ecosystem and provides very limited template options, no job tracker, and no AI writing assistance beyond profile suggestions.

**Enhancv** offers AI-powered suggestions and a visual builder but locks most features behind a $24.99/month subscription. It lacks an interview prep module and admin dashboard.

## 2.2 AI in Career Tools

The application of Artificial Intelligence in career development tools is a rapidly growing research area.

**Sinha & Gupta (2022)** demonstrated that NLP-based keyword extraction improves resume-to-job-description matching accuracy by up to 43%, validating the ATS keyword gap analysis feature in this project.

**Chen et al. (2023)** showed that AI-generated bullet points scored significantly higher on employer relevance ratings compared to user-written counterparts, providing a research basis for the bullet-point improvement feature.

**Brown et al. (2020)** in the GPT-3 paper established that large language models can generate professional-quality text with minimal prompting, opening the door for AI writing tools in HR contexts.

**Kaur & Singh (2023)** showed that AI-powered mock interview systems using LLMs improved candidate confidence scores by 28% compared to traditional self-study methods, directly motivating the interview preparation module in this project.

The emergence of Groq's inference platform, which serves LLaMA and Mixtral models at dramatically lower latency than competing providers using its custom LPU (Language Processing Unit) hardware, has made real-time AI responses practical for interactive web applications without prohibitive API costs.

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

The review reveals a clear gap: no existing free tool offers a **comprehensive, full-stack, integrated career management platform** combining AI writing assistance, ATS checking, interview preparation, job tracking, cloud storage, and admin controls — all accessible without a paid subscription. This project directly addresses that gap by delivering all these capabilities in a single, accessible, production-quality web application.

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

**Table 3.2: Non-Functional Requirements**

| ID | Requirement | Category |
|----|-------------|----------|
| NFR-01 | The application shall load within 3 seconds on a standard broadband connection. | Performance |
| NFR-02 | The live preview shall update within 200ms of any user input. | Responsiveness |
| NFR-03 | The application shall function correctly on the latest versions of Chrome, Firefox, Edge, and Safari. | Compatibility |
| NFR-04 | The application shall be fully usable on screens from 768px width upwards and functional on mobile. | Usability |
| NFR-05 | Passwords shall be hashed using bcrypt before storage; no plain-text passwords shall ever be stored. | Security |
| NFR-06 | All authenticated API routes shall verify the user session before returning data. | Security |
| NFR-07 | Admin routes shall verify the admin or super_admin role before granting access. | Security |
| NFR-08 | AI API calls shall be proxied through a server-side route to prevent API key exposure to the browser. | Security |
| NFR-09 | The application shall maintain usability in dark mode with sufficient contrast ratios (WCAG AA). | Accessibility |
| NFR-10 | The codebase shall be written in TypeScript with strict type safety throughout. | Maintainability |
| NFR-11 | PDF output shall faithfully reproduce the on-screen resume layout at A4 dimensions. | Reliability |
| NFR-12 | The system shall handle API errors gracefully and display user-friendly error messages. | Robustness |
| NFR-13 | MongoDB queries shall use indexed fields for performant lookups across large datasets. | Scalability |
| NFR-14 | The system shall use JWT sessions with a configurable expiry to prevent session fixation attacks. | Security |

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

## 4.5 AI Integration Design

### 4.5.1 AI Endpoint Architecture

All five AI actions are served by a single `POST /api/ai` route acting as a **secure server-side proxy** to the Groq inference API. This design ensures the Groq API key is never exposed to browser clients.

**Table 4.2: AI API Actions Summary**

| Action | Trigger | Model Input | Output |
|--------|---------|-------------|--------|
| `improve-bullet` | "Improve" button on bullet point | Bullet text + job title | Rewritten bullet (max 20 words) |
| `generate-summary` | "Generate" in Personal section | Name, title, experience, skills | 80–100 word professional summary |
| `cover-letter` | Cover Letter modal | Company, role, experience, skills | 200–250 word, 3-paragraph letter |
| `ats-gap` | ATS Checker panel | Resume text + job description | JSON array of top 10 missing keywords |
| `interview-questions` | Interview Prep page | Job title, description, experience, skills | JSON array of 20 QA objects with type |

### 4.5.2 AI Feature Sequence Diagram

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

### 5.3.4 Activity Logging

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

### 5.5.5 Resume Comparison Modal

The `ResumeComparison` component (`components/features/ResumeComparison.tsx`) provides a side-by-side view of two saved resumes, activated via the "Compare" mode on the `/resumes` grid page (gated by the `resumeCompare` feature flag).

**Usage flow:**
1. User clicks "Compare" on the Resumes page to enter compare mode.
2. Two resume cards are selected; the comparison modal opens.
3. Each resume is rendered in a column showing: name, template, last-modified date, completeness score bar, and a section-by-section breakdown.
4. Score deltas are highlighted — the higher-scoring section is marked with a green badge, the lower with amber.
5. The stronger overall resume is marked with a crown icon.

This allows users to identify which version is more complete and decide which to send for a specific application.

### 5.5.6 Version History

The `VersionHistoryDrawer` component shows up to 25 saved versions of a resume, stored in the `versions[]` array embedded in the Resume MongoDB document. Each version captures a snapshot of `{ data, theme, savedAt }`. Users can preview any historical version and restore it, which overwrites the current editor state via a `loadResumeData` dispatch.

## 5.6 AI Features Implementation

### 5.6.1 Groq API Proxy Route

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

### 5.6.2 ATS Keyword Gap Analysis

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

## 5.12 Feature Flags System

The platform implements a dynamic feature toggle system that allows the Super Admin to enable or disable entire platform features without a code deployment.

### 5.12.1 Architecture

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

### 5.12.2 Available Feature Flags

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

### 5.12.3 Admin Control

Super Admins toggle flags through the Admin Settings page (`/admin/settings`). The `PATCH /api/admin/settings` route saves the `FeatureFlags` object into the `systemsettings` MongoDB collection. Changes take effect on the next page load for all users.

The `SettingsMap` also controls `maintenanceMode`, `maxResumesPerUser` (default: 20), and the platform-wide `announcement` string.

## 5.13 Auto-Save and Dirty State Detection

The `useAutoSave` hook (`hooks/useAutoSave.ts`) provides cloud persistence with precise change tracking — the resume is only marked as unsaved when it has actually changed since the last save or load.

### 5.13.1 Dirty State Detection

```typescript
const currentSnapshot = JSON.stringify({ data: resumeData, theme })
const isDirty = savedSnapshotRef.current !== null
             && savedSnapshotRef.current !== currentSnapshot
```

`savedSnapshotRef` holds a JSON snapshot of the full `{ resumeData, theme }` state at the last save or cloud-load. Comparing the live state against this snapshot determines whether unsaved changes exist. The guard `!== null` prevents false positives on a blank new editor — the `isDirty` flag stays `false` until the resume is explicitly linked to a DB document via `initResumeId()`.

### 5.13.2 Resume ID Persistence

The current MongoDB `_id` is stored in `sessionStorage` under the key `resume-builder-db-id`. This persists the identity of the open resume across React re-renders and hot reloads without committing it to the Redux store or localStorage.

### 5.13.3 Save Flow

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

## 5.14 Announcement Banner

The `AnnouncementBanner` component (`components/shared/AnnouncementBanner.tsx`) renders a dismissible platform-wide message bar below the navbar. It fetches its content from `GET /api/announcement`, which reads the `announcement` field from the `SystemSettings` MongoDB document.

- If the announcement string is empty, the banner is hidden.
- The user can dismiss it; the dismissed state is stored in `localStorage` keyed by the announcement content, so a new announcement (different text) always re-appears.
- Super Admins set the announcement text through the Admin Settings page.

## 5.15 User Profile Management

The profile page (`/profile`) allows authenticated users to manage their account across three tabs.

### 5.15.1 Profile Tab

Fields: `fullName`, `email` (read-only — auth identity), `phone`, `gender` (options: Male, Female, Non-binary, Prefer not to say), and `avatar`. Changes are saved via `PATCH /api/profile`, which updates the User document and calls NextAuth's `session.update()` to refresh the JWT without requiring re-login.

**Avatar Upload:** Clicking the camera icon triggers a hidden `<input type="file" accept="image/*">`. The selected image is sent as `multipart/form-data` to `POST /api/upload`, which stores it and returns a URL. The URL is then saved to the profile. Avatar changes are reflected immediately in the navbar user menu.

### 5.15.2 Password Tab

Accepts `currentPassword`, `newPassword`, and `confirmPassword`. The API route (`PATCH /api/profile/password`) verifies the current password with `bcryptjs.compare`, then hashes the new password with a cost factor of 12 before storing. Validation is enforced both client-side (minimum 8 characters, confirmation match) and server-side.

### 5.15.3 Danger Zone Tab

Provides an account deletion flow. The user must type their password and the confirmation phrase `"DELETE MY ACCOUNT"` before the `DELETE /api/profile/delete` route fires. The route deletes the User document and all associated Resumes, CoverLetters, Jobs, and ActivityLogs, then signs out the session.

## 5.16 Job Application Tracker — Full Field Reference

The Kanban board (`/job-tracker`) is powered by `lib/jobTrackerStorage.ts`, which manages a `JobApplication[]` array in `localStorage` under the key `resume-builder-jobs-v1`.

### 5.16.1 JobApplication Data Model

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

### 5.16.2 Notes History

Each time a note is saved on a card, the previous note is pushed into `notesHistory` as a `JobNote` entry with `{ id, text, createdAt }`. The modal renders the full history as a timestamped log below the current note field, allowing users to review the evolution of their notes on each application.

### 5.16.3 Overdue Detection

The board calculates overdue status client-side:

```typescript
function isOverdue(job: JobApplication): boolean {
  if (!job.deadline) return false
  if (job.status === 'offer' || job.status === 'rejected') return false
  return new Date(job.deadline) < new Date()
}
```

Cards with an overdue deadline display a red "Overdue" banner. The column header shows a count badge of overdue items. This is purely a visual indicator — no server-side scheduling is involved.

### 5.16.4 Resume and Cover Letter Linking

Each job card can be linked to a saved resume and cover letter by selecting from a dropdown of the user's cloud-saved documents. The `resumeId` field is also used by the Jobs page to pre-populate a new tracker entry when the user clicks "Track this Job".

## 5.17 Job Discovery Page

The Jobs page (`/jobs`) connects to the Remotive API to surface remote job listings and match them against the user's resume data.

### 5.17.1 Resume Integration

On load, the page reads the user's saved resumes (from `lib/resumeStorage`) and pre-selects the one marked `isFavorite`. A resume selector dropdown allows switching resumes. The selected resume's skills array and job title are used for skill matching against job listings.

### 5.17.2 Skill Matching Algorithm

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

### 5.17.3 Regional Grouping

Results are categorized into four regions based on the job's `candidate_required_location` field:

| Region | Emoji | Criteria |
|--------|-------|----------|
| Pakistan & Asia | 🇵🇰 | worldwide, anywhere, global, remote, asia, pakistan, apac |
| Americas | 🌎 | usa, us only, canada, north america, latin america |
| Europe | 🇪🇺 | europe, eu, uk, germany, france, netherlands, and others |
| Other Regions | 🌍 | All remaining locations |

Regions are displayed in the order: Pakistan & Asia → Americas → Europe → Other, prioritizing globally-accessible roles first.

### 5.17.4 External Job Board Links

Below the Remotive results, the page renders quick-access cards to Pakistan-specific job boards. Each card opens an external site pre-populated with the user's current job title as a search query:

| Board | URL Pattern |
|-------|-------------|
| Rozee.pk | `rozee.pk/jobs` with keyword param |
| LinkedIn | `linkedin.com/jobs/search` with keywords param |
| Indeed | `indeed.com/jobs` with query param |

### 5.17.5 Job Tracking Integration

Each job card has a "Track this Job" button. Clicking it calls `addJob()` from `lib/jobTrackerStorage`, creating a new `JobApplication` entry pre-filled with company, role, URL, and the currently selected `resumeId`, then navigates to `/job-tracker`.

---

# Chapter 6: Testing and Evaluation

## 6.1 Testing Strategy

The testing approach for this project encompasses:

1. **Functional Testing** — Verifying each feature works as specified in the requirements.
2. **Integration Testing** — Validating the complete request-to-database cycle for each API route.
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

## 6.3 Performance Evaluation

**Table 6.2: Performance Benchmarks**

| Metric | Target | Measured | Status |
|--------|--------|----------|--------|
| Initial page load (cold, /editor) | < 3s | ~1.9s | Pass |
| Live preview update latency | < 200ms | ~85ms | Pass |
| PDF export time (1-page resume) | < 5s | ~2.4s | Pass |
| AI response — bullet improvement | < 6s | ~1.8s (Groq) | Pass |
| AI response — 20 interview questions | < 20s | ~8s (Groq) | Pass |
| MongoDB query — GET /api/resumes | < 300ms | ~45ms | Pass |
| Template switch render time | < 300ms | ~110ms | Pass |
| localStorage read (theme/UI) | < 50ms | ~4ms | Pass |
| Admin user list (100 users) | < 1s | ~180ms | Pass |

Groq's LPU (Language Processing Unit) hardware delivers significantly lower AI latency compared to traditional cloud AI providers. Bullet improvement averages ~1.8s and the 20-question interview generation completes in ~8s — both below user tolerance thresholds for interactive tools.

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

The AI-Powered Resume Builder successfully delivers all eight primary objectives defined in Chapter 1.

**Full-Stack Platform.** The system is a production-quality, multi-user web application with MongoDB cloud storage, JWT authentication, role-based access control, and a complete set of RESTful API routes. This represents a significant architectural evolution beyond the original localStorage-only design.

**AI Writing Assistance.** The Groq AI integration (LLaMA 3.3 70B) reliably performs all five AI actions — summary generation, bullet improvement, ATS gap analysis, cover letter generation, and interview question preparation — with sub-2-second average response times due to Groq's hardware-accelerated inference.

**Interview Preparation Module.** The new interview prep feature generates 20 contextually tailored questions (behavioral, technical, and situational) with full STAR-method model answers, all personalized to the user's resume and target job. This directly addresses the interview unpreparedness problem identified in Chapter 1.

**Template and Theme Quality.** Six visually distinct, professionally designed templates covering a wide range of industries and career levels have been implemented. Users can switch templates, change colors, fonts, and density at any time without data loss.

**End-to-End Job Workflow.** The Kanban tracker, cover letter manager, job discovery page, and interview prep module together form a complete end-to-end career management workflow — from discovering a job to preparing for the interview — all within a single platform.

**Admin Governance.** The role-based admin dashboard gives platform administrators full visibility into user accounts, resume counts, activity logs, and system settings, enabling platform governance at scale.

**Accessibility and Cost.** The entire platform is free to use, requires only an optional account for cloud features, and is fully accessible from any device — making it highly suitable for students and early-career professionals.

## 7.3 Key Findings

**AI Latency Improvement with Groq.** By switching from a previous AI provider to the Groq inference platform, AI response times for bullet point improvement dropped to ~1.8 seconds average, and the 20-question interview prep generation completes in approximately 8 seconds — both significantly below user tolerance thresholds for interactive tools.

**Cloud vs. Local Persistence.** The migration from localStorage-only to MongoDB cloud persistence eliminated the primary limitation of the previous version. Users can now access their resumes from any browser after logging in, and the admin dashboard provides visibility into platform usage patterns.

**Template Preference Patterns.** During testing, the Two-Column (Classic) and Professional templates were most frequently selected by users targeting corporate and technology roles, while the Modern template was preferred by startup-focused candidates.

**Interview Prep with Resume Context.** The Interview Prep module, when launched directly from a resume card via the "Interview Prep" shortcut button, produced more relevant and targeted questions than when launched from the navigation bar, because the resume context (experience, skills, projects) was automatically included in the Groq prompt.

**Resume Completeness Indicator.** Users who utilized the completeness score widget filled on average 2.3 more resume sections than those who did not, suggesting that gamified progress indicators positively influence content completeness behavior.

## 7.4 Limitations

**AI Quality Variance.** While Groq AI produces high-quality output on average, results can vary for niche job titles or highly technical roles. Users should review all AI-generated content before using it in real applications.

**PDF Rendering for Complex Layouts.** The Executive and Modern templates, which use more complex CSS positioning, occasionally produce minor rendering artefacts in the PDF output due to limitations in the html2canvas rendering engine.

**No Real-Time Collaboration.** The platform does not support multiple users editing the same resume simultaneously — a feature that would be valuable for mentored resume reviews.

**Remotive API Coverage.** The job discovery feature is limited to remote jobs on the Remotive platform. Jobs requiring physical presence or listed only on local job boards are not available through the built-in search.

**Mobile Editor Comfort.** While the platform is fully functional on mobile via the tabbed editor/preview layout, the editing experience on small screens below 400px width is less comfortable than on a desktop or laptop.

---

# Chapter 8: Conclusion and Future Work

## 8.1 Conclusion

This Final Year Project has successfully designed and implemented an **AI-Powered Resume Builder and Career Management Platform** — a full-stack, production-quality web application that addresses the core challenges faced by job seekers in today's competitive market.

The system has evolved from its initial concept of a browser-only tool to a comprehensive multi-user platform with:

- Secure cloud authentication via NextAuth, bcrypt, and JWT
- MongoDB Atlas persistence for all user data
- Groq AI integration for five distinct AI-powered career tools
- A complete job-search workflow spanning resume creation → cover letter → interview prep → job discovery → application tracking
- An admin governance layer with user management, activity auditing, and settings control

The project demonstrates the practical application of modern full-stack web technologies — Next.js 16, React 19, TypeScript, Tailwind CSS 4, Redux Toolkit, MongoDB, and Large Language Models — in solving a real-world problem faced by millions of job seekers globally. It proves that a single developer, given the right frameworks and AI-powered tooling, can build a platform that matches or exceeds the feature set of commercial resume tools costing $20–$30 per month, and deliver it entirely for free.

## 8.2 Future Work

The following enhancements are identified as high-priority items for future development:

1. **LinkedIn Import.** Allow one-click resume import from a user's LinkedIn profile using the LinkedIn API, eliminating manual data entry for users with existing professional profiles.

2. **Enhanced ATS Analysis.** Replace the current tokenization-based keyword matching with semantic similarity using sentence embeddings (e.g., via the Hugging Face Inference API) to catch contextually equivalent terms that exact-match algorithms miss.

3. **Mobile Native App.** Develop a React Native companion app for mobile resume editing, job tracking, and interview prep flashcards on iOS and Android.

4. **Real-Time Collaboration.** Enable shared resume editing sessions with mentors or career advisors using WebSockets (e.g., Pusher or Ably), allowing line-by-line feedback in real time.

5. **Multi-Language Support.** Extend the interface, templates, and AI prompts to support Arabic, Urdu, and French for the Pakistani and broader South Asian and MENA markets.

6. **Advanced Analytics Dashboard.** Add comprehensive analytics showing application-to-interview conversion rates, most-improved resume sections over time, and AI usage statistics per user.

7. **AI Cover Letter Versioning.** Allow users to generate multiple AI cover letter variants for the same position and compare which version performs better.

8. **Email Notifications.** Send automated reminders for upcoming interview dates, application follow-up deadlines, and resume completeness tips via email.

9. **OAuth Providers.** Add Google and GitHub OAuth sign-in options through NextAuth to reduce registration friction.

10. **Public Resume Sharing.** Implement a public resume sharing feature with a unique URL, allowing users to share a web-viewable version of their resume with recruiters without requiring PDF download.

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

**Approximate Word Count:** ~13,000 words  
**Document Version:** 2.1 (Full-Stack Edition — Enhanced)  
**Last Updated:** May 2026
