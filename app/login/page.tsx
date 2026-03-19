import { Suspense } from "react";
import { AuthCard } from "../../components/AuthCard";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="mt-4 h-10 w-full animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-10 w-full animate-pulse rounded bg-zinc-200" />
          <div className="mt-4 h-10 w-full animate-pulse rounded bg-zinc-200" />
        </div>
      }
    >
      <AuthCard mode="login" />
    </Suspense>
  );
}

