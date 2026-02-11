"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    subtitle: "Narenciye Notaları",
    title: "Portakal Çiçeği",
    description:
      "Akdeniz bahçelerinden ilham alan portakal çiçeği notaları, tazeliği ve zarafeti bir arada sunar. Enerjik açılışı ve yumuşak geçişiyle her mevsim vazgeçilmeziniz olacak.",
    buttonText: "Koleksiyonu Keşfet",
    buttonHref: "/katalog",
    image: "/parfum-default.jpg",
  },
  {
    subtitle: "Oryantal Notalar",
    title: "Deri",
    description:
      "Güçlü ve kararlı deri notaları, parfüme derinlik ve karakter katar. Dumanlı, sıcak alt tonlarıyla sofistike bir iz bırakmak isteyenler için.",
    buttonText: "Deri Notalarını İncele",
    buttonHref: "/katalog",
    image: "/parfum-default.jpg",
  },
  {
    subtitle: "Odunsu Notalar",
    title: "Sandal Ağacı",
    description:
      "Sandal ağacının kremsi ve sıcak dokusu, parfümün kalbine huzur verir. Meditasyondan haute couture'a uzanan asırlık bir gelenek.",
    buttonText: "Odunsu Koleksiyon",
    buttonHref: "/katalog",
    image: "/parfum-default.jpg",
  },
  {
    subtitle: "Çiçeksi Notalar",
    title: "Yasemin Çiçeği",
    description:
      "Gecenin kraliçesi olarak bilinen yasemin, büyüleyici ve sarhoş edici aromasıyla parfümeride en çok tercih edilen çiçek notasıdır.",
    buttonText: "Çiçeksi Seçkiler",
    buttonHref: "/katalog",
    image: "/parfum-default.jpg",
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative overflow-hidden bg-surface-warm">
      {/* Background images */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Gold gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(166,139,91,0.15),_transparent_70%)]" />
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Önceki slayt"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 sm:left-6"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Sonraki slayt"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 sm:right-6"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slides content */}
      <div className="relative z-[1] mx-auto max-w-7xl px-6 py-28 sm:py-36">
        <div className="mx-auto max-w-2xl text-center">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${
                i === active
                  ? "opacity-100"
                  : "pointer-events-none absolute inset-0 opacity-0"
              }`}
            >
              {i === active && (
                <>
                  <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.4em] text-amber-300/90">
                    {slide.subtitle}
                  </p>
                  <h1 className="mb-6 text-4xl font-light leading-tight tracking-wide text-white sm:text-5xl">
                    {slide.title}
                  </h1>
                  <div className="mx-auto mb-6 h-px w-20 bg-amber-300/40" />
                  <p className="mb-10 text-sm font-light leading-relaxed text-white/75">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.buttonHref}
                    className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/10 px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    {slide.buttonText}
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slayt ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active
                ? "w-6 bg-amber-300"
                : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
