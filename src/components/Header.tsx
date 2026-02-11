"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/katalog", label: "Katalog" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-5">
        {/* Logo - left */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/8 transition-colors group-hover:bg-gold/15">
            <span className="text-sm font-bold text-gold">C</span>
          </div>
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

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-text md:hidden"
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
          </div>
        </nav>
      )}
    </header>
  );
}
