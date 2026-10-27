import { expect, test, type Page } from "@playwright/test";

// Search results must never stay faded by scroll animations, whatever the filter or scroll.
async function fadedCards(page: Page) {
  await page.waitForTimeout(1200);
  return page.$$eval(".cards3 > .instCard", (cards) => cards.filter((card) => {
    const r = card.getBoundingClientRect();
    const visible = (Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / r.height;
    return visible > 0.3 && (Number(getComputedStyle(card).opacity) < 0.95 || card.hasAttribute("data-reveal"));
  }).length);
}

test("institution cards stay fully visible through filters and scrolling", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("matriculou-consent", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), analytics: false, marketing: false })));
  await page.goto("/instituicoes");
  await expect(page.locator(".cards3 > .instCard").first()).toBeVisible();
  const toList = () => page.evaluate(() => scrollTo(0, document.querySelector(".cards3")!.getBoundingClientRect().top + scrollY - 150));

  for (const uf of ["RS", "SP", "todos"]) {
    await page.getByLabel("Estado", { exact: true }).selectOption(uf);
    await toList();
    expect(await fadedCards(page)).toBe(0);
  }
  await page.getByLabel("Rede", { exact: true }).selectOption("privada");
  await toList();
  expect(await fadedCards(page)).toBe(0);
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 1100);
    expect(await fadedCards(page)).toBe(0);
  }
  await page.locator(".filterSearch input").fill("sorocaba");
  await toList();
  expect(await fadedCards(page)).toBe(0);
});
