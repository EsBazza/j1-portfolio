import { expect, test, type Page } from "@playwright/test";
import { projects } from "../content/projects";

const routes = [
  "/",
  "/projects",
  "/projects?tag=winner",
  ...projects.map((p) => `/projects/${p.slug}`),
  "/resume",
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

for (const route of routes) {
  test(`${route} renders without errors or horizontal scroll`, async ({
    page,
  }) => {
    const errors = collectErrors(page);
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1:visible").first()).toBeVisible();
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("unknown routes get the custom 404", async ({ page }) => {
  const response = await page.goto("/not-a-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Lost node." })).toBeVisible();
});

test("every page has a skip link and one main landmark", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await expect(page.locator("main:visible")).toHaveCount(1);
});

test("the project filter narrows the grid", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("link", { name: "Hackathon winners" }).click();
  await expect(page).toHaveURL(/tag=winner/);
  await expect(page.getByRole("status")).toHaveText(/Showing 3 of/);
});

test("the theme toggle switches and remembers the theme", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
});

test("the contact form validates on the server", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("skips 3D, pinning and smooth scroll; content stays visible", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await expect(page.locator("[data-hero-backdrop] canvas")).toHaveCount(0);
    await expect(page.locator("[data-pinned]")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    await expect(page.getByText("Hackathon winner").first()).toBeVisible();
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the home page is fully readable", async ({ page }) => {
    await page.goto("/");
    for (const p of projects.filter((p) => p.featured)) {
      // Some headings also carry an "aka" name, so match by text, not name.
      await expect(
        page.locator("h3", { hasText: p.title }).first(),
      ).toBeVisible();
    }
    await expect(page.locator("[data-countup]").first()).toHaveText("1");
    await expect(
      page.getByRole("heading", { name: "Hackathon log." }),
    ).toBeVisible();
  });

  test("project filters work through the URL", async ({ page }) => {
    await page.goto("/projects?tag=winner");
    await expect(page.getByRole("status")).toHaveText(/Showing 3 of/);
  });
});
