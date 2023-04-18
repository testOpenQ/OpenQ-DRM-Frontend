import { JSDOM } from "jsdom";

export default class HTMLPage {
  private dom: Document;

  constructor(html: string, url: string) {
    const { window } = new JSDOM(html, {
      url: "https://" + url.replace(/^https?:\/\//g, ""),
    });
    this.dom = window.document;

    this.removeScripts();
    this.removeStyle();
    this.removeSvg();
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

  removeScripts(): void {
    const scripts = this.dom.getElementsByTagName("script");

    // Convert the live HTMLCollection to an array
    const scriptsArray = Array.from(scripts);

    for (const element of scriptsArray) {
      element.remove();
    }
  }

  removeStyle(): void {
    const styles = this.dom.getElementsByTagName("style");

    // Convert the live HTMLCollection to an array
    const stylesArray = Array.from(styles);

    for (const element of stylesArray) {
      element.remove();
    }
  }

  removeSvg(): void {
    const svgs = this.dom.getElementsByTagName("svg");

    // Convert the live HTMLCollection to an array
    const svgsArray = Array.from(svgs);

    for (const element of svgsArray) {
      element.remove();
    }
  }
}
