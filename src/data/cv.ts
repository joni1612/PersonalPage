import type { CV } from "../types";

export const cv: CV = {
  name: "Jonathan Griesinger",
  tagline: "Fullstack developer building production web apps end-to-end.",
  location: "Currently based in South Korea.",
  primaryStack: ["React", "TypeScript", "Node.js", "AWS"],

  summary: [
    "Fullstack developer focused on modern frontend frameworks (React, Next.js, TypeScript) with solid backend and cloud experience on Node.js and AWS.",
    "I like owning features end-to-end: architecture, UI, API design, and deployment. Comfortable stepping into ambiguous, high-stakes work such as large migrations, greenfield builds, and compliance-sensitive features, and shipping them to production.",
  ],

  techGroups: [
    {
      label: "Frontend",
      items: ["React", "Next.js", "TypeScript", "JavaScript", "Vue.js", "Zustand"],
    },
    {
      label: "Backend & Cloud",
      items: ["Node.js", "AWS Lambda", "Google Cloud", "Python", "REST & SOAP APIs"],
    },
    {
      label: "Tooling & CMS",
      items: ["Storybook", "Sanity", "Storyblok", "Flutter", "Git"],
    },
    {
      label: "Ways of working",
      items: ["Scrum & Agile", "AI-assisted dev (Cursor, Claude, Copilot)"],
    },
  ],

  roles: [
    {
      company: "FIL Fondsbank (FFB)",
      context: "German banking subsidiary of Fidelity International",
      title: "Assistant Manager Software Development / Fullstack Developer",
      dates: "Mar 2024 – May 2026",
      lines: [
        "Took ownership of two production React/TypeScript applications, a retail investment portal and a robo-advisor, continuing feature development and maintenance under banking compliance requirements.",
        "Carried out a large-scale JavaScript to TypeScript migration, and contributed to a customer identity and access management migration and a new account-creation journey (Zustand for state).",
      ],
      stack: ["React", "TypeScript", "Node.js", "AWS Lambda", "Zustand"],
    },
    {
      company: "Triplesense Reply",
      context: "Digital web agency, Frankfurt (Reply Group)",
      title: "Fullstack / Frontend Developer",
      dates: "Mar 2022 – Feb 2024",
      lines: [
        "Delivered web applications for enterprise clients across industries, ranging from greenfield builds to features on existing products.",
        "Built a Next.js greenfield app with a headless CMS (Sanity) using an atomic-design component approach, and worked with Storyblok on other engagements.",
      ],
      stack: ["React", "Next.js", "TypeScript", "Storybook", "Sanity", "Storyblok"],
    },
    {
      company: "Garuda Development",
      context: "Self-founded software studio",
      title: "Co-Founder / Developer",
      dates: "Nov 2022 – Sep 2023",
      lines: [
        "Co-founded a small studio building mobile apps and AI-integrated tools.",
        "Built and deployed a custom AI chatbot for a client, integrated into Slack via a Google Cloud microservice, handling Q&A and PDF summarisation through the ChatGPT API.",
      ],
      stack: ["React", "TypeScript", "Python", "Flutter", "Google Cloud", "ChatGPT API"],
    },
    {
      company: "CIB Software",
      context: "Munich software company (document & OCR products)",
      title: "Software Development Intern",
      dates: "Feb 2021 – Jul 2021",
      lines: [
        "Built a full-stack internal crowdsourcing platform for labelling training data used by named-entity-recognition models.",
      ],
      stack: ["Vue.js", "Bootstrap", "Python"],
    },
  ],
};
