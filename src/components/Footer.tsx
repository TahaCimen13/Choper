export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-warm">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-center gap-6">
          <span className="text-xs font-light uppercase tracking-[0.3em] text-text-muted">
            Choper
          </span>
          <div className="h-px w-16 bg-gold/20" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs tracking-wide text-text-muted/70">
              &copy; {new Date().getFullYear()} Tüm hakları saklıdır.
            </p>
            <p className="text-xs tracking-wide text-text-muted/50">
              iletisim@choper.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
