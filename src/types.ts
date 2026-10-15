export interface Role {
  company: string;
  context: string;
  title: string;
  dates: string;
  /** Factual, tech-focused lines. Keep specific-project detail light. */
  lines: string[];
  stack: string[];
}

export interface TechGroup {
  label: string;
  items: string[];
}

export interface CV {
  name: string;
  tagline: string;
  location: string;
  primaryStack: string[];
  summary: string[];
  techGroups: TechGroup[];
  roles: Role[];
}

export type Project = {
  name: string;
  /** 1-3 sentence description shown on the card front. */
  blurb: string;
  tech: string[];
} & (
  | { githubUrl: string; pagePath?: never }
  | { pagePath: string; githubUrl?: never }
);

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
}
