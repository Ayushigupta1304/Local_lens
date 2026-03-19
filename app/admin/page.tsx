"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminReviewRow } from "../../components/AdminReviewRow";
import { BusinessFormModal } from "../../components/BusinessFormModal";
import { RequireAdmin, RequireAuth } from "../../components/ProtectedStates";
import { StatCard } from "../../components/StatCard";
import { adminBusinessesSeed, adminReviewsSeed, type AdminReview } from "../../lib/adminMockData";
import type { Business } from "../../lib/types";

function slugifyId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<AdminReview[]>(adminReviewsSeed);
  const [businesses, setBusinesses] = useState<Business[]>(adminBusinessesSeed);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editing, setEditing] = useState<Business | undefined>(undefined);

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 450);
    return () => window.clearTimeout(t);
  }, []);

  const businessById = useMemo(() => {
    const map = new Map<string, Business>();
    for (const b of businesses) map.set(b.id, b);
    return map;
  }, [businesses]);

  const pending = useMemo(
    () => reviews.filter((r) => r.status === "pending").slice().sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO)),
    [reviews]
  );
  const approved = useMemo(
    () => reviews.filter((r) => r.status === "approved").slice().sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO)),
    [reviews]
  );
  const rejectedCount = useMemo(
    () => reviews.filter((r) => r.status === "rejected").length,
    [reviews]
  );

  function setReviewStatus(id: string, status: AdminReview["status"]) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function openAddBusiness() {
    setModalMode("add");
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEditBusiness(b: Business) {
    setModalMode("edit");
    setEditing(b);
    setModalOpen(true);
  }

  return (
    <main className="bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <RequireAuth
          title="Admin dashboard"
          description="Log in to access admin moderation and management tools."
        >
          <RequireAdmin>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
                  Admin dashboard
                </h1>
                <p className="mt-1 text-sm text-zinc-600">
                  Approve or reject reviews, and manage local businesses (demo UI only).
                </p>
              </div>
            </div>

            <section className="mt-6">
              <h2 className="text-sm font-semibold text-zinc-950">Dashboard stats</h2>
              {isLoading ? (
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[96px] animate-pulse rounded-2xl border border-zinc-200 bg-white"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard label="Businesses" value={businesses.length} />
                  <StatCard
                    label="Pending reviews"
                    value={pending.length}
                    hint="Awaiting moderation"
                  />
                  <StatCard label="Approved reviews" value={approved.length} />
                  <StatCard label="Rejected reviews" value={rejectedCount} />
                </div>
              )}
            </section>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <section>
                <div className="flex items-end justify-between gap-3">
                  <h2 className="text-sm font-semibold text-zinc-950">Pending reviews</h2>
                  <div className="text-xs text-zinc-600 tabular-nums">
                    {isLoading ? "Loading…" : `${pending.length} pending`}
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[168px] animate-pulse rounded-xl border border-zinc-200 bg-white"
                      />
                    ))
                  ) : pending.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                      <div className="text-sm font-semibold text-zinc-950">
                        No pending reviews
                      </div>
                      <p className="mt-1 text-sm text-zinc-600">
                        Everything is up to date.
                      </p>
                    </div>
                  ) : (
                    pending.map((r) => (
                      <AdminReviewRow
                        key={r.id}
                        review={r}
                        business={businessById.get(r.businessId)}
                        actions={
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() => setReviewStatus(r.id, "approved")}
                              className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => setReviewStatus(r.id, "rejected")}
                              className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                            >
                              Reject
                            </button>
                          </div>
                        }
                      />
                    ))
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-end justify-between gap-3">
                  <h2 className="text-sm font-semibold text-zinc-950">
                    Approved reviews
                  </h2>
                  <div className="text-xs text-zinc-600 tabular-nums">
                    {isLoading ? "Loading…" : `${approved.length} approved`}
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[168px] animate-pulse rounded-xl border border-zinc-200 bg-white"
                      />
                    ))
                  ) : approved.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
                      <div className="text-sm font-semibold text-zinc-950">
                        No approved reviews
                      </div>
                      <p className="mt-1 text-sm text-zinc-600">
                        Approve pending reviews to publish them.
                      </p>
                    </div>
                  ) : (
                    approved.map((r) => (
                      <AdminReviewRow
                        key={r.id}
                        review={r}
                        business={businessById.get(r.businessId)}
                      />
                    ))
                  )}
                </div>
              </section>
            </div>

            <section className="mt-10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-950">Businesses</h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    Add, edit, or delete local businesses (demo UI only).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddBusiness}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Add business
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-zinc-50 text-xs font-semibold text-zinc-600">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Address</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-4 py-3">
                              <div className="h-4 w-48 rounded bg-zinc-200" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 w-20 rounded bg-zinc-200" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 w-24 rounded bg-zinc-200" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 w-56 rounded bg-zinc-200" />
                            </td>
                            <td className="px-4 py-3">
                              <div className="ml-auto h-8 w-40 rounded bg-zinc-200" />
                            </td>
                          </tr>
                        ))
                      ) : businesses.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-10 text-center">
                            <div className="text-sm font-semibold text-zinc-950">
                              No businesses
                            </div>
                            <div className="mt-1 text-sm text-zinc-600">
                              Add a business to get started.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        businesses.map((b) => (
                          <tr key={b.id} className="align-top">
                            <td className="px-4 py-3">
                              <div className="font-semibold text-zinc-950">{b.name}</div>
                              <div className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
                                {b.shortDescription}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                                {b.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-700">
                                {b.location}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-zinc-700">{b.addressLine}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditBusiness(b)}
                                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const ok = window.confirm(
                                      `Delete “${b.name}”? (demo only)`
                                    );
                                    if (!ok) return;
                                    setBusinesses((prev) =>
                                      prev.filter((x) => x.id !== b.id)
                                    );
                                  }}
                                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </RequireAdmin>
        </RequireAuth>
      </div>

      <BusinessFormModal
        key={`${modalMode}:${editing?.id ?? "new"}`}
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={(draft) => {
          if (modalMode === "add") {
            const id = slugifyId(draft.name) || `biz-${Date.now()}`;
            const next: Business = {
              id,
              name: draft.name,
              category: draft.category,
              location: draft.location,
              shortDescription: draft.shortDescription,
              addressLine: draft.addressLine,
              averageRating: 0,
              ratingCount: 0,
              averageBreakdown: { quality: 0, service: 0, value: 0 },
            };
            setBusinesses((prev) => [next, ...prev]);
          } else if (modalMode === "edit" && editing) {
            setBusinesses((prev) =>
              prev.map((b) =>
                b.id === editing.id
                  ? {
                      ...b,
                      name: draft.name,
                      category: draft.category,
                      location: draft.location,
                      shortDescription: draft.shortDescription,
                      addressLine: draft.addressLine,
                    }
                  : b
              )
            );
          }
          setModalOpen(false);
        }}
      />
    </main>
  );
}

