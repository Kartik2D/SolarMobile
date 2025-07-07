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

@customElement("app-chart")
export class AppChart extends LitElement {
  @property({ type: String }) title = "Chart";
  @property({ type: Array }) labels: string[] = [];
  @property({ type: Array }) data: number[] = [];
  @property({ type: String }) label = "Dataset";
  @property({ type: String }) borderColor = "#ff6b35";
  @property({ type: String }) backgroundColor = "rgba(255, 107, 53, 0.1)";

  @query("canvas") canvas!: HTMLCanvasElement;

  private chart: Chart | null = null;

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
      height: 400px;
      background-color: var(--surface);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
      box-sizing: border-box;
    }

    .chart-container {
      width: 100%;
      height: calc(100% - var(--space-8));
      position: relative;
    }

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .chart-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--space-4);
      color: var(--text);
      text-align: center;
    }
  `;

  firstUpdated() {
    this.createChart();
  }

  updated(changedProperties: Map<string, any>) {
    if (
      this.chart &&
      (changedProperties.has("labels") ||
        changedProperties.has("data") ||
        changedProperties.has("label") ||
        changedProperties.has("borderColor") ||
        changedProperties.has("backgroundColor"))
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
    const defaultData = [65, 59, 80, 81, 56, 55];

    const chartLabels = this.labels.length > 0 ? this.labels : defaultLabels;
    const chartData = this.data.length > 0 ? this.data : defaultData;

    this.chart = new Chart(this.canvas, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: this.label,
            data: chartData,
            borderColor: this.borderColor,
            backgroundColor: (context: any) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) {
                return this.hexToRgba(this.borderColor, 0.2);
              }
              const gradient = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              );
              gradient.addColorStop(0, this.hexToRgba(this.borderColor, 0.4));
              gradient.addColorStop(1, this.hexToRgba(this.borderColor, 0));
              return gradient;
            },
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: this.borderColor,
            pointBorderColor: "#0d1117",
            pointBorderWidth: 2,
            pointHoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
                size: 14,
                weight: "normal",
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#161b22",
            titleColor: "#f0f6fc",
            bodyColor: "#f0f6fc",
            borderColor: this.borderColor,
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
    const chartData =
      this.data.length > 0 ? this.data : [65, 59, 80, 81, 56, 55];

    this.chart.data.labels = chartLabels;
    this.chart.data.datasets[0].data = chartData;
    this.chart.data.datasets[0].label = this.label;
    this.chart.data.datasets[0].borderColor = this.borderColor;
    this.chart.data.datasets[0].backgroundColor = (context: any) => {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      if (!chartArea) {
        return this.hexToRgba(this.borderColor, 0.2);
      }
      const gradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
      );
      gradient.addColorStop(0, this.hexToRgba(this.borderColor, 0.4));
      gradient.addColorStop(1, this.hexToRgba(this.borderColor, 0));
      return gradient;
    };
    (this.chart.data.datasets[0] as any).pointBackgroundColor =
      this.borderColor;

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
    "app-chart": AppChart;
  }
}
