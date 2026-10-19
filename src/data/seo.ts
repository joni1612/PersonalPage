import { social } from "./site";

export const siteOrigin = "https://jonathangriesinger.de";

export const pageMetadata = {
  "/": {
    title: "Jonathan Griesinger — Fullstack Developer",
    description: "Jonathan Griesinger, fullstack developer building React, TypeScript, Node.js and AWS applications. Explore experience, skills and selected projects.",
    image: "portfolio",
  },
  "/projects": {
    title: "Projects — Jonathan Griesinger",
    description: "Explore Jonathan Griesinger’s web and native iOS projects, including document AI tools, running plan generators, Intervals ICU Companion and Tempo Studio.",
    image: "portfolio",
  },
  "/intervalsicu": {
    title: "Intervals ICU Companion — Jonathan Griesinger",
    description: "A native iOS companion for Intervals.icu. Check your training status, explore workouts and see your week at a glance.",
    image: "intervalsicu",
  },
  "/intervalsicu/privacy": {
    title: "Privacy policy · Intervals ICU Companion — Jonathan Griesinger",
    description: "How Intervals ICU Companion handles your Intervals.icu connection, training data, local storage, widget data and privacy choices.",
    image: "intervalsicu",
  },
  "/tempostudio": {
    title: "Tempo Studio — Jonathan Griesinger",
    description: "Turn training clips into vertical Reels with your route, activity stats, animated titles and matching covers. A native video editor connected to Intervals.icu.",
    image: "tempostudio",
  },
  "/tempostudio/privacy": {
    title: "Privacy policy · Tempo Studio — Jonathan Griesinger",
    description: "How Tempo Studio handles your selected videos, Intervals.icu connection, routes, fitness data, exports and privacy choices.",
    image: "tempostudio",
  },
  "/projects/rag-doc-chat": {
    title: "RAG Doc Chat case study — Jonathan Griesinger",
    description: "A document question-answering project using Python, FastAPI, Qdrant and React, with source citations that open the original PDF page.",
    image: "portfolio",
  },
  "/projects/invoice-extractor": {
    title: "Invoice Extractor case study — Jonathan Griesinger",
    description: "An invoice processing project using Claude vision, Python, FastAPI and React to extract structured fields, validate results and flag duplicates.",
    image: "portfolio",
  },
} as const;

export type PagePath = keyof typeof pageMetadata;
export const publicPaths = Object.keys(pageMetadata) as PagePath[];

export function getMetadata(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = pageMetadata[path as PagePath];
  if (!page) return {
    title: "Page not found — Jonathan Griesinger",
    description: "This address does not lead to a page on Jonathan Griesinger’s website.",
    robots: "noindex, nofollow",
    image: `${siteOrigin}/images/social/portfolio.jpg`,
  };
  return {
    ...page,
    canonical: siteOrigin + path,
    robots: "index, follow",
    image: `${siteOrigin}/images/social/${page.image}.jpg`,
  };
}

export function getStructuredData(pathname: string) {
  const metadata = getMetadata(pathname);
  if (!("canonical" in metadata)) return undefined;
  const author = { "@type": "Person", "@id": `${siteOrigin}/#person`, name: "Jonathan Griesinger", url: siteOrigin + "/" };
  const page = { "@type": "WebPage", "@id": metadata.canonical, url: metadata.canonical, name: metadata.title, description: metadata.description };
  if (pathname === "/") return {
    "@context": "https://schema.org",
    "@graph": [
      { ...author, jobTitle: "Fullstack Developer", sameAs: [social.github, social.linkedin] },
      { "@type": "WebSite", "@id": `${siteOrigin}/#website`, url: siteOrigin + "/", name: "Jonathan Griesinger", author: { "@id": author["@id"] } },
      page,
    ],
  };
  if (pathname === "/intervalsicu" || pathname === "/tempostudio") return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: pathname === "/tempostudio" ? "Tempo Studio" : "Intervals ICU Companion",
    url: metadata.canonical,
    description: metadata.description,
    operatingSystem: "iOS",
    applicationCategory: pathname === "/tempostudio" ? "MultimediaApplication" : "HealthApplication",
    author,
  };
  return { "@context": "https://schema.org", ...page, author };
}

export function getHeadTags(pathname: string) {
  const metadata = getMetadata(pathname);
  const tags: { tag: "meta" | "link" | "script"; attributes: Record<string, string>; text?: string }[] = [
    { tag: "meta", attributes: { name: "description", content: metadata.description } },
    { tag: "meta", attributes: { name: "robots", content: metadata.robots } },
    ...Object.entries({
      "og:type": pathname === "/" ? "profile" : "website",
      "og:site_name": "Jonathan Griesinger",
      "og:title": metadata.title,
      "og:description": metadata.description,
      "og:image": metadata.image,
      "og:image:alt": "Jonathan Griesinger — " + (metadata.image.includes("tempostudio") ? "Tempo Studio, a native training video editor" : metadata.image.includes("intervalsicu") ? "Intervals ICU Companion, a native training companion" : "Fullstack Developer"),
      "og:image:width": "1200",
      "og:image:height": "630",
      ...("canonical" in metadata ? { "og:url": metadata.canonical } : {}),
    }).map(([property, content]) => ({ tag: "meta" as const, attributes: { property, content } })),
    ...Object.entries({ "twitter:card": "summary_large_image", "twitter:title": metadata.title, "twitter:description": metadata.description, "twitter:image": metadata.image }).map(([name, content]) => ({ tag: "meta" as const, attributes: { name, content } })),
  ];
  if ("canonical" in metadata) tags.push({ tag: "link", attributes: { rel: "canonical", href: metadata.canonical } });
  const schema = getStructuredData(pathname);
  if (schema) tags.push({ tag: "script", attributes: { type: "application/ld+json" }, text: JSON.stringify(schema).replace(/</g, "\\u003c") });
  return { title: metadata.title, tags };
}
