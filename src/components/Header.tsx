"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/katalog", label: "Katalog" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-5">
        {/* Logo - left */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="Choper Logo"
            width={36}
            height={36}
            className="rounded-full border border-gold/30 transition-opacity group-hover:opacity-80"
          />
          <span className="text-lg font-light uppercase tracking-[0.3em] text-text">
            Choper
          </span>
        </Link>

        {/* Nav - center */}
        <nav className="hidden flex-1 items-center justify-center gap-8 text-xs font-medium uppercase tracking-[0.2em] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-gold ${pathname === link.href ? "text-gold" : "text-text-muted"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart + Auth - right (desktop) */}
        <div className="hidden shrink-0 items-center gap-4 md:flex">
          <Link
            href="/sepet"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-gold"
            aria-label="Sepet"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {loading ? (
            <div className="h-9 w-20" />
          ) : user ? (
            <>
              <Link
                href="/hesabim"
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-gold"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-gold/8">
                  <span className="text-xs font-bold text-gold">
                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <span className="max-w-[120px] truncate">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
              </Link>
              <button
                onClick={() => logout()}
                className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-gold"
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className="rounded-lg border border-gold/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/8"
            >
              Giriş Yap
            </Link>
          )}
        </div>

        {/* Mobile cart + menu button */}
        <Link
          href="/sepet"
          className="relative ml-auto mr-2 flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-gold md:hidden"
          aria-label="Sepet"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-text md:hidden"
          aria-label="Menüyü aç"
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="border-t border-border-light px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-gold ${pathname === link.href ? "text-gold" : "text-text-muted"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/sepet"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-gold ${pathname === "/sepet" ? "text-gold" : "text-text-muted"}`}
            >
              Sepet
              {cartCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="my-1 h-px bg-border-light" />

            {!loading && (
              user ? (
                <>
                  <Link
                    href="/hesabim"
                    onClick={() => setMenuOpen(false)}
                    className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-gold"
                  >
                    Hesabım
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="text-left text-xs font-medium uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-gold"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/giris"
                    onClick={() => setMenuOpen(false)}
                    className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-gold"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/uye-ol"
                    onClick={() => setMenuOpen(false)}
                    className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted transition-colors hover:text-gold"
                  >
                    Üye Ol
                  </Link>
                </>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
