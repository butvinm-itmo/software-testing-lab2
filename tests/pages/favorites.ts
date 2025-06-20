import { Locator, Page } from "@playwright/test";
import { BlogPost } from "./components/blogPost";

export class FavoritesPage {
  readonly url = "https://mt.ru/favorites";
  readonly page: Page;
  readonly posts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.posts = page.getByRole("article");
  }

  async goto() {
    await this.page.goto(this.url);
  }

  findPostByTitle(title: string): BlogPost {
    return new BlogPost(this.page.getByRole("article").filter({ hasText: title }).first());
  }
}
