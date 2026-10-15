import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage } from "./helpers/renderPage";
import { cv } from "../src/data/cv";
import { projects } from "../src/data/projects";
import { social } from "../src/data/site";

describe("personal site", () => {
  it("renders the CV, experience, portrait and contact routes", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1, name: cv.name })).toBeVisible();
    expect(screen.getByRole("img", { name: /Jonathan Griesinger, smiling/ })).toHaveAttribute("width", "1600");
    for (const role of cv.roles) expect(screen.getByRole("heading", { name: role.company })).toBeVisible();
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", `mailto:${social.email}`);
    expect(screen.getByRole("link", { name: /See selected projects/ })).toHaveAttribute("href", "/projects");
  });

  it("navigates by keyboard, marks the active page and focuses main content", async () => {
    const user = userEvent.setup();
    renderPage();
    const nav = screen.getByRole("navigation", { name: "Primary" });
    const projectsLink = within(nav).getByRole("link", { name: "Projects" });
    projectsLink.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
    expect(projectsLink).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("main")).toHaveFocus();
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
  });

  it("renders every project and provides secure, keyboard-reachable repository links", async () => {
    const user = userEvent.setup();
    renderPage("/projects");
    const list = screen.getByRole("region", { name: "Personal projects" });
    expect(within(list).getAllByRole("article")).toHaveLength(projects.length);
    for (const project of projects) {
      expect(within(list).getByRole("heading", { name: project.name, level: 2 })).toBeVisible();
      if (project.githubUrl) {
        const link = within(list).getByRole("link", { name: `View on GitHub → (${project.name})` });
        expect(link).toHaveAttribute("href", project.githubUrl);
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(link).toHaveAttribute("target", "_blank");
      } else {
        expect(within(list).getByRole("link", { name: `Explore the app → (${project.name})` })).toHaveAttribute("href", project.pagePath);
      }
    }
    await user.click(within(list).getByRole("heading", { name: projects[0].name, level: 2 }));
    expect(within(list).getByRole("link", { name: `View on GitHub → (${projects[0].name})` })).toBeInTheDocument();
  });

  it("shows a useful recovery page for unknown URLs", () => {
    renderPage("/this-page-does-not-exist");
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Back to CV" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeVisible();
  });
});
