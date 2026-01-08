// Shoelace bootstrap – imports base styles and registers icon resolver.
// Import this file once per application to set up Shoelace globally.

import "@shoelace-style/shoelace/dist/themes/dark.css";
import "./styles/shoelace-theme.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

// Configure CDN path for Shoelace assets (icons, etc).
// Consumers can call setBasePath() again to override if self-hosting assets.
setBasePath("https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/");

// Re-export commonly used Shoelace components for convenience.
// Tree-shaking keeps bundle lean when not all are used.
export { default as SlButton } from "@shoelace-style/shoelace/dist/components/button/button.component.js";
export { default as SlCard } from "@shoelace-style/shoelace/dist/components/card/card.component.js";
export { default as SlIcon } from "@shoelace-style/shoelace/dist/components/icon/icon.component.js";
export { default as SlSpinner } from "@shoelace-style/shoelace/dist/components/spinner/spinner.component.js";

// Also register the elements so they can be used declaratively.
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/card/card.js";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "@shoelace-style/shoelace/dist/components/spinner/spinner.js";
