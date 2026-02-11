# Next.js Projesi Yayınlama (Deployment) Rehberi

Sitenizi internette yayınlamak, yerel bilgisayarınızda çalışan projeyi herkesin erişebileceği bir sunucuya taşımaktır. Next.js projeleri için temel kavramlar ve Hostinger özelinde yapılması gerekenler aşağıdadır.

## 1. Yayınlama Türleri Nedir?

Next.js projeleri temelde iki şekilde yayınlanabilir. Sizin projenizin özelliklerine göre hangisini seçmeniz gerektiği önemlidir.

### A. Statik Dışa Aktarım (Static Export) - `output: 'export'`
Projenizdeki tüm sayfalar HTML dosyalarına dönüştürülür ve herhangi bir sunucuya (klasik hosting) yüklenebilir.
* Sizin projenizde `src/api` klasörü ve kullanıcı işlemleri olduğu için bu yöntem **sizin için uygun değildir.**
* Sebebi: API sunucusu olmadan çalışmaz.

### B. Node.js Sunucusu (SSR) ✅ (Sizin için uygun)
Projeniz sunucuda canlı olarak çalışır (Tıpkı bilgisayarınızda `npm run dev` dediğinizde çalıştığı gibi).
* **Avantajı:** Tüm Next.js özellikleri (API, Auth, Veritabanı) sorunsuz çalışır.
* **Gereksinimi:** Sunucuda **Node.js** yüklü olmalıdır.

## 2. Hostinger'da Nasıl Yayınlanır?

Hostinger kullanıyorsanız, sahip olduğunuz pakete göre iki yol vardır:

1.  **VPS (Sanal Sunucu):** Size ait boş bir bilgisayar gibidir. En önerilen ve esnek yöntem budur. Node.js kurup kodunuzu çalıştırırsınız.
2.  **Web Hosting (Paylaşımlı):** Panelinizde **"Setup Node.js App"** menüsü varsa buradan da yayınlayabilirsiniz. Ancak bazen kısıtlamalar olabilir.

## Özet: Ne Yapmalıyız?
Sizin projenizin tam performanslı çalışması için **Node.js destekli bir sunucuya (VPS veya Node.js App Hosting)** ihtiyacımız var.
Hostinger panelinize girip **VPS** hizmetiniz mi var yoksa **Web Hosting** mi var kontrol ederseniz, ona göre kurulum adımlarını verebilirim.
