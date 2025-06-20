import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home";
import { VALID_EMAIL, VALID_PASSWORD, WRONG_EMAIL, WRONG_PASSWORD } from "./const";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Авторизация", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("[ST-1] Успешная авторизация по электронной почте", async ({ page }) => {
    await homePage.loginButton.click();
    await expect(homePage.authForm.root).toBeVisible();

    await homePage.authForm.authByMailButton.click();

    await homePage.authForm.emailInput.fill(VALID_EMAIL);
    await homePage.authForm.passwordInput.fill(VALID_PASSWORD);
    await homePage.authForm.loginButton.click();

    await homePage.profileButton.waitFor();
    await expect(homePage.profileButton).toBeVisible();
  });

  test("[ST-1] Авторизация по электронной почте с неправильным паролем", async ({ page }) => {
    await homePage.loginButton.click();
    await expect(homePage.authForm.root).toBeVisible();

    await homePage.authForm.authByMailButton.click();

    await homePage.authForm.emailInput.fill(VALID_EMAIL);
    await homePage.authForm.passwordInput.fill(WRONG_PASSWORD);
    await homePage.authForm.loginButton.click();

    await homePage.authForm.passwordError.waitFor();
    await expect(homePage.authForm.passwordError).toHaveText("Неправильный пароль");
  });

  test("[ST-1] Авторизация по электронной почте с незарегистрированной почтой", async ({ page }) => {
    await homePage.loginButton.click();
    await expect(homePage.authForm.root).toBeVisible();

    await homePage.authForm.authByMailButton.click();

    await homePage.authForm.emailInput.fill(WRONG_EMAIL);
    await homePage.authForm.passwordInput.fill(WRONG_PASSWORD);
    await homePage.authForm.loginButton.click();

    await homePage.authForm.emailError.waitFor();
    await expect(homePage.authForm.emailError).toHaveText("E-mail не зарегистрирован");
  });
});
