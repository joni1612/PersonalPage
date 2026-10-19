import type { RouteObject } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import Projects from "./routes/Projects";
import NotFound from "./routes/NotFound";
import IntervalsICU from "./routes/IntervalsICU";
import IntervalsPrivacy from "./routes/IntervalsPrivacy";
import TempoStudio from "./routes/TempoStudio";
import TempoPrivacy from "./routes/TempoPrivacy";
import CaseStudy from "./routes/CaseStudy";

export const routes: RouteObject[] = [{
  path: "/",
  element: <App />,
  children: [
    { index: true, element: <Home /> },
    { path: "projects", element: <Projects /> },
    { path: "intervalsicu", element: <IntervalsICU /> },
    { path: "intervalsicu/privacy", element: <IntervalsPrivacy /> },
    { path: "tempostudio", element: <TempoStudio /> },
    { path: "tempostudio/privacy", element: <TempoPrivacy /> },
    { path: "projects/rag-doc-chat", element: <CaseStudy /> },
    { path: "projects/invoice-extractor", element: <CaseStudy /> },
    { path: "*", element: <NotFound /> },
  ],
}];
