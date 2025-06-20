import { test as setup, expect } from "@playwright/test";
import { HomePage } from "./pages/home";
import { VALID_EMAIL, VALID_PASSWORD } from "./const";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();
  await expect(page).toHaveURL(homePage.url);

  await homePage.loginButton.click();
  await expect(homePage.authForm.root).toBeVisible();

  await homePage.authForm.authByMailButton.click();

  await homePage.authForm.emailInput.fill(VALID_EMAIL);
  await homePage.authForm.passwordInput.fill(VALID_PASSWORD);
  await homePage.authForm.loginButton.click();

  await homePage.profileButton.waitFor();

  await page.context().storageState({ path: authFile });
});
