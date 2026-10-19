import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, matchRoutes, RouterProvider } from "react-router-dom";

import "./styles/global.css";
import { routes } from "./routes.client";

async function start() {
  const matches = matchRoutes(routes, window.location.pathname) ?? [];
  await Promise.all(matches.map(async ({ route }) => {
    if (route.lazy && typeof route.lazy === "function") {
      const loaded = await route.lazy();
      Object.assign(route, loaded, { lazy: undefined });
    }
  }));
  const router = createBrowserRouter(routes);
  const root = document.getElementById("root")!;
  const application = <StrictMode><RouterProvider router={router} /></StrictMode>;
  if (root.hasChildNodes()) hydrateRoot(root, application);
  else createRoot(root).render(application);
}

void start();
