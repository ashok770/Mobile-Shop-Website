import React from "react";
import "./CustomersPage.css";

export default function CustomerStatusBadge({ status }) {
  if (!status) return null;

  const normalized = String(status).trim();
  const lower = normalized.toLowerCase();

  let badgeClass = `customer-badge badge-${lower}`;
  let label = normalized;

  if (normalized === "ACTIVE") label = "Active";
  else if (normalized === "DISABLED") label = "Disabled";
  else if (normalized === "SUSPENDED") label = "Suspended";

  return (
    <span className={badgeClass}>
      <span className="badge-dot" />
      {label}
    </span>
  );
}
