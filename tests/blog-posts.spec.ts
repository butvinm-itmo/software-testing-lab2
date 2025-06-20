import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home";
import { FavoritesPage } from "./pages/favorites";
import { VALID_EMAIL, VALID_PASSWORD, WRONG_EMAIL, WRONG_PASSWORD } from "./const";

test.describe("Публикации", () => {
  let homePage: HomePage;
  let favoritesPage: FavoritesPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    favoritesPage = new FavoritesPage(page);

    await homePage.goto();
  });

  test("[ST-7] Лайки под публикациями", async ({ page }) => {
    const blogPost = homePage.firstBlogPost();

    if (await blogPost.like.isVisible()) {
      await blogPost.likeButton.click();
    }
    await expect(blogPost.like).not.toBeVisible();

    let likesCount = await blogPost.getLikesCount();
    expect(likesCount).toBeGreaterThanOrEqual(0);

    await blogPost.likeButton.click();
    await expect(blogPost.like).toBeVisible();

    let newLikesCount = await blogPost.getLikesCount();
    expect(newLikesCount).toBeGreaterThan(likesCount);

    await blogPost.likeButton.click();
    await expect(blogPost.like).not.toBeVisible();
    let newNewLikesCount = await blogPost.getLikesCount();
    expect(newNewLikesCount).toBeLessThan(newLikesCount);
  });

  test("[ST-8] Добавление публикации в избранные", async ({ page }) => {
    const blogPost = homePage.firstBlogPost();
    const postTitle = await blogPost.getTitle();

    if (await blogPost.favorite.isVisible()) {
      await blogPost.favoriteButton.click();
    }

    await expect(blogPost.favorite).not.toBeVisible();

    await blogPost.favoriteButton.click();
    await expect(blogPost.favorite).toBeVisible();

    await favoritesPage.goto();
    const favoritePost = favoritesPage.findPostByTitle(postTitle);
    await favoritePost.root.waitFor();
    await expect(favoritePost.root).toBeVisible();

    await favoritePost.favoriteButton.click();
    await expect(blogPost.favorite).not.toBeVisible();

    await page.reload();
    await expect(favoritePost.root).not.toBeVisible();
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
    const blogPost = homePage.firstBlogPost();

    await expect(blogPost.like).not.toBeVisible();

    await blogPost.likeButton.click();
    await expect(blogPost.like).not.toBeVisible();
    await expect(homePage.authForm.root).toBeVisible();
  });

  test("[ST-8] Предложение аутентификации при добавлении публикации в избранное неавторизованным пользователем", async ({ page }) => {
    const blogPost = homePage.firstBlogPost();
    await expect(blogPost.favoriteButton).not.toBeVisible();
  });
});
