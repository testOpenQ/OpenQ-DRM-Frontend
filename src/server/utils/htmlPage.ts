import { JSDOM } from "jsdom";

export default class HTMLPage {
  private dom: Document;

  constructor(html: string, url: string) {
    const { window } = new JSDOM(html, {
      url: "https://" + url.replace(/^https?:\/\//g, ""),
    });
    this.dom = window.document;

    const irrelevantTagNames = [
      "script",
      "style",
      "svg",
      "img",
      "link",
      "iframe",
      "frame",
      "frameset",
      "object",
      "embed",
      "applet",
      "video",
      "audio",
      "canvas",
      "map",
      "input",
      "textarea",
      "select",
      "button",
    ];

    irrelevantTagNames.forEach((tagName) => this.removeElements(tagName));
  }

  getUrl(): string {
    return this.dom.URL;
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
    return this.dom.body.innerHTML || "";
  }

  removeElements(tagName: string) {
    const elements = this.dom.getElementsByTagName(tagName);
    const elementsArray = Array.from(elements);

    for (const element of elementsArray) {
      element.remove();
    }
  }
}
