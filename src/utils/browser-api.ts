declare const chrome: typeof globalThis.chrome | undefined;
declare const browser: typeof globalThis.browser | undefined;

export const browserAPI = (() => {
  if (typeof chrome !== "undefined" && chrome.runtime) {
    return chrome;
  } else if (typeof browser !== "undefined" && browser.runtime) {
    return browser;
  } else {
    throw new Error("Browser API not supported");
  }
})();
