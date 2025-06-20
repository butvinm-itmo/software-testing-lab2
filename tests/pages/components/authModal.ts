import { Locator } from "@playwright/test";

export class AuthModal {
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
    this.emailInput = root.getByLabel("Электронная почта");
    this.emailError = root.locator("#authFormLoginByEmailEmail ~ .auth-form-input-label-error");
    this.passwordInput = root.getByLabel("Пароль");
    this.passwordError = root.locator("#authFormLoginByEmailPassword ~ .auth-form-input-label-error");
    this.loginButton = root.getByRole("button", { name: "Войти" });
  }
}
