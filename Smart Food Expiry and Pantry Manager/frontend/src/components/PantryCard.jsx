import React from "react";
import {getExpiryStatus,getDaysRemaining} from "../utils/expiryUtils";
import { getPriority } from "../utils/priorityUtils";

// Formats an ISO date string into something readable, like "Jul 10, 2026".
// If the date is missing or invalid, it falls back to a dash.
function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Works out how many days are left until expiry, and returns a
// small badge (color + label) so users can see freshness at a glance.
function getExpiryBadge(expiryDate) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((expiry - now) / msPerDay);

  if (Number.isNaN(daysLeft)) {
    return { label: "Unknown", classes: "bg-gray-100 text-gray-600" };
  }
  if (daysLeft < 0) {
    return { label: "Expired", classes: "bg-red-100 text-red-700" };
  }
  if (daysLeft <= 3) {
    return { label: `${daysLeft}d left`, classes: "bg-[#FBEBD0] text-[#8A5A12]" };
  }
  return { label: `${daysLeft}d left`, classes: "bg-[#E3EEE6] text-[#3F6C51]" };
}

// PantryCard is a reusable "presentational" component: it just
// displays the data it's given as props, and calls the onEdit /
// onDelete callbacks when those buttons are clicked. It doesn't
// know anything about the API itself.
export default function PantryCard({item, onEdit, onDelete, onConsume}) {
  const { name, category, quantity, remainingQuantity,consumedQuantity, unit, expiryDate, estimatedPrice } = item;
  let status;

    if (remainingQuantity <= 0) {
        status = "consumed";
    }
    else {
        status = getExpiryStatus(expiryDate);
    }
  const daysRemaining = getDaysRemaining(expiryDate);
  const priority = getPriority(item.expiryDate);
  const progress =
    quantity > 0
        ? ((consumedQuantity || 0) / quantity) * 100
        : 0;
  let badgeText = "";
  let badgeClass = "";

  if (status === "consumed") {
      badgeText = "Consumed";
      badgeClass = "bg-gray-100 text-gray-700";
  }
  else if (status === "expired") {
      badgeText = "Expired";
      badgeClass = "bg-red-100 text-red-700";
  }
  else if (status === "expiringSoon") {
      badgeText = "Expiring Soon";
      badgeClass = "bg-orange-100 text-orange-700";
  }
  else {
      badgeText = "Safe";
      badgeClass = "bg-green-100 text-green-700";
  }

  return (
    <div className="bg-white rounded-2xl shadow-md shadow-[#3F6C51]/10 border border-[#3F6C51]/10 p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
      {/* Top row: item name and expiry status badge */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-lg font-semibold text-[#1F2A22] leading-snug">
          {name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}
        >
          {badgeText}
        </span>
      </div>

      {/* Category shown as a small pill */}
      <span className="w-fit rounded-full bg-[#EEF3EA] px-2.5 py-1 text-xs font-medium text-[#3F6C51]">
        {category || "Uncategorized"}
      </span>

      {/* Quantity, expiry date, and price laid out as a mini info grid */}
      <dl className="grid grid-cols-2 gap-y-2 text-sm text-[#1F2A22]/80 mt-1">
        <dt className="text-[#1F2A22]/45">
            Remaining
        </dt>

        <dd className="text-right font-medium text-[#3F6C51]">
            {item.remainingQuantity} {unit}
        </dd>

        <dt className="text-[#1F2A22]/45">
            Consumed
        </dt>

        <dd className="text-right font-medium text-orange-600">
            {item.consumedQuantity || 0} {unit}
        </dd>

        <dt className="text-[#1F2A22]/45">
            Original
        </dt>

        <dd className="text-right font-medium">
            {quantity} {unit}
        </dd>
        

        <dt className="text-[#1F2A22]/45">Expiry date</dt>
        <dd className="text-right font-medium">
            {
                status === "consumed"
                    ? "Fully Consumed"
                    : status === "expired"
                        ? `Expired ${Math.abs(daysRemaining)} day(s) ago`
                        : `In ${daysRemaining} day(s)`
            }
        </dd>

        <dt className="text-[#1F2A22]/45">Est. total price</dt>
        <dd className="text-right font-medium">
          Rs {Number(estimatedPrice ?? 0).toFixed(2)}
        </dd>
      </dl>

      <div className="mt-2">
        <div className="flex justify-between text-xs text-[#1F2A22]/60 mb-1">
            <span>Consumption Progress</span>
            <span>
                {Math.round(progress)}%
            </span>
        </div>

        <div className="w-full bg-[#EEF3EA] rounded-full h-2">
            <div
                className="bg-[#3F6C51] h-2 rounded-full"
                style={{
                    width: `${progress}%`
                }}
            />
        </div>
    </div>

      {/* Action buttons — only shown if the parent passed handlers in */}
      {(onEdit || onDelete) && (
        <div className="flex gap-2 mt-2 pt-3 border-t border-[#1F2A22]/10">

            {onConsume && (
                <button
                    type="button"
                    onClick={() => onConsume(item)}
                    className="
                        flex-1
                        rounded-lg
                        bg-[#3F6C51]
                        py-2
                        text-sm
                        font-medium
                        text-white
                        hover:bg-[#345A43]
                        transition
                    "
                >
                    Consume
                </button>
            )}

            {onEdit && (
                <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="
                        flex-1
                        rounded-lg
                        border
                        border-[#3F6C51]/30
                        py-2
                        text-sm
                        font-medium
                        text-[#3F6C51]
                        hover:bg-[#EEF3EA]
                        transition
                    "
                >
                    Edit
                </button>
            )}

            {onDelete && (
                <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="
                        flex-1
                        rounded-lg
                        border
                        border-red-200
                        py-2
                        text-sm
                        font-medium
                        text-red-600
                        hover:bg-red-50
                        transition
                    "
                >
                    Delete
                </button>
            )}

        </div>
      )}
    </div>
  );
}