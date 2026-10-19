import { describe, expect, it } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderPage } from "./helpers/renderPage";

describe("route metadata", () => {
  it("updates and cleans up metadata across app, project, unknown and home routes", async () => {
    const { router } = renderPage("/tempostudio");
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute("content", "Tempo Studio — Jonathan Griesinger");
    await router.navigate("/projects");
    await waitFor(() => expect(document.title).toBe("Projects — Jonathan Griesinger"));
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://jonathangriesinger.de/projects");
    await router.navigate("/missing");
    await waitFor(() => expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow"));
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    await router.navigate("/");
    await waitFor(() => expect(document.title).toBe("Jonathan Griesinger — Fullstack Developer"));
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toContain('"Person"');
  });
});
