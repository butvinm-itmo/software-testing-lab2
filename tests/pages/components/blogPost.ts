import { Locator } from "@playwright/test";

export class BlogPost {
  readonly root: Locator;
  readonly title: Locator;
  readonly likeButton: Locator;
  readonly likesCount: Locator;
  readonly like: Locator;
  readonly favoriteButton: Locator;
  readonly favorite: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.title = root.locator("h3");
    this.likeButton = root.locator('[data-test^="control-reaction-"]');
    this.likesCount = this.likeButton.locator("span:not([class])");
    this.like = root.locator(".post-actions__btn_love");
    this.favoriteButton = root.locator('[id^="control-bookmark-"]');
    this.favorite = root.locator(`[id^="control-bookmark-"]:has(svg use[href$="#bookmark"])`);
  }

  async isFavorite(): Promise<boolean> {
    const icon = this.favoriteButton.locator("svg use");
    const iconHref = await icon.getAttribute("href");
    return iconHref != null && iconHref.includes("#bookmark") && !iconHref.includes("#bookmark-stroke");
  }

  async getLikesCount(): Promise<number> {
    if (await this.likesCount.isVisible()) {
      return parseInt((await this.likesCount.innerText())!);
    }
    return 0;
  }

  async getTitle(): Promise<string> {
    return (await this.title.textContent())!;
  }
}
