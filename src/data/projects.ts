import type { Project } from "../types";

// NOTE: githubUrl slugs below are best guesses (user: joni1612).
// Adjust each to the exact repository name if it differs.
export const projects: Project[] = [
  {
    name: "RAG Doc Chat",
    blurb:
      "Ask questions across pre-loaded documents and get answers grounded in the source, each with a citation that opens the PDF to the exact page.",
    tech: ["Python", "FastAPI", "Qdrant", "OpenAI", "Claude", "React"],
    githubUrl: "https://github.com/joni1612/rag_demo",
  },
  {
    name: "RunCoach",
    blurb:
      "Personalized 12-week Norwegian Method running plans from a short questionnaire, built by a pure deterministic engine (no AI, no database) and exported to PDF.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "next-intl"],
    githubUrl: "https://github.com/joni1612/runningplan_v2",
  },
  {
    name: "Fitness Plan Generator",
    blurb:
      "AI-generated 12-week running plans built from your Jack Daniels VDOT fitness level and delivered as a PDF, with Stripe payments and 11 languages.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "OpenAI",
      "Stripe",
      "Tailwind CSS",
    ],
    githubUrl: "https://github.com/joni1612/running-plan-generator",
  },
  {
    name: "Invoice Extractor",
    blurb:
      "Ingests PDF and JPEG invoices, extracts structured data with Claude's vision, validates the results, flags duplicates, and lays everything out in a table.",
    tech: ["Python", "FastAPI", "Claude", "React", "Vite", "Tailwind CSS"],
    githubUrl: "https://github.com/joni1612/DemoInvoiceExtractor",
  },
  {
    name: "Job Pipeline Assistant",
    blurb:
      "Scrapes job postings on a schedule, dedups every listing, scores each one against your profile asynchronously, and drafts a tailored cover letter on demand — local-first and volume-backed via docker-compose.",
    tech: [
      "iii.dev",
      "Python",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Docker",
      "SQLite",
      "Claude",
    ],
    githubUrl: "https://github.com/joni1612/JobSearchPipeline",
  },
  {
    name: "Intervals ICU Companion App",
    blurb:
      "A native iOS companion for a quick training check: Fitness, Fatigue and Form, readable activity charts, kilometre splits, a calendar and a Home Screen widget. Connected to Intervals.icu with read-only OAuth access.",
    tech: ["Swift", "SwiftUI", "Swift Charts", "WidgetKit", "OAuth", "Cloudflare Workers"],
    pagePath: "/intervalsicu",
  },
];
