/**
 * Synthetic UI strings for dark-pattern detection extension / lab demos only.
 * Not tied to real inventory, offers, or live visitor counts.
 */
import { useEffect, useState } from "react";
import "./DarkPatternDemoBlocks.css";

function useDemoCountdownLoop(initialSeconds = 120) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 1 ? initialSeconds : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [initialSeconds]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/** Full-width strip under the main nav (discount + timer). */
export function DarkPatternDemoBanner() {
  const time = useDemoCountdownLoop(120);
  return (
    <div
      className="dp-demo-banner"
      data-demo-dark-pattern-lab="true"
      data-dark-pattern="fake-discount-urgency"
      role="region"
      aria-label="Promotional banner (demo lab)"
    >
      <div className="dp-demo-banner-inner">
        <span className="dp-demo-banner-fire" aria-hidden="true">
          🔥
        </span>
        <strong>Flash deal:</strong> extra 15% off at checkout —{" "}
        <span className="dp-demo-banner-timer">
          Offer ends in <strong>{time}</strong>!
        </span>
      </div>
    </div>
  );
}

/** Product page: fake scarcity, viewers, countdown. */
export function DarkPatternProductNudges() {
  const time = useDemoCountdownLoop(120);
  return (
    <div
      className="dp-demo-product"
      data-demo-dark-pattern-lab="true"
      data-dark-pattern="product-pressure"
    >
      <h3
        className="dp-demo-urgency"
        style={{ color: "red" }}
        data-dark-pattern="fake-urgency-stock"
      >
        Only 2 left in stock! Hurry!
      </h3>
      <p
        className="dp-demo-countdown"
        data-dark-pattern="fake-countdown"
      >
        Offer ends in {time} minutes!
      </p>
      <p
        className="dp-demo-social"
        data-dark-pattern="fake-social-proof"
      >
        🔥 12 people are viewing this right now
      </p>
    </div>
  );
}

/** Order / checkout: confirmshaming + timer strip. */
export function DarkPatternCheckoutNudges() {
  const time = useDemoCountdownLoop(120);
  return (
    <div
      className="dp-demo-checkout"
      data-demo-dark-pattern-lab="true"
      data-dark-pattern="checkout-nudges"
    >
      <p className="dp-demo-checkout-timer" data-dark-pattern="fake-countdown">
        Offer ends in {time} minutes — complete your order to lock this price.
      </p>
      <div
        className="dp-demo-confirmshame"
        data-dark-pattern="confirmshaming"
      >
        <p className="dp-demo-confirmshame-title">
          Add <strong>free express delivery</strong> on this order?
        </p>
        <div className="dp-demo-confirmshame-actions">
          <button type="button" className="btn dp-demo-btn-yes">
            Yes, add free express delivery
          </button>
          <button
            type="button"
            className="dp-demo-btn-shame"
            data-dark-pattern="confirmshaming-decline"
          >
            No, I don&apos;t want to save money
          </button>
        </div>
      </div>
    </div>
  );
}
