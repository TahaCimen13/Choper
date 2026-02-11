"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function HesabimPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/giris");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-ivory">
        <div className="text-sm text-text-muted">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) return null;

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ivory px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <h1 className="mb-8 text-center text-2xl font-light uppercase tracking-[0.2em] text-text">
            Hesabım
          </h1>

          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/8">
                <span className="text-2xl font-bold text-gold">
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                Ad
              </label>
              <div className="rounded-lg border border-border bg-ivory px-4 py-3 text-sm text-text">
                {user.displayName || "—"}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                E-posta
              </label>
              <div className="rounded-lg border border-border bg-ivory px-4 py-3 text-sm text-text">
                {user.email || "—"}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-border px-4 py-3 text-sm font-medium uppercase tracking-wider text-text-secondary transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}
