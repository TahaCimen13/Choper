"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-gold" />
          <p className="text-xs tracking-widest text-text-muted">YÜKLENİYOR</p>
        </div>
      </div>
    );
  }

  if (!adminEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-sm text-center">
          <div className="mb-4 text-3xl text-gold">⚠</div>
          <h1 className="mb-2 text-lg font-light tracking-wide text-text">
            Yapılandırma Hatası
          </h1>
          <p className="mb-6 text-xs leading-relaxed text-text-muted">
            <code className="rounded bg-surface px-1 py-0.5 font-mono text-[11px] text-text-secondary">
              NEXT_PUBLIC_ADMIN_EMAIL
            </code>{" "}
            ortam değişkeni tanımlanmamış.
          </p>
          <Link
            href="/"
            className="text-xs tracking-widest text-gold hover:text-gold-dark"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  if (!user || user.email !== adminEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface">
            <svg
              className="h-7 w-7 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-xl font-light tracking-wide text-text">
            Erişim Reddedildi
          </h1>
          <div className="mx-auto mb-4 h-px w-12 bg-gold/30" />
          <p className="mb-8 text-xs leading-relaxed text-text-muted">
            Bu sayfaya erişim için yönetici hesabıyla giriş yapmanız gerekiyor.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/giris"
              className="inline-block rounded-full border border-gold/40 bg-surface px-6 py-2.5 text-xs tracking-widest text-gold transition-all hover:bg-gold/5"
            >
              GİRİŞ YAP
            </Link>
            <Link
              href="/"
              className="text-xs tracking-widest text-text-muted hover:text-text"
            >
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
