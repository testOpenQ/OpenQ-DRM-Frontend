import { JSDOM } from "jsdom";

export default class HTMLPage {
  private dom: Document;

  constructor(html: string) {
    const { window } = new JSDOM(html);
    this.dom = window.document;
  }

  getTitle(): string {
    return this.dom.title;
  }

  getDescription(): string {
    const metaTags = this.dom.getElementsByTagName("meta");
    for (const element of metaTags) {
      if (element.getAttribute("name") === "description") {
        return element.getAttribute("content") || "";
      }
    }
    return "";
  }

  getBody(): string {
    return this.dom.body.textContent || "";
  }
}
