import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  Filler,
} from "chart.js";

// Register Chart.js components for tree-shaking
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  Filler
);

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

@customElement("app-chart-stack")
export class AppChartStack extends LitElement {
  @property({ type: String }) title = "Multi-Line Chart";
  @property({ type: Array }) labels: string[] = [];
  @property({ type: Array }) datasets: ChartDataset[] = [];

  @query("canvas") canvas!: HTMLCanvasElement;

  private chart: Chart | null = null;

  // Default color palette for multiple lines
  private defaultColors = [
    "#ff6b35", // Orange
    "#4ecdc4", // Teal
    "#45b7d1", // Blue
    "#f9ca24", // Yellow
    "#f0932b", // Dark Orange
    "#eb4d4b", // Red
    "#6c5ce7", // Purple
    "#a29bfe", // Light Purple
    "#fd79a8", // Pink
    "#00b894", // Green
  ];

  // Helper method to convert hex color to rgba
  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 450px;
      background-color: var(--surface);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      box-sizing: border-box;
    }

    .chart-container {
      width: 100%;
      height: calc(100% - 50px);
      position: relative;
      margin-top: var(--space-2);
    }

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .chart-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--space-2);
      color: var(--text);
      text-align: center;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  firstUpdated() {
    this.createChart();
  }

  updated(changedProperties: Map<string, any>) {
    if (
      this.chart &&
      (changedProperties.has("labels") ||
        changedProperties.has("datasets") ||
        changedProperties.has("title"))
    ) {
      this.updateChart();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart() {
    if (!this.canvas) return;

    // Default data if none provided
    const defaultLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const defaultDatasets: ChartDataset[] = [
      {
        label: "Series 1",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: this.defaultColors[0],
      },
      {
        label: "Series 2",
        data: [28, 48, 40, 19, 86, 27],
        borderColor: this.defaultColors[1],
      },
      {
        label: "Series 3",
        data: [45, 25, 16, 36, 67, 18],
        borderColor: this.defaultColors[2],
      },
    ];

    const chartLabels = this.labels.length > 0 ? this.labels : defaultLabels;
    const chartDatasets =
      this.datasets.length > 0 ? this.datasets : defaultDatasets;

    // Process datasets to add default colors and styling
    const processedDatasets = chartDatasets.map((dataset, index) => {
      const borderColor =
        dataset.borderColor ||
        this.defaultColors[index % this.defaultColors.length];
      const backgroundColor =
        dataset.backgroundColor || this.hexToRgba(borderColor, 0.1);

      return {
        label: dataset.label,
        data: dataset.data,
        borderColor: borderColor,
        backgroundColor:
          dataset.fill !== false
            ? (context: any) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                  return this.hexToRgba(borderColor, 0.2);
                }
                const gradient = ctx.createLinearGradient(
                  0,
                  chartArea.top,
                  0,
                  chartArea.bottom
                );
                gradient.addColorStop(0, this.hexToRgba(borderColor, 0.4));
                gradient.addColorStop(1, this.hexToRgba(borderColor, 0));
                return gradient;
              }
            : backgroundColor,
        borderWidth: 3,
        fill: dataset.fill !== false,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: borderColor,
        pointBorderColor: "#0d1117",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
      };
    });

    this.chart = new Chart(this.canvas, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: processedDatasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          },
        },
        plugins: {
          title: {
            display: false,
          },
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#f0f6fc",
              font: {
                size: 13,
                weight: "normal",
              },
              padding: 15,
              usePointStyle: true,
              pointStyle: "circle",
            },
            align: "center",
            maxHeight: 60,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#161b22",
            titleColor: "#f0f6fc",
            bodyColor: "#f0f6fc",
            borderColor: "#ff6b35",
            borderWidth: 2,
            cornerRadius: 8,
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: false,
            },
            ticks: {
              color: "#f0f6fc",
              font: {
                size: 12,
              },
            },
            grid: {
              display: false,
            },
          },
          y: {
            display: true,
            title: {
              display: false,
            },
            ticks: {
              color: "#f0f6fc",
              font: {
                size: 12,
              },
            },
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
        },
      },
    });
  }

  private updateChart() {
    if (!this.chart) return;

    const chartLabels =
      this.labels.length > 0
        ? this.labels
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    const chartDatasets =
      this.datasets.length > 0
        ? this.datasets
        : [
            {
              label: "Series 1",
              data: [65, 59, 80, 81, 56, 55],
              borderColor: this.defaultColors[0],
            },
            {
              label: "Series 2",
              data: [28, 48, 40, 19, 86, 27],
              borderColor: this.defaultColors[1],
            },
            {
              label: "Series 3",
              data: [45, 25, 16, 36, 67, 18],
              borderColor: this.defaultColors[2],
            },
          ];

    // Process datasets to add default colors and styling
    const processedDatasets = chartDatasets.map((dataset, index) => {
      const borderColor =
        dataset.borderColor ||
        this.defaultColors[index % this.defaultColors.length];
      const backgroundColor =
        dataset.backgroundColor || this.hexToRgba(borderColor, 0.1);

      return {
        label: dataset.label,
        data: dataset.data,
        borderColor: borderColor,
        backgroundColor:
          dataset.fill !== false
            ? (context: any) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;
                if (!chartArea) {
                  return this.hexToRgba(borderColor, 0.2);
                }
                const gradient = ctx.createLinearGradient(
                  0,
                  chartArea.top,
                  0,
                  chartArea.bottom
                );
                gradient.addColorStop(0, this.hexToRgba(borderColor, 0.4));
                gradient.addColorStop(1, this.hexToRgba(borderColor, 0));
                return gradient;
              }
            : backgroundColor,
        borderWidth: 3,
        fill: dataset.fill !== false,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: borderColor,
        pointBorderColor: "#0d1117",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
      };
    });

    this.chart.data.labels = chartLabels;
    this.chart.data.datasets = processedDatasets;
    this.chart.update();
  }

  render() {
    return html`
      <div class="chart-title">${this.title}</div>
      <div class="chart-container">
        <canvas></canvas>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-chart-stack": AppChartStack;
  }
}
