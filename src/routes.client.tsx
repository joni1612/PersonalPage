import type { RouteObject } from "react-router-dom";
import App from "./App";

export const routes: RouteObject[] = [{
  path: "/",
  Component: App,
  children: [
    { index: true, lazy: async () => ({ Component: (await import("./routes/Home")).default }) },
    { path: "projects", lazy: async () => ({ Component: (await import("./routes/Projects")).default }) },
    { path: "intervalsicu", lazy: async () => ({ Component: (await import("./routes/IntervalsICU")).default }) },
    { path: "intervalsicu/privacy", lazy: async () => ({ Component: (await import("./routes/IntervalsPrivacy")).default }) },
    { path: "tempostudio", lazy: async () => ({ Component: (await import("./routes/TempoStudio")).default }) },
    { path: "tempostudio/privacy", lazy: async () => ({ Component: (await import("./routes/TempoPrivacy")).default }) },
    { path: "projects/rag-doc-chat", lazy: async () => ({ Component: (await import("./routes/CaseStudy")).default }) },
    { path: "projects/invoice-extractor", lazy: async () => ({ Component: (await import("./routes/CaseStudy")).default }) },
    { path: "*", lazy: async () => ({ Component: (await import("./routes/NotFound")).default }) },
  ],
}];
