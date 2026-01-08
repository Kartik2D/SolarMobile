// Public entrypoint for the SolarMobile component library.
// Imports Shoelace bootstrap (base styles, theme, icon resolver) and
// registers custom elements for charts, 3D house card, and loading screen.

// ─── Shoelace setup (base dark theme + orange/glow overrides) ───────────────
export * from "./shoelace";

// ─── Custom components (charts, 3D house, loading screen) ────────────────────
export * from "./components/chart";
export * from "./components/chart-stack";
export * from "./components/house-card";
export * from "./components/loading-screen";

// ─── Design tokens (optional, for advanced theming) ──────────────────────────
export { default as tokens } from "./styles/variables.css?inline";
