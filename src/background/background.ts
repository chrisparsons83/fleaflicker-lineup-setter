import { browserAPI } from "../utils/browser-api";

browserAPI.runtime.onInstalled.addListener(() => {
  console.log("Fleaflicker Helper extension installed.");
});