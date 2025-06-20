import { Page, Locator } from "@playwright/test";

import { BlogPost } from "./components/blogPost";
import { AuthModal } from "./components/authModal";

export class HomePage {
  readonly url = "https://mt.ru/";
  readonly page: Page;
  readonly loginButton: Locator;
  readonly profileButton: Locator;
  readonly onboardingPopup: Locator;
  readonly locationButton: Locator;
  readonly authForm: AuthModal;
  readonly locationModal: LocationModal;
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly searchResultsChannels: Locator;
  readonly searchResultsPosts: Locator;
  readonly searchResultsGeo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole("button", { name: "Вход" });
    this.profileButton = page.locator("#sidebar-profile");
    this.onboardingPopup = page.locator(".onboarding-intro-popup");
    this.locationButton = page.locator(".geo-position");
    this.authForm = new AuthModal(page.locator(".auth-form"));
    this.locationModal = new LocationModal(page, page.locator(".geo-popup"));
    this.searchButton = page.locator('button:has(svg use[href$="#search-2"])');
    this.searchInput = page.getByPlaceholder("Поиск в МТ");
    this.searchResultsChannels = page.locator("#search-popup-channels").locator("a.item");
    this.searchResultsGeo = page.locator("#search-popup-geo").locator("a.item");
    this.searchResultsPosts = page.locator("#search-popup-posts").locator("a.item");
  }

  async goto() {
    await this.page.goto(this.url);
    await this.closeOnboardingPopup();
  }

  async closeOnboardingPopup() {
    if (await this.onboardingPopup.isVisible()) {
      await this.onboardingPopup.locator(".popup-close").click();
    }
  }

  firstBlogPost(): BlogPost {
    return new BlogPost(this.page.getByRole("article").first());
  }
}

export class LocationModal {
  readonly root: Locator;
  readonly searchInput: Locator;
  readonly searchResults: Locator;
  readonly imaHereButton: Locator;
  readonly autodetectLocationSwitch: Locator;
  readonly closeButton: Locator;
  readonly currentLocationCard: CurrentLocationCard;
  readonly createTagTab: CreateTagTab;
  readonly tagsTab: TagsTab;
  readonly myTabsButton: Locator;

  constructor(page: Page, root: Locator) {
    this.root = root;
    this.searchInput = root.getByPlaceholder("Поиск мест");
    this.searchResults = root.locator(".geo-search-results").getByRole("listitem");
    this.closeButton = root.locator(".close-button");
    this.imaHereButton = root.getByRole("button", { name: "Я здесь" });
    this.autodetectLocationSwitch = root.locator(".autodetect-position").locator(".switch");
    this.currentLocationCard = new CurrentLocationCard(root.locator(".geo-current-position"));
    this.createTagTab = new CreateTagTab(root.locator(".geo-add-custom-tag-tab"));
    this.tagsTab = new TagsTab(page, root.locator(".geo-custom-tags-tab"));
    this.myTabsButton = root.getByRole("button", { name: "Мои ярлыки" });
  }
}

export class CurrentLocationCard {
  readonly root: Locator;
  readonly subscribeButton: Locator;
  readonly unsubscribeButton: Locator;
  readonly createTagButton: Locator;

  constructor(root: Locator) {
    this.subscribeButton = root.getByRole("button", { name: "Подписаться" });
    this.unsubscribeButton = root.getByRole("button", { name: "Вы подписаны" });
    this.createTagButton = root.getByRole("button", { name: "Создать ярлык" });
    this.root = root;
  }
}

export class TagsTab {
  root: Locator;
  tags: Locator;
  removeTagButton: Locator;

  constructor(page: Page, root: Locator) {
    this.root = root;
    this.tags = root.locator(".geo-search-results").getByRole("listitem");
    this.removeTagButton = page.locator(".tooltip-popup").getByRole("button", { name: "Удалить" });
  }
}

export class CreateTagTab {
  root: Locator;
  nameInput: Locator;
  descriptionInput: Locator;
  saveButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.nameInput = root.getByPlaceholder("Введите название ярлыка");
    this.descriptionInput = root.getByPlaceholder("Введите описание ярлыка");
    this.saveButton = root.getByRole("button", { name: "Сохранить" });
  }
}
