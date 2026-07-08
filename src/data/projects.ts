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
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS",  "next-intl"],
    githubUrl: "https://github.com/joni1612/runningplan_v2",
  },
  {
    name: "Fitness Plan Generator",
    blurb:
      "AI-generated 12-week running plans built from your Jack Daniels VDOT fitness level and delivered as a PDF, with Stripe payments and 11 languages.",
    tech: ["Next.js", "React", "TypeScript", "OpenAI", "Stripe", "Tailwind CSS"],
    githubUrl: "https://github.com/joni1612/running-plan-generator",
  },
];
