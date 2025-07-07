import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

type ButtonVariant = "primary" | "secondary" | "flush" | "ghost";
type ButtonSize = "small" | "medium" | "large";

@customElement("app-button")
export class AppButton extends LitElement {
  @property({ type: String }) variant: ButtonVariant = "primary";
  @property({ type: String }) size: ButtonSize = "medium";
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) type: "button" | "submit" | "reset" = "button";

  render() {
    return html`
      <button
        class="btn btn--${this.variant} btn--${this.size}"
        ?disabled=${this.disabled}
        type=${this.type}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("app-click", {
        bubbles: true,
        composed: true,
      })
    );
  }

  static styles = css`
    :host {
      display: inline-block;
    }

    /* Flush buttons fill available space */
    :host([variant="flush"]) {
      flex: 1;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      width: 100%;

      font-family: var(--font-family);
      font-weight: var(--font-weight-medium);
      text-decoration: none;
      text-align: center;
      white-space: nowrap;

      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;

      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;

      transition: all var(--transition-normal);
      user-select: none;
      -webkit-user-select: none;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    /* Sizes */
    .btn--small {
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      min-height: var(--touch-target);
    }

    .btn--medium {
      padding: var(--space-3) var(--space-4);
      font-size: var(--font-size-base);
      min-height: var(--touch-target);
    }

    .btn--large {
      padding: var(--space-4) var(--space-5);
      font-size: var(--font-size-lg);
      min-height: var(--touch-target-lg);
    }

    /* Primary variant */
    .btn--primary {
      background-color: var(--primary);
      color: var(--text-inverse);
      box-shadow: var(--shadow-md), var(--glow-primary);
    }

    .btn--primary:hover:not(:disabled) {
      background-color: var(--primary-hover);
      box-shadow: var(--shadow-lg), var(--glow-strong);
      transform: translateY(-1px);
    }

    .btn--primary:active:not(:disabled) {
      background-color: var(--primary-active);
      transform: translateY(0);
      box-shadow: var(--shadow-sm), var(--glow-primary);
    }

    /* Secondary variant */
    .btn--secondary {
      background-color: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
      box-shadow: var(--shadow-sm);
    }

    .btn--secondary:hover:not(:disabled) {
      background-color: var(--primary);
      color: var(--text-inverse);
      box-shadow: var(--shadow-md), var(--glow-primary);
    }

    .btn--secondary:active:not(:disabled) {
      background-color: var(--primary-active);
      border-color: var(--primary-active);
    }

    /* Ghost variant */
    .btn--ghost {
      background-color: transparent;
      color: var(--text);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
    }

    .btn--ghost:hover:not(:disabled) {
      background-color: var(--surface-hover);
      border-color: var(--border-hover);
      color: var(--primary);
      box-shadow: var(--shadow-md);
    }

    .btn--ghost:active:not(:disabled) {
      background-color: var(--surface);
      transform: scale(0.98);
    }

    /* Flush variant */
    .btn--flush {
      background-color: transparent;
      color: var(--text);
      border-radius: 0;
      border-right: 1px solid var(--border);
      box-shadow: none;
    }

    .btn--flush:last-child {
      border-right: none;
    }

    .btn--flush:hover:not(:disabled) {
      background-color: var(--surface-hover);
      color: var(--primary);
      box-shadow: inset 0 0 0 1px var(--primary-glow);
    }

    .btn--flush:active:not(:disabled) {
      background-color: var(--primary);
      color: var(--text-inverse);
      box-shadow: inset 0 0 0 2px var(--primary-glow-strong);
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .btn {
        transition: none;
      }

      .btn:hover:not(:disabled) {
        transform: none !important;
      }

      .btn:active:not(:disabled) {
        transform: none !important;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "app-button": AppButton;
  }
}
