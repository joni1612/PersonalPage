import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { projects } from "../src/data/projects";
import { renderPage } from "./helpers/renderPage";

describe("companion project card", () => {
  it("includes the app in the portfolio and gives it an internal destination", () => {
    renderPage("/projects");
    const card = screen.getAllByRole("article").find(item => within(item).queryByRole("heading", { name: "Intervals ICU Companion App", level: 2 }));
    expect(card).toBeDefined();
    const link = within(card!).getByRole("link", { name: "Explore the app → (Intervals ICU Companion App)" });
    expect(link).toHaveAttribute("href", "/intervalsicu");
    expect(link).not.toHaveAttribute("target");
    expect(within(card!).queryByRole("link", { name: /GitHub/ })).not.toBeInTheDocument();
    expect(card).toHaveTextContent("SwiftUI");
    expect(card).toHaveTextContent("WidgetKit");
  });

  it("opens the overview through keyboard activation and can return to Projects", async () => {
    const user = userEvent.setup();
    renderPage("/projects");
    const link = screen.getByRole("link", { name: "Explore the app → (Intervals ICU Companion App)" });
    link.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("heading", { name: "Intervals ICU Companion", level: 1 })).toBeVisible();
    expect(screen.getByRole("main")).toHaveFocus();
    await user.click(screen.getByRole("link", { name: /All projects/ }));
    expect(await screen.findByRole("heading", { name: "Projects", level: 1 })).toBeVisible();
  });

  it("keeps all existing repository destinations and unique project names", () => {
    renderPage("/projects");
    expect(screen.getAllByRole("article")).toHaveLength(7);
    expect(new Set(projects.map(p => p.name)).size).toBe(projects.length);
    expect(screen.getAllByRole("link", { name: /View on GitHub/ })).toHaveLength(5);
  });
});
