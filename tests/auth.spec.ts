import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home";
import { VALID_EMAIL, VALID_PASSWORD, WRONG_EMAIL, WRONG_PASSWORD } from "./const";

test.describe("Авторизация", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("[ST-1] Успешная авторизация по электронной почте", async ({ page }) => {
    const email = VALID_EMAIL;
    const password = VALID_PASSWORD;

    await homePage.goto();
    await expect(page).toHaveURL(homePage.url);

    await homePage.loginButton.click();
    await expect(homePage.authForm.root).toBeVisible();

    await homePage.authForm.authByMailButton.click();

    await homePage.authForm.emailInput.fill(email);
    await homePage.authForm.passwordInput.fill(password);
    await homePage.authForm.loginButton.click();

    await homePage.profileButton.waitFor();
    await expect(homePage.profileButton).toBeVisible();
  });

  test("[ST-1] Авторизация по электронной почте с неправильным паролем", async ({ page }) => {
    const email = VALID_EMAIL;
    const password = WRONG_PASSWORD;

    await homePage.goto();
    await expect(page).toHaveURL(homePage.url);

    await homePage.loginButton.click();
    await expect(homePage.authForm.root).toBeVisible();

    await homePage.authForm.authByMailButton.click();

    await homePage.authForm.emailInput.fill(email);
    await homePage.authForm.passwordInput.fill(password);
    await homePage.authForm.loginButton.click();

    await homePage.authForm.passwordError.waitFor();
    await expect(homePage.authForm.passwordError).toHaveText("Неправильный пароль");
  });

  test("[ST-1] Авторизация по электронной почте с незарегистрированной почтой", async ({ page }) => {
    const email = WRONG_EMAIL;
    const password = WRONG_PASSWORD;

    await homePage.goto();
    await expect(page).toHaveURL(homePage.url);

    await homePage.loginButton.click();
    await expect(homePage.authForm.root).toBeVisible();

    await homePage.authForm.authByMailButton.click();

    await homePage.authForm.emailInput.fill(email);
    await homePage.authForm.passwordInput.fill(password);
    await homePage.authForm.loginButton.click();

    await homePage.authForm.emailError.waitFor();
    await expect(homePage.authForm.emailError).toHaveText("E-mail не зарегистрирован");
  });
});
