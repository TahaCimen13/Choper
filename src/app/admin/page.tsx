"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { uploadProductImage } from "@/lib/storage";
import { Product } from "@/types/product";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/products";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

// ─── Types ───────────────────────────────────────────────────────────────────

type Section = "urunler" | "mesajlar" | "kullanicilar";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp | null;
  read: boolean;
};

type UserProfile = {
  id: string;
  displayName?: string;
  email?: string;
  createdAt?: Timestamp | null;
};

type ProductFormData = {
  name: string;
  brand: string;
  gender: "Erkek" | "Kadın" | "Unisex";
  price: string;
  volume: string;
  description: string;
  category: string;
  imageUrl: string;
  notesUst: string;
  notesOrta: string;
  notesAlt: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const emptyForm: ProductFormData = {
  name: "",
  brand: "",
  gender: "Unisex",
  price: "",
  volume: "",
  description: "",
  category: "",
  imageUrl: "",
  notesUst: "",
  notesOrta: "",
  notesAlt: "",
};

function productToForm(p: Product): ProductFormData {
  return {
    name: p.name,
    brand: p.brand,
    gender: p.gender,
    price: String(p.price),
    volume: p.volume,
    description: p.description,
    category: p.category,
    imageUrl: p.imageUrl,
    notesUst: p.notes.ust.join(", "),
    notesOrta: p.notes.orta.join(", "),
    notesAlt: p.notes.alt.join(", "),
  };
}

function formToProductData(f: ProductFormData): Omit<Product, "id"> {
  return {
    name: f.name.trim(),
    brand: f.brand.trim(),
    gender: f.gender,
    price: Number(f.price),
    volume: f.volume.trim(),
    description: f.description.trim(),
    category: f.category.trim(),
    imageUrl: f.imageUrl.trim(),
    notes: {
      ust: f.notesUst.split(",").map((s) => s.trim()).filter(Boolean),
      orta: f.notesOrta.split(",").map((s) => s.trim()).filter(Boolean),
      alt: f.notesAlt.split(",").map((s) => s.trim()).filter(Boolean),
    },
  };
}

function formatDate(ts: Timestamp | null | undefined): string {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Sidebar nav item ─────────────────────────────────────────────────────────

function NavItem({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "flex w-full items-center gap-3 rounded-lg bg-gold/8 px-3 py-2.5 text-xs font-medium tracking-widest text-gold"
          : "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium tracking-widest text-text-muted transition-colors hover:bg-surface-warm hover:text-text"
      }
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconBox() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>("urunler");

  // ── Products state ──
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Messages state ──
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);

  // ── Users state ──
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);

  // ── Load products on mount ──
  async function loadProducts() {
    setProductsLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Ürünler yüklenirken hata oluştu.");
    } finally {
      setProductsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // ── Load messages on section switch ──
  async function loadMessages() {
    setMessagesLoading(true);
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data: ContactMessage[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ContactMessage, "id">),
      }));
      setMessages(data);
      setMessagesLoaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
    }
  }

  // ── Load users on section switch ──
  async function loadUsers() {
    setUsersLoading(true);
    try {
      const snap = await getDocs(collection(db, "userProfiles"));
      const data: UserProfile[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<UserProfile, "id">),
      }));
      setUsers(data);
      setUsersLoaded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  }

  function handleSectionChange(section: Section) {
    setActiveSection(section);
    if (section === "mesajlar" && !messagesLoaded) {
      loadMessages();
    }
    if (section === "kullanicilar" && !usersLoaded) {
      loadUsers();
    }
  }

  // ── Product modal helpers ──
  function openAddModal() {
    setEditingProduct(null);
    setForm(emptyForm);
    setImagePreview("");
    setUploadProgress(null);
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setForm(productToForm(product));
    setImagePreview(product.imageUrl || "");
    setUploadProgress(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setImagePreview("");
    setUploadProgress(null);
  }

  async function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setUploadProgress(0);
    try {
      const url = await uploadProductImage(file, setUploadProgress);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      setUploadProgress(null);
    } catch (err) {
      const code = err instanceof Error ? err.message : "unknown";
      if (code.includes("unauthorized") || code.includes("permission")) {
        setError("Yükleme izni reddedildi. Firebase Storage kurallarını kontrol edin.");
      } else if (code.includes("canceled")) {
        setError("Yükleme iptal edildi.");
      } else {
        setError(`Resim yüklenemedi: ${code}`);
      }
      setUploadProgress(null);
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.brand.trim() || !form.price) {
      setError("Ad, Marka ve Fiyat alanları zorunludur.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const data = formToProductData(form);
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await addProduct(data);
      }
      await loadProducts();
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Kayıt sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`"${product.name}" ürününü silmek istediğinizden emin misiniz?`)) {
      return;
    }
    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (err) {
      console.error(err);
      setError("Silme sırasında hata oluştu.");
    }
  }

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ── Message helpers ──
  async function handleMessageClick(msg: ContactMessage) {
    if (expandedMsg === msg.id) {
      setExpandedMsg(null);
      return;
    }
    setExpandedMsg(msg.id);
    if (!msg.read) {
      try {
        await updateDoc(doc(db, "messages", msg.id), { read: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function handleDeleteMessage(id: string) {
    if (!window.confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, "messages", id));
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (expandedMsg === id) setExpandedMsg(null);
    } catch (err) {
      console.error(err);
    }
  }

  function openReply(msg: ContactMessage) {
    setReplyTarget(msg);
    setReplyText("");
  }

  function handleSendReply() {
    if (!replyTarget || !replyText.trim()) return;
    setReplySending(true);
    const subject = encodeURIComponent("Re: İletişim Formu Mesajınız");
    const body = encodeURIComponent(replyText);
    window.location.href = `mailto:${replyTarget.email}?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setReplySending(false);
      setReplyTarget(null);
      setReplyText("");
    }, 500);
  }

  // ── User helpers ──
  async function handleDeleteUser(id: string) {
    if (!window.confirm("Bu kullanıcıyı listeden silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, "userProfiles", id));
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  // ── Style constants ──
  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs tracking-wide text-text placeholder:text-text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20";
  const labelClass =
    "block text-[10px] font-medium tracking-widest text-text-muted uppercase mb-1";

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-surface flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs font-light tracking-[0.2em] text-text">
            CHOPER <span className="text-gold">ADMİN</span>
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem
            active={activeSection === "urunler"}
            onClick={() => handleSectionChange("urunler")}
            icon={<IconBox />}
            label="ÜRÜNLER"
          />
          <NavItem
            active={activeSection === "mesajlar"}
            onClick={() => handleSectionChange("mesajlar")}
            icon={<IconChat />}
            label="MESAJLAR"
          />
          <NavItem
            active={activeSection === "kullanicilar"}
            onClick={() => handleSectionChange("kullanicilar")}
            icon={<IconUsers />}
            label="KULLANICILAR"
          />
        </nav>

        {/* Back to site */}
        <div className="px-3 py-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium tracking-widest text-text-muted transition-colors hover:bg-surface-warm hover:text-text"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            SİTEYE DÖN
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-light tracking-[0.2em] text-text">
            {activeSection === "urunler" && "ÜRÜN YÖNETİMİ"}
            {activeSection === "mesajlar" && "MESAJLAR"}
            {activeSection === "kullanicilar" && "KULLANICILAR"}
          </h2>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-[10px] font-medium tracking-widest text-text-muted transition-colors hover:border-gold/40 hover:text-gold"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ANA SAYFA
          </Link>
        </header>

        <main className="flex-1 px-6 py-8">
          {/* Global error */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs text-red-700">{error}</p>
              <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* ── ÜRÜNLER ── */}
          {activeSection === "urunler" && (
            <>
              {/* Stats + Actions */}
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-xl border border-border bg-surface px-5 py-4">
                  <p className="text-[10px] tracking-widest text-text-muted uppercase">Toplam Ürün</p>
                  <p className="mt-1 text-2xl font-light text-text">
                    {productsLoading ? (
                      <span className="inline-block h-7 w-10 animate-pulse rounded bg-border" />
                    ) : (
                      products.length
                    )}
                  </p>
                </div>

                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-5 py-2.5 text-xs tracking-widest text-gold transition-all hover:bg-gold/10"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  YENİ ÜRÜN EKLE
                </button>
              </div>

              {/* Product Table */}
              <div className="rounded-xl border border-border bg-surface overflow-hidden">
                {productsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-gold" />
                      <p className="text-xs tracking-widest text-text-muted">YÜKLENİYOR</p>
                    </div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border">
                      <svg className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p className="text-xs tracking-wide text-text-muted">Henüz ürün yok.</p>
                    <button
                      onClick={openAddModal}
                      className="text-xs tracking-widest text-gold hover:text-gold-dark"
                    >
                      İlk ürünü ekle →
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-surface-warm">
                          <th className="px-4 py-3 text-left text-[10px] font-medium tracking-widest text-text-muted uppercase">Görsel</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium tracking-widest text-text-muted uppercase">Ad</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium tracking-widest text-text-muted uppercase">Marka</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium tracking-widest text-text-muted uppercase">Cinsiyet</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium tracking-widest text-text-muted uppercase">Fiyat</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium tracking-widest text-text-muted uppercase">Kategori</th>
                          <th className="px-4 py-3 text-right text-[10px] font-medium tracking-widest text-text-muted uppercase">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {products.map((product) => (
                          <tr key={product.id} className="transition-colors hover:bg-surface-warm/50">
                            <td className="px-4 py-3">
                              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border bg-surface-warm">
                                {product.imageUrl ? (
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <svg className="h-4 w-4 text-text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-xs font-medium text-text">{product.name}</p>
                              <p className="text-[11px] text-text-muted">{product.volume}</p>
                            </td>
                            <td className="px-4 py-3 text-xs text-text-secondary">{product.brand}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] tracking-wide ${
                                product.gender === "Erkek"
                                  ? "bg-blue-50 text-blue-600"
                                  : product.gender === "Kadın"
                                  ? "bg-pink-50 text-pink-600"
                                  : "bg-gold/10 text-gold-dark"
                              }`}>
                                {product.gender}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs font-medium text-text">
                              {product.price.toLocaleString("tr-TR")} ₺
                            </td>
                            <td className="px-4 py-3 text-xs text-text-muted">{product.category}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditModal(product)}
                                  className="rounded-lg border border-border px-3 py-1.5 text-[10px] tracking-widest text-text-secondary transition-all hover:border-gold/40 hover:text-gold"
                                >
                                  DÜZENLE
                                </button>
                                <button
                                  onClick={() => handleDelete(product)}
                                  className="rounded-lg border border-border px-3 py-1.5 text-[10px] tracking-widest text-text-muted transition-all hover:border-red-300 hover:text-red-500"
                                >
                                  SİL
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── MESAJLAR ── */}
          {activeSection === "mesajlar" && (
            <div>
              {messagesLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-gold" />
                    <p className="text-xs tracking-widest text-text-muted">YÜKLENİYOR</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border">
                    <IconChat />
                  </div>
                  <p className="text-xs tracking-wide text-text-muted">Henüz mesaj yok.</p>
                </div>
              ) : (
                <div className="space-y-3 max-w-2xl">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:bg-surface-warm/50"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => handleMessageClick(msg)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            {!msg.read && (
                              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-text truncate">{msg.name}</p>
                              <p className="text-[11px] text-text-muted truncate">{msg.email}</p>
                            </div>
                          </div>
                          <p className="shrink-0 text-[10px] text-text-muted">
                            {formatDate(msg.createdAt)}
                          </p>
                        </div>

                        {expandedMsg === msg.id ? (
                          <p className="mt-3 text-xs leading-relaxed text-text-secondary whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-text-muted line-clamp-1">
                            {msg.message}
                          </p>
                        )}
                      </div>

                      {expandedMsg === msg.id && (
                        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                          <button
                            onClick={() => openReply(msg)}
                            className="flex items-center gap-1.5 rounded-lg border border-gold/40 px-3 py-1.5 text-[10px] tracking-widest text-gold transition-colors hover:bg-gold/8"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            CEVAPLA
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[10px] tracking-widest text-text-muted transition-colors hover:border-red-300 hover:text-red-500"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            SİL
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── KULLANICILAR ── */}
          {activeSection === "kullanicilar" && (
            <div>
              {usersLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-gold" />
                    <p className="text-xs tracking-widest text-text-muted">YÜKLENİYOR</p>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border">
                    <IconUsers />
                  </div>
                  <p className="max-w-xs text-center text-xs leading-relaxed tracking-wide text-text-muted">
                    Henüz kayıtlı kullanıcı yok. Kullanıcılar giriş yaptıkça burada görünecek.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-surface overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-surface-warm">
                          <th className="px-4 py-3 text-left text-[10px] font-medium tracking-widest text-text-muted uppercase">Ad</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium tracking-widest text-text-muted uppercase">E-posta</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium tracking-widest text-text-muted uppercase">Kayıt Tarihi</th>
                          <th className="px-4 py-3 text-right text-[10px] font-medium tracking-widest text-text-muted uppercase">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {users.map((user) => (
                          <tr key={user.id} className="transition-colors hover:bg-surface-warm/50">
                            <td className="px-4 py-3 text-xs font-medium text-text">
                              {user.displayName || "—"}
                            </td>
                            <td className="px-4 py-3 text-xs text-text-secondary">
                              {user.email || "—"}
                            </td>
                            <td className="px-4 py-3 text-xs text-text-muted">
                              {formatDate(user.createdAt ?? null)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="rounded-lg border border-border px-3 py-1.5 text-[10px] tracking-widest text-text-muted transition-all hover:border-red-300 hover:text-red-500"
                              >
                                SİL
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Product Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-text/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
              <h2 className="text-sm font-light tracking-widest text-text">
                {editingProduct ? "ÜRÜN DÜZENLE" : "YENİ ÜRÜN EKLE"}
              </h2>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-border hover:text-text"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-6">
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Görsel Yükle */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>Ürün Görseli</label>
                  <div className="flex items-start gap-4">
                    {/* Önizleme */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-warm">
                      {imagePreview ? (
                        <Image src={imagePreview} alt="Önizleme" fill className="object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg className="h-6 w-6 text-text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      {/* Upload progress */}
                      {uploadProgress !== null && (
                        <div className="mb-2">
                          <div className="mb-1 flex justify-between text-[10px] text-text-muted">
                            <span>Yükleniyor...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-border">
                            <div
                              className="h-full rounded-full bg-gold transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageFile(file);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadProgress !== null}
                        className="mb-2 flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs tracking-widest text-text-secondary transition-all hover:border-gold/40 hover:text-gold disabled:opacity-50"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        BİLGİSAYARDAN SEÇ
                      </button>
                      <p className="text-[10px] text-text-muted">JPG, PNG, WEBP — maks. 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Ad */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>Ad *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Sauvage Eau de Parfum"
                    className={inputClass}
                  />
                </div>

                {/* Marka */}
                <div>
                  <label className={labelClass}>Marka *</label>
                  <input
                    type="text"
                    name="brand"
                    value={form.brand}
                    onChange={handleFormChange}
                    placeholder="Dior"
                    className={inputClass}
                  />
                </div>

                {/* Cinsiyet */}
                <div>
                  <label className={labelClass}>Cinsiyet</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleFormChange}
                    className={inputClass}
                  >
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                {/* Fiyat */}
                <div>
                  <label className={labelClass}>Fiyat (₺) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleFormChange}
                    placeholder="4250"
                    min="0"
                    className={inputClass}
                  />
                </div>

                {/* Hacim */}
                <div>
                  <label className={labelClass}>Hacim</label>
                  <input
                    type="text"
                    name="volume"
                    value={form.volume}
                    onChange={handleFormChange}
                    placeholder="100ml"
                    className={inputClass}
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className={labelClass}>Kategori</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    placeholder="Eau de Parfum"
                    className={inputClass}
                  />
                </div>

                {/* Açıklama */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>Açıklama</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Ürün açıklaması..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Üst Notalar */}
                <div>
                  <label className={labelClass}>Üst Notalar</label>
                  <input
                    type="text"
                    name="notesUst"
                    value={form.notesUst}
                    onChange={handleFormChange}
                    placeholder="Bergamot, Biber, Limon"
                    className={inputClass}
                  />
                  <p className="mt-1 text-[10px] text-text-muted">Virgülle ayırın</p>
                </div>

                {/* Orta Notalar */}
                <div>
                  <label className={labelClass}>Orta Notalar</label>
                  <input
                    type="text"
                    name="notesOrta"
                    value={form.notesOrta}
                    onChange={handleFormChange}
                    placeholder="Lavanta, Gül, Yasemin"
                    className={inputClass}
                  />
                  <p className="mt-1 text-[10px] text-text-muted">Virgülle ayırın</p>
                </div>

                {/* Alt Notalar */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>Alt Notalar</label>
                  <input
                    type="text"
                    name="notesAlt"
                    value={form.notesAlt}
                    onChange={handleFormChange}
                    placeholder="Amber, Misk, Sandal Ağacı"
                    className={inputClass}
                  />
                  <p className="mt-1 text-[10px] text-text-muted">Virgülle ayırın</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-surface px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-full border border-border px-5 py-2 text-xs tracking-widest text-text-secondary transition-all hover:border-text/20 hover:text-text"
              >
                İPTAL
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-6 py-2 text-xs tracking-widest text-gold transition-all hover:bg-gold/10 disabled:opacity-50"
              >
                {saving && (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border border-gold/30 border-t-gold" />
                )}
                {editingProduct ? "GÜNCELLE" : "KAYDET"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reply Modal ── */}
      {replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-text/40 backdrop-blur-sm" onClick={() => setReplyTarget(null)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-sm font-light tracking-widest text-text">CEVAP YAZ</h2>
                <p className="mt-0.5 text-[11px] text-text-muted">Alıcı: {replyTarget.name} &lt;{replyTarget.email}&gt;</p>
              </div>
              <button
                onClick={() => setReplyTarget(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted hover:text-text"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="mb-4 rounded-lg border border-border bg-surface-warm px-4 py-3">
                <p className="text-[10px] tracking-widest text-text-muted uppercase mb-1">Orijinal Mesaj</p>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{replyTarget.message}</p>
              </div>
              <label className={labelClass}>Cevabınız</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
                placeholder="Cevabınızı buraya yazın..."
                className={`${inputClass} resize-none`}
              />
              <p className="mt-2 text-[10px] text-text-muted">
                Gönder butonuna basıldığında varsayılan e-posta uygulamanız açılacak.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
              <button
                onClick={() => setReplyTarget(null)}
                className="rounded-full border border-border px-5 py-2 text-xs tracking-widest text-text-secondary transition-all hover:text-text"
              >
                İPTAL
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim() || replySending}
                className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-6 py-2 text-xs tracking-widest text-gold transition-all hover:bg-gold/10 disabled:opacity-50"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                GÖNDER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
