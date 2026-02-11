# Next.js Nedir ve API'ler Neden Çalışmaz?

Next.js'in çalışma mantığını ve yayınlama türleri arasındaki farkı anlamak, gelecekte projenizi geliştirirken çok işinize yarayacaktır.

## 1. İki Farklı Dünya: Statik vs Dinamik

Next.js projeleri temelde iki farklı şekilde dışarı aktarılabilir:

### A. Statik Site (Static Export - Sizin Şu Anki Durumunuz) 📄
Bu yöntemde, Next.js projenizdeki tüm sayfaları **önceden** (build sırasında) HTML dosyalarına dönüştürür.
*   **Nasıl Çalışır:** Tıpkı bir Word belgesini PDF'e çevirmek gibidir. PDF olduktan sonra içindeki yazılar değişmez.
*   **Ne Olur:** Çıktı olarak sadece `index.html`, `urun.html`, `css` ve `resimler` oluşur.
*   **API Sorunu:** `src/app/api/...` klasöründe yazdığınız kodlar **sunucu kodu (backend)** olduğu için HTML'e dönüştürülemez. Bu yüzden `npm run build` dediğinizde **API dosyaları silinir ve oluşturulmaz.**
*   **Sonuç:** Sitenizde bir butona basıp `/api/login` adresine istek atarsanız, **404 Hatası** alırsınız çünkü öyle bir dosya yoktur.

### B. Node.js Sunucusu (SSR / Server Side Rendering) 🖥️
Bu yöntemde, projeniz bir web sunucusu (Node.js) üzerinde **canlı** çalışır.
*   **Nasıl Çalışır:** Her kullanıcı siteye girdiğinde sayfa o an oluşturulur.
*   **Ne Olur:** Sunucuda sürekli çalışan bir program vardır.
*   **API Gücü:** `src/app/api/...` klasöründeki kodlar sunucuda çalışmaya devam eder. Veritabanına bağlanabilir, şifre kontrolü yapabilir.
*   **Gereksinim:** Bunu çalıştırmak için **VPS** veya Node.js destekli özel hosting gerekir.

## Sizin Projenizdeki Durum
Başlangıçta projenizde "Kullanıcı Girişi (Auth)" ve "Veritabanı" işlemleri olduğu için API kullanıyorduk. Bu yüzden **Statik Export** yapamazdık, VPS kiralayıp sunucu kurmamız gerekirdi.

Ancak siz "Auth özelliklerini kaldırdım" dediğinizde işler değişti:
1.  Artık sunucuda çalışması gereken gizli bir işlem kalmadı.
2.  Tüm ürünleriniz, yazılarınız zaten belli.
3.  Bu yüzden projenizi **Statik (HTML)** olarak derleyip Hostinger'ın en ucuz paketine bile atabildik.

**Özet:**
*   **Statik:** Sadece görüntü, etkileşim (Carousel, menü vb.) çalışır. Arkada veritabanı işlemi yapamaz. (Şu anki haliniz ✅)
*   **Sunucu:** Giriş yapma, sepete ekleme, veritabanına kaydetme gibi işlemler çalışır. (İleride gerekirse geçilir 🚀)
