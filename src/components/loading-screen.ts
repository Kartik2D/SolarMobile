import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("app-loading-screen")
export class LoadingScreen extends LitElement {
  @property({ type: Boolean })
  visible = true;

  @property({ type: String })
  message = "Loading Solar Dashboard...";

  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      transition: opacity var(--transition-slow),
        visibility var(--transition-slow);
    }

    :host([hidden]) {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-8);
      text-align: center;
      padding: var(--space-6);
    }

    .spinner {
      width: 60px;
      height: 60px;
      position: relative;
    }

    .spinner::before,
    .spinner::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      border: 3px solid transparent;
      animation: spin 2s linear infinite;
    }

    .spinner::before {
      width: 60px;
      height: 60px;
      border-top-color: var(--primary);
      border-right-color: var(--primary);
      animation-duration: 1.5s;
    }

    .spinner::after {
      width: 40px;
      height: 40px;
      top: 10px;
      left: 10px;
      border-top-color: var(--secondary);
      border-left-color: var(--secondary);
      animation-duration: 1s;
      animation-direction: reverse;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .loading-text {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text);
      margin-bottom: var(--space-2);
    }

    .loading-subtext {
      font-size: var(--font-size-sm);
      color: var(--text-dim);
      opacity: 0.8;
    }

    .pulse-dots {
      display: flex;
      gap: var(--space-2);
      margin-top: var(--space-4);
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--primary);
      animation: pulse-fade 1.5s infinite;
    }

    .pulse-dot:nth-child(2) {
      animation-delay: 0.5s;
    }

    .pulse-dot:nth-child(3) {
      animation-delay: 1s;
    }

    @keyframes pulse-fade {
      0%,
      100% {
        opacity: 0.3;
        transform: scale(0.8);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
    }

    /* Mobile optimizations */
    @media (max-width: 640px) {
      .spinner {
        width: 50px;
        height: 50px;
      }

      .spinner::before {
        width: 50px;
        height: 50px;
      }

      .spinner::after {
        width: 30px;
        height: 30px;
        top: 10px;
        left: 10px;
      }

      .loading-text {
        font-size: var(--font-size-base);
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .spinner::before,
      .spinner::after {
        animation: none;
        border-top-color: var(--primary);
        border-right-color: var(--primary);
      }

      .pulse-dot {
        animation: none;
        opacity: 0.6;
      }
    }
  `;

  hide() {
    this.setAttribute("hidden", "");

    // Remove from DOM after animation completes
    setTimeout(() => {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    }, 500);
  }

  render() {
    return html`
      <div class="loading-container">
        <div class="spinner"></div>
        <div class="loading-text">${this.message}</div>
        <div class="loading-subtext">Preparing your solar dashboard</div>
        <div class="pulse-dots">
          <div class="pulse-dot"></div>
          <div class="pulse-dot"></div>
          <div class="pulse-dot"></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-loading-screen": LoadingScreen;
  }
}
