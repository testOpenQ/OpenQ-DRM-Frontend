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

  getTextFromElement(selector: string): string {
    const element = this.dom.querySelector(selector);
    if (element) {
      return element.textContent || "";
    }
    return "";
  }

  getElementBySelector(selector: string): Element | null {
    return this.dom.querySelector(selector);
  }

  getFooter(): Element | null {
    return this.dom.querySelector("footer");
  }

  getAllEmailAddresses(): string[] {
    const emailAddresses: string[] = [];
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const elements = this.dom.getElementsByTagName("*");

    for (const element of elements) {
      if (element.textContent) {
        const matches = element.textContent.match(emailRegex);
        if (matches) {
          emailAddresses.push(...matches);
        }
      }
    }

    return emailAddresses;
  }
}
