import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home";
import { VALID_EMAIL, VALID_PASSWORD, WRONG_EMAIL, WRONG_PASSWORD } from "./const";

test.describe("Публикации", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("[ST-7] Лайки под публикациями", async ({ page }) => {
    if (await homePage.blogPost.like.isVisible()) {
      await homePage.blogPost.likeButton.click();
    }
    await expect(homePage.blogPost.like).not.toBeVisible();

    let likesCount = await homePage.blogPost.getLikesCount();
    expect(likesCount).toBeGreaterThanOrEqual(0);

    await homePage.blogPost.likeButton.click();
    await expect(homePage.blogPost.like).toBeVisible();

    let newLikesCount = await homePage.blogPost.getLikesCount();
    expect(newLikesCount).toBeGreaterThan(likesCount);

    await homePage.blogPost.likeButton.click();
    await expect(homePage.blogPost.like).not.toBeVisible();
    let newNewLikesCount = await homePage.blogPost.getLikesCount();
    expect(newNewLikesCount).toBeLessThan(newLikesCount);
  });
});

test.describe("Публикации - Неавторизованный пользователь", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("[ST-7] Предложение аутентификации при нажатии лайка неавторизованным пользователем", async ({ page }) => {
    // disable authorization cookies
    await expect(homePage.blogPost.like).not.toBeVisible();

    await homePage.blogPost.likeButton.click();
    await expect(homePage.blogPost.like).not.toBeVisible();
    await expect(homePage.authForm.root).toBeVisible();
  });
});
