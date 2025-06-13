import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home";

test.describe("Авторизация", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("[ST-1] Успешная авторизация по электронной почте", async ({ page }) => {
    const email = "367945@edu.itmo.ru";
    const password = "1403f3iT1e";

    await homePage.goto();
    expect(page).toHaveURL(homePage.url);

    await homePage.loginButton.click();
    expect(homePage.authForm.root).toBeVisible();

    await homePage.authForm.authByMailButton.click();

    await homePage.authForm.emailInput.fill(email);
    await homePage.authForm.passwordInput.fill(password);
    await homePage.authForm.loginButton.click();

    await homePage.profileButton.waitFor();
    expect(homePage.profileButton).toBeVisible();
  });

  test("[ST-1-] Авторизация по электронной почте с неправильным паролем", async ({ page }) => {
    const email = "367945@edu.itmo.ru";
    const password = "not-a-password";

    await homePage.goto();
    expect(page).toHaveURL(homePage.url);

    await homePage.loginButton.click();
    expect(homePage.authForm.root).toBeVisible();

    await homePage.authForm.authByMailButton.click();

    await homePage.authForm.emailInput.fill(email);
    await homePage.authForm.passwordInput.fill(password);
    await homePage.authForm.loginButton.click();

    await homePage.authForm.passwordError.waitFor();
    expect(homePage.authForm.passwordError).toHaveText("Неправильный пароль");
  });
  
  test("[ST-1-] Авторизация по электронной почте с не зарегистрированной почтой", async ({ page }) => {
    const email = "666@ya.ru";
    const password = "not-a-password";

    await homePage.goto();
    expect(page).toHaveURL(homePage.url);

    await homePage.loginButton.click();
    expect(homePage.authForm.root).toBeVisible();

    await homePage.authForm.authByMailButton.click();

    await homePage.authForm.emailInput.fill(email);
    await homePage.authForm.passwordInput.fill(password);
    await homePage.authForm.loginButton.click();

    await homePage.authForm.emailError.waitFor();
    expect(homePage.authForm.emailError).toHaveText("E-mail не зарегистрирован");
  });
});
