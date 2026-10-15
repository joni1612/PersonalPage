import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage } from "./helpers/renderPage";

describe("companion privacy policy", () => {
  it("is a public page with an effective date, accountable developer and contact", () => {
    renderPage("/intervalsicu/privacy");
    expect(screen.getByRole("heading", { name: "Privacy policy", level: 1 })).toBeVisible();
    expect(screen.getByText("15 October 2026", { selector: "time" })).toHaveAttribute("datetime", "2026-10-15");
    expect(screen.getByRole("main")).toHaveTextContent("Jonathan Griesinger");
    expect(within(screen.getByRole("main")).getByRole("link", { name: "griesinger.jonathan16@gmail.com" })).toHaveAttribute("href", "mailto:griesinger.jonathan16@gmail.com?subject=Intervals%20ICU%20Companion%20privacy");
    expect(screen.queryByRole("button", { name: /sign in|log in|accept/i })).not.toBeInTheDocument();
    expect(document.title).toBe("Privacy policy · Intervals ICU Companion — Jonathan Griesinger");
  });

  it("covers data categories, purposes, recipients, retention, consent and user rights", () => {
    renderPage("/intervalsicu/privacy");
    for (const name of ["Who is responsible", "Data the app uses", "How your data is used", "Storage and retention", "Services involved", "Disconnecting and deleting data", "Your choices and rights", "Children", "Changes to this policy"]) {
      expect(screen.getByRole("heading", { name, level: 2 })).toBeVisible();
    }
    const main = screen.getByRole("main");
    for (const topic of [/heart.rate/i, /Keychain/, /Cloudflare/, /Apple Health/, /advertising/, /offline/, /support.*email/i, /supervisory authority/, /international/i]) expect(main).toHaveTextContent(topic);
  });

  it("accurately distinguishes local storage from the transient token exchange and failed revocation", () => {
    renderPage("/intervalsicu/privacy");
    const main = screen.getByRole("main");
    expect(main).toHaveTextContent(/server receives the authorization code.*access token/i);
    expect(main).toHaveTextContent(/does not use a database to retain/i);
    expect(main).toHaveTextContent(/If revocation fails.*connection.*remain/i);
    expect(main).toHaveTextContent(/Keychain items can survive uninstall/i);
    expect(main).toHaveTextContent(/does not delete your Intervals.icu account/i);
    expect(main).toHaveTextContent(/widget.*never.*token/i);
    expect(main).not.toHaveTextContent(/never leaves your (phone|device)|no data ever leaves|guaranteed|GDPR.compliant/i);
  });

  it("is linked from the app page and offers a clear return route", async () => {
    const user = userEvent.setup();
    renderPage("/intervalsicu");
    await user.click(screen.getByRole("link", { name: "Privacy policy" }));
    expect(await screen.findByRole("heading", { name: "Privacy policy", level: 1 })).toBeVisible();
    await user.click(screen.getByRole("link", { name: "Back to the app" }));
    expect(await screen.findByRole("heading", { name: "Intervals ICU Companion", level: 1 })).toBeVisible();
    expect(document.title).toBe("Intervals ICU Companion — Jonathan Griesinger");
  });
});
