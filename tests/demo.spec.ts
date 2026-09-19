import { test, expect } from "@playwright/test";
test("ciclo completo, mapa, filtros, relatórios e reinício", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Explorar demonstração" }).click();
  await expect(
    page.getByRole("heading", { name: "Pulso operacional" }),
  ).toBeVisible();
  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(24);
  await expect(page.locator(".leaflet-tile-loaded").first()).toBeVisible({
    timeout: 20000,
  });
  await page.screenshot({
    path: "test-results/gestao-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Comparar dois territórios" }).click();
  await expect(page.getByRole("dialog")).toContainText("P2");
  await expect(page.getByRole("dialog")).toContainText("P1");
  await page.getByRole("button", { name: "Fechar", exact: true }).click();
  await page
    .getByRole("button", { name: "Conhecer territórios com baixa cobertura" })
    .click();
  await expect(page.locator(".space-drawer")).toContainText(
    "Dados insuficientes para uma classificação segura",
  );
  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(2);
  await page.getByRole("link", { name: "Cidadão", exact: true }).click();
  await page
    .getByRole("button", { name: "Exemplo Central", exact: false })
    .click();
  await expect(page.locator(".confirmation-count")).toContainText(
    "3 confirmações",
  );
  await page.getByRole("button", { name: "Ainda está assim?" }).click();
  await expect(page.locator(".confirmation-count")).toContainText(
    "4 confirmações",
  );
  await page.getByRole("link", { name: "Gestão", exact: true }).click();
  await expect(page.locator(".signals")).toContainText("4 confirmações");
  await expect(page.locator(".signals")).toContainText("9h");
  await page.getByRole("button", { name: "Planejar intervenção" }).click();
  await page
    .getByRole("link", { name: "Acompanhar na fila de operações" })
    .click();
  await page.getByRole("button", { name: "Emlurb", exact: true }).click();
  const row = page.locator(".queue-card").filter({
    has: page.getByRole("heading", {
      name: "Praça Exemplo Central",
      exact: true,
    }),
  });
  await row.getByRole("button", { name: "Assumir ação" }).click();
  await expect(row).toContainText("Em atendimento");
  await page.getByRole("link", { name: "Cidadão", exact: true }).click();
  await expect(page.locator(".public-progress")).toContainText(
    "Equipe acionada",
  );
  await page.getByRole("link", { name: "Operações", exact: true }).click();
  await row.getByRole("button", { name: "Marcar como concluído" }).click();
  await page
    .getByLabel("Ação executada")
    .fill("Iluminação restaurada e limpeza concluída");
  await page
    .getByLabel("Observação curta")
    .fill("Equipe concluiu a vistoria simulada.");
  await page.getByLabel("Incluir foto simulada").check();
  await page
    .getByRole("button", { name: "Concluir intervenção", exact: true })
    .click();
  await page.getByRole("link", { name: "Cidadão", exact: true }).click();
  await expect(page.locator(".space-drawer .badge")).toContainText("Resolvido");
  await page.getByRole("link", { name: "Transparência", exact: true }).click();
  const result = page
    .locator(".transparency-card")
    .filter({ hasText: "Praça Exemplo Central" });
  await expect(result).toContainText(
    "Iluminação restaurada e limpeza concluída",
  );
  await expect(result.locator(".timeline .reached")).toHaveCount(5);
  await page.reload();
  await expect(result).toBeVisible();
  await page
    .getByRole("button", { name: "Como o Mapa Vivo funciona?" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("ESIG");
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Cidadão", exact: true }).click();
  await page.getByRole("button", { name: "Informar outro problema" }).click();
  await page.getByRole("button", { name: "Iluminação", exact: true }).click();
  await page.getByRole("button", { name: "Confirmar e enviar" }).click();
  await expect(page.getByRole("dialog")).toContainText("Recebemos.");
  await page.getByRole("button", { name: "Voltar ao mapa" }).click();
  await expect(page.locator(".space-drawer .badge")).toContainText(
    "Em atenção",
  );
  await page.getByRole("link", { name: "Transparência", exact: true }).click();
  await expect(result).toContainText(
    "Iluminação restaurada e limpeza concluída",
  );
  await page.getByRole("link", { name: "Cidadão", exact: true }).click();
  await page.getByRole("button", { name: "Reiniciar demo" }).click();
  await expect(page.locator(".confirmation-count")).toContainText(
    "3 confirmações",
  );
  await expect(page.locator(".space-drawer .badge")).toContainText(
    "Em atenção",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Fechar aviso" }).click();
  await page.screenshot({
    path: "test-results/cidadao-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
});
