import fs from "node:fs";
import { expect, test, type Page } from "@playwright/test";

// The account area needs a signed-in user: auth and profile endpoints are mocked in the
// test browser only, while the public catalog is still read with the publishable key.
const env = fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "";
const anon = env.match(/PUBLISHABLE_KEY=(.*)/)?.[1]?.trim();
test.skip(!anon, "Supabase is not configured in .env.local");

const id = "00000000-0000-4000-8000-000000000001";
const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
const token = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: id, role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })}.sig`;
const user = { id, aud: "authenticated", role: "authenticated", email: "pessoa@example.com", user_metadata: {}, app_metadata: {}, created_at: "2026-10-01T00:00:00Z" };

async function signIn(page: Page) {
  for (const table of ["instituicoes", "ofertas"]) await page.route(`**/rest/v1/${table}**`, (r) => r.continue({ headers: { ...r.request().headers(), authorization: `Bearer ${anon}` } }));
  await page.route("**/auth/v1/token**", (r) => r.fulfill({ json: { access_token: token, token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: "r", user } }));
  await page.route("**/rest/v1/usuarios**", (r) => r.fulfill({ json: [{ id, email: user.email, nome_completo: "Pessoa Teste", avatar_url: null }] }));
  await page.route("**/rest/v1/favoritos**", (r) => r.fulfill({ json: [] }));
  await page.route("**/rest/v1/documentos_usuario**", (r) => r.fulfill({ json: [{ id: "d1", nome: "Documento de identidade", path: `${id}/documentos/rg.jpg`, created_at: "2026-10-20T12:00:00Z" }] }));
  await page.route("**/storage/v1/object/sign/**", (r) => r.fulfill({ json: [{ path: `${id}/documentos/rg.jpg`, signedURL: "/object/sign/x?token=y", error: null }] }));
  await page.addInitScript(() => localStorage.setItem("matriculou-consent", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), analytics: false, marketing: false })));
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(user.email);
  await page.getByLabel("Senha").fill("senha-qualquer");
  await page.getByRole("button", { name: /Entrar na minha conta/ }).click();
  // Signing in lands on the institutions catalog; the profile is one click away in the header.
  await page.waitForURL("**/instituicoes");
  await page.locator("a.userMini").click();
  await page.waitForURL("**/perfil");
}

test("profile uses the site palette, svg icons and working tabs", async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole("heading", { name: "Pessoa Teste", level: 1 })).toBeVisible();
  const background = await page.locator(".accountPage").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(background).toBe("rgb(246, 245, 239)");
  await expect(page.locator(".accountPage")).not.toContainText(/[□◉↪▦☰⌕]/);

  await page.locator(".accountTabs").getByRole("button", { name: /Documentos/ }).click();
  await expect(page.getByRole("link", { name: "Documento de identidade" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Apagar Documento de identidade" })).toBeVisible();

  await page.locator(".accountTabs").getByRole("button", { name: /Favoritos/ }).click();
  await expect(page.getByText("Nenhuma favorita ainda")).toBeVisible();

  await page.locator(".accountTabs").getByRole("button", { name: /Privacidade/ }).click();
  await expect(page.getByRole("button", { name: /Baixar meus dados/ }).locator("svg")).toHaveCount(1);
  await expect(page.getByRole("button", { name: /Excluir conta/ })).toBeVisible();
});

test("profile fits a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page);
  await expect(page.locator(".accountHeader")).toBeVisible();
  const [scroll, width] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(scroll).toBeLessThanOrEqual(width);
});
