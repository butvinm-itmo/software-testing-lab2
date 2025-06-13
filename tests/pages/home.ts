import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly url = "https://mt.ru/";
  readonly page: Page;
  readonly loginButton: Locator;
  readonly profileButton: Locator;
  readonly onboardingPopup: Locator;
  readonly authForm: AuthForm;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole("button", { name: "Вход" });
    this.profileButton = page.locator("#sidebar-profile");
    this.onboardingPopup = page.locator(".onboarding-intro-popup");
    this.authForm = new AuthForm(page.locator(".auth-form"));
  }

  async goto() {
    await this.page.goto(this.url);
    await this.closeOnboardingPopup();
  }

  async closeOnboardingPopup() {
    await this.onboardingPopup.locator(".popup-close").click();
  }

  async openAuthForm() {
    await this.loginButton.click();
  }
}

class AuthForm {
  readonly root: Locator;
  readonly authByMailButton: Locator;
  readonly emailInput: Locator;
  readonly emailError: Locator;
  readonly passwordInput: Locator;
  readonly passwordError: Locator;
  readonly loginButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.authByMailButton = root.getByRole("button", { name: "Вход по почте" });
    this.emailInput = root.locator("#authFormLoginByEmailEmail");
    this.emailError = root.locator("css=#authFormLoginByEmailEmail ~ .auth-form-input-label-error");
    this.passwordInput = root.locator("#authFormLoginByEmailPassword");
    this.passwordError = root.locator("css=#authFormLoginByEmailPassword ~ .auth-form-input-label-error");
    this.loginButton = root.getByRole("button", { name: "Войти" });
  }
}
