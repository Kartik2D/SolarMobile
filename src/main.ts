import "./index";
import "./index.css";

import type { AppChart } from "./components/chart";
import type { AppChartStack } from "./components/chart-stack";

const app = document.getElementById("app");
if (!app) {
  throw new Error("Missing #app container");
}

app.innerHTML = `
  <div class="page">
    <header class="hero">
      <h1>SolarMobile UI</h1>
      <p class="lede">
        EG4 Component library
      </p>
    </header>

    <section class="section" id="buttons">
      <div class="section__head">
        <div>
          <h2>Buttons</h2>
          <p class="section__desc">
            Shoelace sl-button with built-in variants and sizes.
          </p>
        </div>
      </div>
      <div class="example-row">
        <sl-button variant="primary">Primary</sl-button>
        <sl-button variant="default">Default</sl-button>
        <sl-button variant="success">Success</sl-button>
        <sl-button variant="neutral">Neutral</sl-button>
        <sl-button variant="warning">Warning</sl-button>
        <sl-button variant="danger">Danger</sl-button>
      </div>
      <div class="example-row">
        <sl-button variant="text">Text</sl-button>
        <sl-button variant="primary" outline>Outline</sl-button>
        <sl-button variant="primary" pill>Pill</sl-button>
        <sl-button variant="primary" disabled>Disabled</sl-button>
      </div>
      <div class="example-row">
        <sl-button size="small">Small</sl-button>
        <sl-button size="medium">Medium</sl-button>
        <sl-button size="large">Large</sl-button>
      </div>
    </section>

    <section class="section" id="cards">
      <div class="section__head">
        <div>
          <h2>Cards</h2>
          <p class="section__desc">
            Shoelace sl-card with header, body, and footer slots.
          </p>
        </div>
      </div>
      <div class="stack">
        <sl-card class="card-demo">
          <div slot="header">Analytics Snapshot</div>
          <p>
            Use header and footer slots for structured content. The card glows on hover.
          </p>
          <div slot="footer" class="card-actions">
            <sl-button size="small" variant="default">Export</sl-button>
            <sl-button size="small" variant="primary">View details</sl-button>
          </div>
        </sl-card>

        <sl-card class="card-demo">
          <div slot="header">Compact Footer</div>
          <p>Footers keep actions grouped at the bottom.</p>
          <div slot="footer" class="card-actions">
            <sl-button variant="success" size="small">Accept</sl-button>
            <sl-button variant="neutral" size="small">Hold</sl-button>
            <sl-button variant="danger" size="small">Reject</sl-button>
          </div>
        </sl-card>
      </div>
    </section>

    <section class="section" id="charts">
      <div class="section__head">
        <div>
          <h2>Charts</h2>
          <p class="section__desc">Chart.js powered line and multi-series stacks.</p>
        </div>
      </div>
      <div class="grid grid--2">
        <sl-card class="card-demo">
          <div slot="header">Multi-series stack</div>
          <app-chart-stack id="chart-stack-demo"></app-chart-stack>
        </sl-card>
        <sl-card class="card-demo">
          <div slot="header">Single series</div>
          <app-chart id="chart-demo"></app-chart>
        </sl-card>
      </div>
    </section>

    <section class="section" id="model">
      <div class="section__head">
        <div>
          <h2>3D House Card</h2>
          <p class="section__desc">
            GLTF loader with theme-aware shader and lazy render.
          </p>
        </div>
      </div>
      <app-house-card title="Solar-ready home" height="420"></app-house-card>
    </section>
  </div>
`;

const stackChart = document.querySelector("#chart-stack-demo") as
  | AppChartStack
  | null;
const singleChart = document.querySelector("#chart-demo") as AppChart | null;

if (stackChart) {
  stackChart.title = "Energy vs Weather";
  stackChart.labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  stackChart.datasets = [
    {
      label: "Solar (kWh)",
      data: [45, 52, 68, 84, 95, 112, 118, 108, 89, 67, 48, 41],
      borderColor: "#ff6b35",
    },
    {
      label: "Temperature (°C)",
      data: [2, 5, 12, 18, 24, 28, 32, 31, 26, 19, 10, 4],
      borderColor: "#4ecdc4",
    },
    {
      label: "Wind (m/s)",
      data: [8, 12, 15, 18, 22, 25, 28, 26, 20, 16, 10, 6],
      borderColor: "#45b7d1",
    },
  ];
}

if (singleChart) {
  singleChart.title = "Monthly Solar Production";
  singleChart.label = "Energy (kWh)";
  singleChart.labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  singleChart.data = [45, 52, 68, 84, 95, 112, 118, 108, 89, 67, 48, 41];
  singleChart.borderColor = "#ffa726";
}

// Briefly show the loading screen component so it appears in the showcase.
const loadingShowcase = document.createElement("app-loading-screen");
loadingShowcase.message = "Demonstrating loading state...";
document.body.appendChild(loadingShowcase);
setTimeout(() => loadingShowcase.hide(), 900);
