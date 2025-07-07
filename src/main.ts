import "./components/button";
import "./components/card";
import "./components/chart";
import "./components/chart-stack";
import "./components/house-card";

// Basic mobile app setup
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app")!;

  app.innerHTML = `
    <div class="container">
      
      <div class="stack">
        <!-- 3D House Model Card -->
        <app-house-card title="3D House Model" height="400"></app-house-card>
        
        <!-- 3D Chart Stack -->
        <app-card title="Chart Stack">
          <app-chart-stack></app-chart-stack>
          <div slot="footer" class="card-actions card-actions--flush">
            <app-button variant="flush">Amazing</app-button>
            <app-button variant="flush">Incredible</app-button>
          </div>
        </app-card>
        
        <!-- Solar Energy Chart -->
        <app-card title="Solar Energy Production">
          <app-chart 
            title="Monthly Solar Energy Output" 
            label="Energy (kWh)"
            border-color="#ff6b35"
            background-color="rgba(255, 107, 53, 0.2)">
          </app-chart>
          <div slot="footer" class="card-actions card-actions--flush">
            <app-button variant="flush">View Details</app-button>
            <app-button variant="flush">Export Data</app-button>
          </div>
        </app-card>
        
        <!-- Temperature Chart -->
        <app-card title="Temperature Monitoring">
          <app-chart 
            title="Monthly Temperature Trends" 
            label="Temperature (°C)"
            border-color="#ffa726"
            background-color="rgba(255, 167, 38, 0.2)">
          </app-chart>
          <div slot="footer" class="card-actions card-actions--flush">
            <app-button variant="flush">View Report</app-button>
            <app-button variant="flush">Download PDF</app-button>
          </div>
        </app-card>
        
        <!-- Feature Info Card -->
        <app-card title="Mobile Features">
          <p>This dashboard is designed mobile-first with scroll-based hover effects. As you scroll, cards automatically highlight when they come into view, creating a smooth and intuitive user experience.</p>
          <div slot="footer" class="card-actions card-actions--flush">
            <app-button variant="flush">Smooth!</app-button>
            <app-button variant="flush">Clean!</app-button>
            <app-button variant="flush">Modern!</app-button>
          </div>
        </app-card>
      </div>
    </div>
  `;

  // Handle button clicks
  app.addEventListener("app-click", (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "APP-BUTTON") {
      console.log("Button clicked:", target.textContent);
    }
  });

  // Set custom data for charts after they're rendered
  setTimeout(() => {
    const charts = app.querySelectorAll("app-chart");
    const chartStacks = app.querySelectorAll("app-chart-stack");

    // Chart Stack with multiple datasets
    if (chartStacks[0]) {
      const chartStack = chartStacks[0] as any;
      chartStack.title = "Solar Energy vs Temperature vs Wind Speed";
      chartStack.labels = [
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
      chartStack.datasets = [
        {
          label: "Solar Energy (kWh)",
          data: [45, 52, 68, 84, 95, 112, 118, 108, 89, 67, 48, 41],
          borderColor: "#ff6b35",
          fill: true,
        },
        {
          label: "Temperature (°C)",
          data: [2, 5, 12, 18, 24, 28, 32, 31, 26, 19, 10, 4],
          borderColor: "#4ecdc4",
          fill: true,
        },
        {
          label: "Wind Speed (m/s)",
          data: [8, 12, 15, 18, 22, 25, 28, 26, 20, 16, 10, 6],
          borderColor: "#45b7d1",
          fill: true,
        },
        {
          label: "Battery Level (%)",
          data: [75, 68, 82, 90, 95, 88, 92, 85, 78, 72, 70, 74],
          borderColor: "#f9ca24",
          fill: true,
        },
      ];
    }

    // Solar Energy Production Chart
    if (charts[0]) {
      const solarChart = charts[0] as any;
      solarChart.labels = [
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
      solarChart.data = [45, 52, 68, 84, 95, 112, 118, 108, 89, 67, 48, 41];
    }

    // Temperature Chart
    if (charts[1]) {
      const tempChart = charts[1] as any;
      tempChart.labels = [
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
      tempChart.data = [2, 5, 12, 18, 24, 28, 32, 31, 26, 19, 10, 4];
    }
  }, 100);
});

// Prevent zoom on double-tap (iOS)
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);
