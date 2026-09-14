import React from "react";
import "./OrdersPage.css";

export default function OrderStatusBadge({ status, type = "order" }) {
  if (!status) return null;

  const normalized = String(status).trim();
  const lower = normalized.toLowerCase().replace(/\s+/g, "-");

  let badgeClass = `order-badge badge-${lower}`;

  if (type === "payment") {
    badgeClass = `order-badge badge-payment-${lower}`;
  }

  return (
    <span className={badgeClass}>
      <span className="badge-dot" />
      {normalized}
    </span>
  );
}
