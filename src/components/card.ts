import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("app-card")
export class AppCard extends LitElement {
  @property({ type: String }) title = "";
  @state() private isInView = false;

  private observer?: IntersectionObserver;

  connectedCallback() {
    super.connectedCallback();
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Card is in view - add hover effect
            this.isInView = true;
          } else {
            // Card is out of view - remove hover effect
            this.isInView = false;
          }
        });
      },
      {
        threshold: 0.7, // Trigger when 40% of the card is visible
        rootMargin: "0px 0px -20px 0px", // Small offset from bottom
      }
    );

    // Start observing when the component is ready
    this.updateComplete.then(() => {
      this.observer?.observe(this);
    });
  }

  render() {
    return html`
      <div class="card ${this.isInView ? "card--in-view" : ""}">
        <div class="card__header">
          <h3 class="card__title">${this.title || "Card"}</h3>
        </div>
        <div class="card__content">
          <slot></slot>
        </div>
        <slot name="footer"></slot>
      </div>
    `;
  }

  static styles = css`
    .card {
      display: block;
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-normal);
      margin-bottom: var(--space-4);
    }

    /* Scroll-based hover effect */
    .card--in-view {
      transform: translateY(-4px);
      border-color: var(--primary);
      box-shadow: var(--shadow-lg), var(--glow-primary);
    }

    .card--in-view .card__title {
      color: var(--primary);
    }

    .card__header {
      padding: var(--space-4);
      border-bottom: 1px solid var(--border);
      background-color: var(--surface);
    }

    .card__title {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text);
      transition: color var(--transition-normal);
    }

    .card__content {
      padding: var(--space-4);
    }

    .card__content:empty {
      display: none;
    }

    /* Footer slot styling */
    ::slotted([slot="footer"]) {
      display: block;
      padding: var(--space-4);
      border-top: 1px solid var(--border);
      background-color: var(--surface);
    }

    /* Card actions styling */
    ::slotted(.card-actions) {
      display: flex;
      gap: var(--space-3);
      align-items: center;
      padding: var(--space-4);
      border-top: 1px solid var(--border);
      background-color: var(--surface);
    }

    ::slotted(.card-actions--flush) {
      padding: 0;
      gap: 0;
      border-top: 1px solid var(--border);
      background-color: var(--surface);
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .card {
        transition: none;
      }

      .card--in-view {
        transform: none;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "app-card": AppCard;
  }
}
