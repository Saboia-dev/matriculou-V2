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

test("institution search matches courses, full state names and words in any order", async ({ page }) => {
  await page.goto("/instituicoes");
  await expect(page.locator(".cards3 > .instCard").first()).toBeVisible();
  const search = page.locator(".filterSearch input");
  const titles = () => page.locator(".cards3 > .instCard h3").allInnerTexts();

  await search.fill("rio ufrj");
  expect(await titles()).toContain("Universidade Federal do Rio de Janeiro (UFRJ)");

  await search.fill("minas gerais");
  expect((await titles()).length).toBeGreaterThan(0);
  await expect(page.locator(".cards3 > .instCard .place").first()).toContainText("MG");

  await search.fill("medicina veterinaria");
  expect((await titles()).length).toBeGreaterThan(0);

  await search.fill("sp");
  for (const place of await page.locator(".cards3 > .instCard .place").allTextContents()) expect(place).toContain("SP");
});

test("schools never show a MEC concept", async ({ page }) => {
  await page.goto("/instituicoes");
  await expect(page.locator(".cards3 > .instCard").first()).toBeVisible();
  await page.getByLabel("Tipo de instituição").selectOption("escola");
  for (const rating of await page.locator(".cards3 > .instCard .rating").allTextContents()) expect(rating).toContain("Não se aplica");
});

test("course search finds courses by area", async ({ page }) => {
  await page.goto("/cursos");
  await page.getByLabel("Pesquisar curso").fill("saude");
  await expect(page.locator(".courseLarge h2", { hasText: "Enfermagem" })).toBeVisible();
  await page.getByLabel("Pesquisar curso").fill("xyzabc");
  await expect(page.getByText("Nenhum curso encontrado")).toBeVisible();
});

test("every institution card shows a different picture", async ({ page }) => {
  await page.goto("/instituicoes");
  await expect(page.locator(".cards3 > .instCard").first()).toBeVisible();
  // Cards render progressively; wait until the whole catalog is on the page.
  const total = Number((await page.locator(".resultBar b").innerText()).match(/\d+/)![0]);
  await expect(page.locator(".cards3 > .instCard")).toHaveCount(total, { timeout: 20000 });
  const sources = await page.locator(".cards3 > .instCard .instImage img").evaluateAll((imgs) =>
    imgs.map((img) => decodeURIComponent((img as HTMLImageElement).currentSrc || (img as HTMLImageElement).src).replace(/.*url=([^&]+).*/, "$1")),
  );
  expect(sources.length).toBe(total);
  expect(sources.filter((src, index) => sources.indexOf(src) !== index)).toEqual([]);
});
