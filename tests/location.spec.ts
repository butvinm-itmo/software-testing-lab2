import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home";
import { randomUUID } from "crypto";

test.describe("Настройки местоположения", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  // TODO: need to figure out how to make the test robust
  // test("[ST-4] Выбор местоположения на карте", async ({ page }) => {
  //   await homePage.goto();
  //   await expect(page).toHaveURL(homePage.url);

  //   await homePage.locationButton.click();
  //   await expect(homePage.locationModal.root).toBeVisible();

  //   await homePage.locationModal.mapMarker.click();
  //   await page.waitForTimeout(500);
  //   await homePage.locationModal.mapMarker.click();

  //   await expect(homePage.locationModal.searchResults).toContainText("Метрополь");
  // });

  test("[ST-4] Поиск местоположения по названию", async ({ page }) => {
    await homePage.goto();
    await expect(page).toHaveURL(homePage.url);

    await homePage.locationButton.click();
    await expect(homePage.locationModal.root).toBeVisible();

    await homePage.locationModal.searchInput.fill("Метрополь");

    const result = homePage.locationModal.searchResults
      .filter({ hasText: "2, Театральный проезд, 2, 62, Тверской район, Москва, Центральный федеральный округ" })
      .first();
    await expect(result).toBeVisible();

    await result.click();
    await homePage.locationModal.imaHereButton.click();
    await expect(homePage.locationModal.currentLocationCard.root).toContainText("Метрополь");

    await homePage.locationModal.closeButton.click();
    await expect(homePage.locationButton).toHaveText("Метрополь");
  });

  test("[ST-4] Автоматическое определение местоположения", async ({ page }) => {
    await homePage.goto();
    await expect(page).toHaveURL(homePage.url);

    await homePage.locationButton.click();
    await expect(homePage.locationModal.root).toBeVisible();

    await homePage.locationModal.autodetectLocationSwitch.click();
    // TODO: actual location is ITMO, see ST-6
    await expect(homePage.locationModal.currentLocationCard.root).toContainText("Кронверкский проспект");

    await homePage.locationModal.closeButton.click();
    await expect(homePage.locationButton).toHaveText("Кронверкский проспект");
  });

  test("[ST-4] Подписка на местоположение", async ({ page }) => {
    await homePage.goto();
    await expect(page).toHaveURL(homePage.url);

    await homePage.locationButton.click();
    await expect(homePage.locationModal.root).toBeVisible();

    await homePage.locationModal.searchInput.fill("Метрополь");
    await homePage.locationModal.searchResults
      .filter({ hasText: "2, Театральный проезд, 2, 62, Тверской район, Москва, Центральный федеральный округ" })
      .first()
      .click();
    await homePage.locationModal.imaHereButton.click();
    await expect(homePage.locationModal.currentLocationCard.root).toContainText("Метрополь");
    await expect(homePage.locationModal.currentLocationCard.subscribeButton).toBeVisible();

    await homePage.locationModal.currentLocationCard.subscribeButton.click();
    await homePage.locationModal.currentLocationCard.unsubscribeButton.waitFor();
    await expect(homePage.locationModal.currentLocationCard.unsubscribeButton).toBeVisible();

    await homePage.locationModal.currentLocationCard.unsubscribeButton.click();
    await homePage.locationModal.currentLocationCard.subscribeButton.waitFor();
    await expect(homePage.locationModal.currentLocationCard.subscribeButton).toBeVisible();
  });

  test("[ST-4] Создание ярлыка из текущего местоположения", async ({ page }) => {
    await homePage.goto();
    await expect(page).toHaveURL(homePage.url);

    await homePage.locationButton.click();
    await expect(homePage.locationModal.root).toBeVisible();

    await homePage.locationModal.searchInput.fill("Метрополь");
    await homePage.locationModal.searchResults
      .filter({ hasText: "2, Театральный проезд, 2, 62, Тверской район, Москва, Центральный федеральный округ" })
      .first()
      .click();
    await homePage.locationModal.imaHereButton.click();
    await expect(homePage.locationModal.currentLocationCard.root).toContainText("Метрополь");

    await homePage.locationModal.currentLocationCard.createTagButton.click();
    await expect(homePage.locationModal.createTagTab.root).toBeVisible();
    await expect(homePage.locationModal.createTagTab.saveButton).toBeDisabled();

    // random suffix to not overlap with previous test runs if they failed and tags was not cleaned up
    const tagName = `Тестовый ярлык ${randomUUID()}`;
    const tagNameTrimmed = tagName.slice(0, 32);
    const tagDescription = `Описание тестового ярлыка ${randomUUID()}`;

    await homePage.locationModal.createTagTab.nameInput.fill(tagName);
    await homePage.locationModal.createTagTab.descriptionInput.fill(tagDescription);
    await expect(homePage.locationModal.createTagTab.saveButton).toBeEnabled();

    await homePage.locationModal.createTagTab.saveButton.click();
    await homePage.locationModal.currentLocationCard.root.waitFor();
    await expect(homePage.locationModal.currentLocationCard.root).toContainText(tagNameTrimmed);
    await expect(homePage.locationModal.currentLocationCard.root).toContainText(tagDescription);

    await homePage.locationModal.myTabsButton.click();
    const tag = homePage.locationModal.tagsTab.tags.filter({ hasText: tagNameTrimmed });
    await expect(tag).toBeVisible();

    await tag.locator("button").click();
    await homePage.locationModal.tagsTab.removeTagButton.click();
    await expect(tag).toHaveCount(0);
  });
});
