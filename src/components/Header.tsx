"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border bg-surface shadow-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
        {/* Logo - left */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="Choper Logo"
            width={64}
            height={64}
            className="transition-opacity group-hover:opacity-80"
          />
          <span
            className={`text-lg font-light uppercase tracking-[0.3em] transition-colors ${
              transparent ? "text-white" : "text-text"
            }`}
          >
            Choper
          </span>
        </Link>

        {/* Nav - center */}
        <nav className="hidden flex-1 items-center justify-center gap-8 text-xs font-medium uppercase tracking-[0.2em] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                transparent
                  ? `hover:text-amber-300 ${pathname === link.href ? "text-amber-300" : "text-white/80"}`
                  : `hover:text-gold ${pathname === link.href ? "text-gold" : "text-text-muted"}`
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
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              transparent ? "text-white/80 hover:text-amber-300" : "text-text-muted hover:text-gold"
            }`}
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
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest transition-colors ${
                    transparent
                      ? "border-amber-300/40 text-amber-300 hover:bg-amber-300/10"
                      : "border-gold/40 text-gold hover:bg-gold/8"
                  }`}
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin
                </Link>
              )}
              <Link
                href="/hesabim"
                className={`flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                  transparent ? "text-white/80 hover:text-amber-300" : "text-text-muted hover:text-gold"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
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
                className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                  transparent ? "text-white/80 hover:text-amber-300" : "text-text-muted hover:text-gold"
                }`}
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className={`rounded-lg border px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                transparent
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-gold/30 text-gold hover:bg-gold/8"
              }`}
            >
              Giriş Yap
            </Link>
          )}
        </div>

        {/* Mobile cart + menu button */}
        <Link
          href="/sepet"
          className={`relative ml-auto mr-2 flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:hidden ${
            transparent ? "text-white/80 hover:text-amber-300" : "text-text-muted hover:text-gold"
          }`}
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
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:hidden ${
            transparent ? "text-white/80 hover:text-white" : "text-text-muted hover:text-text"
          }`}
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
        <nav
          className={`border-t px-6 py-4 md:hidden ${
            transparent
              ? "border-white/10 bg-black/50 backdrop-blur-md"
              : "border-border-light bg-surface"
          }`}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                  transparent
                    ? `hover:text-amber-300 ${pathname === link.href ? "text-amber-300" : "text-white/80"}`
                    : `hover:text-gold ${pathname === link.href ? "text-gold" : "text-text-muted"}`
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/sepet"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                transparent
                  ? "text-white/80 hover:text-amber-300"
                  : `hover:text-gold ${pathname === "/sepet" ? "text-gold" : "text-text-muted"}`
              }`}
            >
              Sepet
              {cartCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className={`my-1 h-px ${transparent ? "bg-white/10" : "bg-border-light"}`} />

            {!loading && (
              user ? (
                <>
                  <Link
                    href="/hesabim"
                    onClick={() => setMenuOpen(false)}
                    className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                      transparent ? "text-white/80 hover:text-amber-300" : "text-text-muted hover:text-gold"
                    }`}
                  >
                    Hesabım
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className={`text-left text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                      transparent ? "text-white/80 hover:text-amber-300" : "text-text-muted hover:text-gold"
                    }`}
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/giris"
                    onClick={() => setMenuOpen(false)}
                    className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                      transparent ? "text-white/80 hover:text-amber-300" : "text-text-muted hover:text-gold"
                    }`}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/uye-ol"
                    onClick={() => setMenuOpen(false)}
                    className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
                      transparent ? "text-white/80 hover:text-amber-300" : "text-text-muted hover:text-gold"
                    }`}
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
