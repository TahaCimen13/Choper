"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Iletisim() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, "messages"), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
        read: false,
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
          İletişim
        </p>
        <h1 className="mb-4 text-3xl font-light tracking-wide text-text">
          Bize Ulaşın
        </h1>
        <div className="mx-auto h-px w-16 bg-gold/30" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Contact info */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark">
              Adres
            </h3>
            <p className="text-sm font-light leading-relaxed text-text-secondary">
              Nişantaşı Mah. Abdi İpekçi Cad.<br />
              No: 42/A, Şişli<br />
              İstanbul, Türkiye
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark">
              Telefon
            </h3>
            <p className="text-sm font-light text-text-secondary">
              +90 (212) 555 00 42
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark">
              E-posta
            </h3>
            <p className="text-sm font-light text-text-secondary">
              iletisim@choper.com
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-gold-dark">
              Çalışma Saatleri
            </h3>
            <p className="text-sm font-light leading-relaxed text-text-secondary">
              Pazartesi - Cumartesi: 10:00 - 20:00<br />
              Pazar: 12:00 - 18:00
            </p>
          </div>
        </div>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
          {success && (
            <div className="rounded-lg border border-gold/30 bg-gold/8 px-4 py-3">
              <p className="text-xs font-medium text-gold-dark">
                Mesajınız iletildi. En kısa sürede dönüş yapacağız.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
              Ad Soyad
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-ivory px-4 py-2.5 text-xs text-text placeholder:text-text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-ivory px-4 py-2.5 text-xs text-text placeholder:text-text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
              Mesaj
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-lg border border-border bg-ivory px-4 py-2.5 text-xs leading-relaxed text-text placeholder:text-text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
              placeholder="Mesajınızı yazın..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold/30 bg-gold/8 px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-dark transition-all hover:bg-gold/15 disabled:opacity-60"
          >
            {loading && (
              <div className="h-3 w-3 animate-spin rounded-full border border-gold/30 border-t-gold" />
            )}
            {loading ? "GÖNDERİLİYOR..." : "GÖNDER"}
          </button>
        </form>
      </div>
    </div>
  );
}
