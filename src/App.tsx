import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PageMeta from "./components/PageMeta";

export default function App() {
  const { pathname } = useLocation();

  // Move keyboard focus to the top of the page on route change.
  useEffect(() => {
    const main = document.getElementById("main");
    main?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <PageMeta />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
