import type { RouteObject } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import Projects from "./routes/Projects";
import NotFound from "./routes/NotFound";
import IntervalsICU from "./routes/IntervalsICU";

export const routes: RouteObject[] = [{
  path: "/",
  element: <App />,
  children: [
    { index: true, element: <Home /> },
    { path: "projects", element: <Projects /> },
    { path: "intervalsicu", element: <IntervalsICU /> },
    { path: "*", element: <NotFound /> },
  ],
}];
