import Link from "next/link";
import { BusinessDetailsHeader } from "../../../components/BusinessDetailsHeader";
import { RatingStars } from "../../../components/RatingStars";
import { ReviewCard } from "../../../components/ReviewCard";
import { ReviewFormSection } from "../../../components/ReviewFormSection";
import { businesses, getReviewsForBusiness } from "../../../lib/mockData";

function RatingRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className="grid grid-cols-[90px_1fr_auto] items-center gap-3">
      <div className="text-sm font-medium text-zinc-700">{label}</div>
      <div className="h-2 rounded-full bg-zinc-200">
        <div
          className="h-2 rounded-full bg-amber-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-sm font-medium tabular-nums text-zinc-800">
        {value.toFixed(1)}
      </div>
    </div>
  );
}

export default function BusinessDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const business = businesses.find((b) => b.id === params.id);

  if (!business) {
    return (
      <main className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
            <div className="text-sm font-semibold text-zinc-950">
              Business not found
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              Try going back to browse local businesses.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const businessReviews = getReviewsForBusiness(business.id);

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-950"
          >
            <span aria-hidden="true">←</span> Back
          </Link>
        </div>

        <BusinessDetailsHeader business={business} />

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-zinc-950">
                  Rating breakdown
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Quality, service, and value averages
                </p>
              </div>
              <div className="shrink-0">
                <RatingStars value={business.averageRating} size="sm" showValue />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <RatingRow label="Quality" value={business.averageBreakdown.quality} />
              <RatingRow label="Service" value={business.averageBreakdown.service} />
              <RatingRow label="Value" value={business.averageBreakdown.value} />
            </div>

            <button
              type="button"
              className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
            >
              <a href="#write-review" className="w-full">
                Write a review
              </a>
            </button>
          </section>

          <section className="lg:col-span-2">
            <div className="mb-3 flex items-end justify-between gap-3">
              <h2 className="text-sm font-semibold text-zinc-950">Reviews</h2>
              <div className="text-xs text-zinc-600 tabular-nums">
                {businessReviews.length} review{businessReviews.length === 1 ? "" : "s"}
              </div>
            </div>

            {businessReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                <div className="text-sm font-semibold text-zinc-950">
                  No reviews yet
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  Be the first to write a review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {businessReviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}

            <div className="mt-6">
              <ReviewFormSection businessName={business.name} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

