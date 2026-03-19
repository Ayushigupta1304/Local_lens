"use client";

import type { AdminReview } from "../lib/adminMockData";
import type { Business } from "../lib/types";
import { RatingStars } from "./RatingStars";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function AdminReviewRow({
  review,
  business,
  actions,
}: {
  review: AdminReview;
  business: Business | undefined;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <div className="text-sm font-semibold text-zinc-950">
              {business?.name ?? "Unknown business"}
            </div>
            <span className="text-xs text-zinc-500">•</span>
            <div className="text-xs text-zinc-600">{review.authorName}</div>
            <span className="text-xs text-zinc-500">•</span>
            <div className="text-xs text-zinc-500">{formatDate(review.createdAtISO)}</div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <RatingStars value={review.overall} size="sm" showValue />
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              Quality: {review.ratings.quality.toFixed(1)}
            </span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              Service: {review.ratings.service.toFixed(1)}
            </span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
              Value: {review.ratings.value.toFixed(1)}
            </span>
          </div>

          <div className="mt-3 text-sm font-semibold text-zinc-950">{review.title}</div>
          <div className="mt-1 text-sm leading-6 text-zinc-700">{review.body}</div>
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}

