import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderPage } from "./helpers/renderPage";

describe("Intervals ICU Companion app page", () => {
  it("explains the daily check, workout analysis, calendar and widget without claiming availability", () => {
    renderPage("/intervalsicu");
    expect(screen.getByRole("heading", { level: 1, name: "Intervals ICU Companion" })).toBeVisible();
    for (const name of ["Your training, at a glance", "A closer look at your workout", "Your week in view", "A glance from your Home Screen"]) {
      expect(screen.getByRole("heading", { name })).toBeVisible();
    }
    expect(screen.getByText(/Fitness, Fatigue and Form/)).toBeVisible();
    expect(screen.getByText(/An Intervals.icu account is required/)).toBeVisible();
    expect(screen.getByText(/independent companion/i)).toBeVisible();
    expect(screen.queryByRole("link", { name: /download|app store/i })).not.toBeInTheDocument();
    expect(document.title).toBe("Intervals ICU Companion — Jonathan Griesinger");
  });

  it("shows real local simulator screenshots with captions, dimensions and meaningful alternatives", () => {
    renderPage("/intervalsicu");
    const gallery = screen.getByRole("region", { name: "Inside the app" });
    const images = within(gallery).getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(3);
    for (const img of images) {
      expect(img.getAttribute("src")).toMatch(/^\/images\/intervalsicu\/.+\.png$/);
      expect(img.getAttribute("alt")?.length).toBeGreaterThan(20);
      expect(Number(img.getAttribute("width"))).toBeGreaterThan(0);
      expect(Number(img.getAttribute("height"))).toBeGreaterThan(0);
    }
    expect(within(gallery).getByText(/simulator.*demo data/i)).toBeVisible();
  });

  it("offers privacy, support and a route back to the portfolio", () => {
    renderPage("/intervalsicu");
    expect(screen.getByRole("link", { name: "Privacy policy" })).toHaveAttribute("href", "/intervalsicu/privacy");
    expect(screen.getByRole("link", { name: "Contact support" })).toHaveAttribute("href", "mailto:griesinger.jonathan16@gmail.com?subject=Intervals%20ICU%20Companion%20support");
    expect(screen.getByRole("link", { name: /All projects/ })).toHaveAttribute("href", "/projects");
  });
});
