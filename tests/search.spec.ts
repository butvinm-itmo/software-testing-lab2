import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home";
import { FavoritesPage } from "./pages/favorites";
import { VALID_EMAIL, VALID_PASSWORD, WRONG_EMAIL, WRONG_PASSWORD } from "./const";

test.describe("Публикации", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("[ST-2] Поиск публикаций", async ({ page }) => {
    await homePage.searchButton.click();
    await homePage.searchInput.waitFor();
    await homePage.searchInput.fill("Девять лет назад произошло маленькое чудо");
    await homePage.searchResultsPosts.first().waitFor();

    const result = homePage.searchResultsPosts.filter({ hasText: "Девять лет назад произошло маленькое чудо" });
    await expect(result).toHaveCount(1);

    await result.click();
    expect(page.url()).toEqual(encodeURI("https://mt.ru/spbdnevnik/46000183504"));
  });

  test("[ST-2] Поиск каналов", async ({ page }) => {
    await homePage.searchButton.click();
    await homePage.searchInput.waitFor();
    await homePage.searchInput.fill("info-tses");
    await homePage.searchResultsChannels.first().waitFor();

    const result = homePage.searchResultsChannels.filter({ hasText: "info-tses" });
    await expect(result).toHaveCount(1);

    await result.click();
    expect(page.url()).toEqual(encodeURI("https://mt.ru/info-tses"));
  });
  
  test("[ST-2] Поиск местоположений", async ({ page }) => {
    await homePage.searchButton.click();
    await homePage.searchInput.waitFor();
    await homePage.searchInput.fill("ИТМО");
    await homePage.searchResultsGeo.first().waitFor();

    const result = homePage.searchResultsGeo.filter({ hasText: "ИТМО" });
    await expect(result).toHaveCount(1);

    await result.click();
    expect(page.url()).toEqual(encodeURI("https://mt.ru/hashtags/тер. Университет ИТМО [794846]"));
  });
});
