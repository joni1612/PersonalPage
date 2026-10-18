import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage } from "./helpers/renderPage";

describe("Tempo Studio publication pages", () => {
  it("describes the shipped workflow without advertising unavailable integrations or downloads", () => {
    renderPage("/tempostudio");
    expect(screen.getByRole("heading", { level: 1, name: "Tempo Studio" })).toBeVisible();
    for (const name of ["Make the cut", "Bring in your effort", "Make it yours", "Ready for your next Reel"]) {
      expect(screen.getByRole("heading", { name, level: 2 })).toBeVisible();
    }
    const main=screen.getByRole("main");
    expect(main).toHaveTextContent(/Intervals.icu account/);
    expect(main).toHaveTextContent(/heart rate.*power/i);
    expect(main).toHaveTextContent(/only available activity integration/i);
    expect(screen.queryByRole("link", { name: /download|app store/i })).not.toBeInTheDocument();
    expect(document.title).toBe("Tempo Studio — Jonathan Griesinger");
  });

  it("shows real screenshot assets and support/privacy links", () => {
    renderPage("/tempostudio");
    const images=within(screen.getByRole("region", { name: "Inside Tempo Studio" })).getAllByRole("img");
    expect(images).toHaveLength(5);
    for(const image of images) {
      expect(image.getAttribute("src")).toMatch(/^\/images\/tempostudio\/.+\.png$/);
      expect(image.getAttribute("alt")!.length).toBeGreaterThan(20);
      expect(image).toHaveAttribute("width","1206");
      expect(image).toHaveAttribute("height","2622");
    }
    expect(screen.getByRole("link",{name:"Privacy policy"})).toHaveAttribute("href","/tempostudio/privacy");
    expect(screen.getByRole("link",{name:"Contact support"})).toHaveAttribute("href","mailto:griesinger.jonathan16@gmail.com?subject=Tempo%20Studio%20support");
  });

  it("explains native OAuth, sensitive routes, media, export and deletion honestly", () => {
    renderPage("/tempostudio/privacy");
    expect(screen.getByRole("heading",{level:1,name:"Privacy policy"})).toBeVisible();
    const main=screen.getByRole("main");
    for(const term of [/Jonathan Griesinger/,/PKCE/,/no login backend/i,/Keychain/,/heart.rate/i,/GPS/,/Photos/,/Files/,/temporary/i,/survive uninstall/i,/revocation fails/i,/support.*email/i,/supervisory authority/,/international/]) expect(main).toHaveTextContent(term);
    expect(main).not.toHaveTextContent(/Cloudflare Workers|HealthKit data|never leaves your device/i);
    expect(screen.getByRole("link",{name:"griesinger.jonathan16@gmail.com"})).toHaveAttribute("href","mailto:griesinger.jonathan16@gmail.com?subject=Tempo%20Studio%20privacy");
    expect(screen.getByText("18 October 2026",{selector:"time"})).toHaveAttribute("datetime","2026-10-18");
  });

  it("connects portfolio, app page and public policy through keyboard-accessible routes", async () => {
    const user=userEvent.setup();renderPage("/projects");
    const link=screen.getByRole("link",{name:"Explore the app → (Tempo Studio)"});
    expect(link).toHaveAttribute("href","/tempostudio");
    link.focus();await user.keyboard("{Enter}");
    expect(await screen.findByRole("heading",{level:1,name:"Tempo Studio"})).toBeVisible();
    await user.click(screen.getByRole("link",{name:"Privacy policy"}));
    expect(await screen.findByRole("heading",{level:1,name:"Privacy policy"})).toBeVisible();
    await user.click(screen.getByRole("link",{name:"Back to the app"}));
    expect(await screen.findByRole("heading",{level:1,name:"Tempo Studio"})).toBeVisible();
  });
});
