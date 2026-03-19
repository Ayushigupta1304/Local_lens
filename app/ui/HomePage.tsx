"use client";

import { useEffect, useMemo, useState } from "react";
import { BusinessCard } from "../../components/BusinessCard";
import { SearchFilters, type SearchFiltersValue } from "../../components/SearchFilters";
import { businesses } from "../../lib/mockData";
import type { BusinessCategory, BusinessLocation } from "../../lib/types";

function uniqSorted<T extends string>(items: T[]): T[] {
  return Array.from(new Set(items)).sort((a, b) => a.localeCompare(b));
}

export function HomePage() {
  const categories = useMemo(
    () => uniqSorted(businesses.map((b) => b.category as BusinessCategory)),
    []
  );
  const locations = useMemo(
    () => uniqSorted(businesses.map((b) => b.location as BusinessLocation)),
    []
  );

  const [filters, setFilters] = useState<SearchFiltersValue>({
    query: "",
    category: "All",
    location: "All",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return businesses.filter((b) => {
      if (filters.category !== "All" && b.category !== filters.category) return false;
      if (filters.location !== "All" && b.location !== filters.location) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        b.shortDescription.toLowerCase().includes(q) ||
        b.addressLine.toLowerCase().includes(q)
      );
    });
  }, [filters]);

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              Crowdsourced reviews for local businesses
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600 sm:text-base">
              Browse nearby places, filter by category or location, and read real reviews
              from the community.
            </p>
          </div>
          <div className="mt-6">
            <SearchFilters
              value={filters}
              categories={categories}
              locations={locations}
              onChange={(next) => {
                setIsLoading(true);
                setFilters(next);
                window.setTimeout(() => setIsLoading(false), 250);
              }}
            />
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="text-sm font-semibold text-zinc-950">Local businesses</h2>
            <div className="text-xs text-zinc-600 tabular-nums">
              {isLoading ? "Loading…" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[168px] animate-pulse rounded-xl border border-zinc-200 bg-white p-4"
                >
                  <div className="h-4 w-2/3 rounded bg-zinc-200" />
                  <div className="mt-3 h-3 w-full rounded bg-zinc-200" />
                  <div className="mt-2 h-3 w-5/6 rounded bg-zinc-200" />
                  <div className="mt-4 h-6 w-40 rounded bg-zinc-200" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <div className="text-sm font-semibold text-zinc-950">No matches</div>
              <p className="mt-1 text-sm text-zinc-600">
                Try adjusting your search, category, or location filters.
              </p>
              <button
                onClick={() =>
                  setFilters({ query: "", category: "All", location: "All" })
                }
                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

