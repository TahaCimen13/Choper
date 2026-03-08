import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Choper" width={40} height={40} />
              <span className="text-sm font-light uppercase tracking-[0.3em] text-text">Choper</span>
            </Link>
            <p className="text-xs leading-relaxed text-text-muted/70">
              En seçkin parfümleri keşfedin. Dior, Chanel, Tom Ford ve daha fazlası.
            </p>
          </div>

          {/* Keşfet */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted">Keşfet</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="text-xs text-text-muted/70 transition-colors hover:text-gold">Ana Sayfa</Link>
              <Link href="/katalog" className="text-xs text-text-muted/70 transition-colors hover:text-gold">Katalog</Link>
              <Link href="/katalog?gender=Erkek" className="text-xs text-text-muted/70 transition-colors hover:text-gold">Erkek Parfümleri</Link>
              <Link href="/katalog?gender=Kadın" className="text-xs text-text-muted/70 transition-colors hover:text-gold">Kadın Parfümleri</Link>
              <Link href="/katalog?gender=Unisex" className="text-xs text-text-muted/70 transition-colors hover:text-gold">Unisex Parfümleri</Link>
            </div>
          </div>

          {/* Hesap */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted">Hesap</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/giris" className="text-xs text-text-muted/70 transition-colors hover:text-gold">Giriş Yap</Link>
              <Link href="/uye-ol" className="text-xs text-text-muted/70 transition-colors hover:text-gold">Üye Ol</Link>
              <Link href="/sepet" className="text-xs text-text-muted/70 transition-colors hover:text-gold">Sepetim</Link>
              <Link href="/hesabim" className="text-xs text-text-muted/70 transition-colors hover:text-gold">Hesabım</Link>
            </div>
          </div>

          {/* İletişim */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted">İletişim</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/iletisim" className="text-xs text-text-muted/70 transition-colors hover:text-gold">İletişim Formu</Link>
              <a href="mailto:cimentahayasin@gmail.com" className="text-xs text-text-muted/70 transition-colors hover:text-gold">
                cimentahayasin@gmail.com
              </a>
            </div>
            {/* WhatsApp */}
            <a
              href="https://wa.me/905000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex w-fit items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-50/50 px-3 py-1.5 text-[10px] tracking-widest text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="text-[11px] text-text-muted/50">
            &copy; {new Date().getFullYear()} Choper. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-gold/40" />
            <p className="text-[11px] text-text-muted/40 tracking-widest">EN SEÇKİN PARFÜMLER</p>
            <div className="h-1 w-1 rounded-full bg-gold/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
