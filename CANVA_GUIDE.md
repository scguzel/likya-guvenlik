# Likya Yolu Güvenlik Sistemi - Canva Pro Web Sitesi Rehberi

Bu rehber, Likya Yolu Güvenlik Sistemi'ni **Canva Pro** kullanarak profesyonel bir web sitesi olarak oluşturmak ve yayınlamak için adım adım talimatlar içerir.

## 📋 Ön Koşullar

1. **Canva Pro Hesabı** - https://canva.com
2. **Likya Yolu Proje Dosyaları** - index.html, app.js, vb.

## 🎨 Adım 1: Canva'da Web Sitesi Şablonu Oluştur

### 1.1 Canva'da Yeni Proje Başlat

1. https://canva.com adresine git
2. "Create a design" tıkla
3. "Website" şablonunu seç
4. "Website" → "Blank website" seç

### 1.2 Web Sitesi Yapısını Oluştur

Canva'da aşağıdaki sayfaları oluştur:

#### Sayfa 1: Ana Sayfa (Hero Section)
- **Başlık:** "Likya Yolu Güvenlik Sistemi"
- **Alt Başlık:** "Yapay Zeka Destekli Güvenlik Analizi ve Rota Optimizasyonu"
- **Görsel:** Likya Yolu'nun güzel bir fotoğrafı
- **CTA Butonu:** "Haritayı Keşfet" → `/harita`

#### Sayfa 2: Harita Sayfası
- **Başlık:** "Etkileşimli Harita"
- **İçerik:** HTML embed kodu (index.html'den)
- **Açıklama:** 32 etap, güvenlik riski analizi

#### Sayfa 3: Özellikler
- **Başlık:** "Sistem Özellikleri"
- **Kartlar:**
  - 🗺️ Etkileşimli Harita
  - 🤖 YZ Tabanlı Risk Analizi
  - 🛣️ Dinamik Rota Optimizasyonu
  - 🌡️ Canlı Hava Durumu
  - 🆘 SOS Sistemi
  - 🌍 Çok Dilli Destek

#### Sayfa 4: Hakkında
- **Başlık:** "Proje Hakkında"
- **İçerik:**
  - Likya Yolu'nun tanıtımı
  - Projenin amacı
  - Teknolojiler
  - Takım bilgisi

#### Sayfa 5: İletişim
- **Başlık:** "İletişim"
- **Form:**
  - Ad
  - Email
  - Mesaj
- **İletişim Bilgileri**

### 1.3 Tasarım Öğeleri Ekle

1. **Renkler:** Likya Yolu teması
   - Ana Renk: Mavi (#2a5298)
   - Vurgu Rengi: Turuncu (#ff6b6b)
   - Arka Plan: Açık gri (#f8f9fa)

2. **Fontlar:**
   - Başlıklar: Bold, 36-48px
   - Gövde: Regular, 16-18px
   - Butonlar: Bold, 14-16px

3. **Görseller:**
   - Likya Yolu fotoğrafları
   - Harita ekran görüntüleri
   - İkonlar

4. **İkonlar:** Canva'nın yerleşik ikon kütüphanesini kullan

---

## 🔗 Adım 2: HTML Kodunu Canva'ya Embed Et

### 2.1 Harita Sayfasında HTML Embed

1. Harita sayfasına git
2. "Add element" → "Embed code" seç
3. Aşağıdaki kodu yapıştır:

```html
<iframe 
  src="https://likya-guvenlik-RANDOM.netlify.app" 
  width="100%" 
  height="600" 
  style="border: none; border-radius: 8px;">
</iframe>
```

### 2.2 Alternatif: Canva Code Bölümü

Canva Pro'da "Code" bölümü var:

1. "Add element" → "Code" seç
2. HTML/CSS/JavaScript yazabilirsin
3. Örnek:

```html
<div style="text-align: center; padding: 20px;">
  <h2>Likya Yolu Haritası</h2>
  <p>Aşağıdaki linke tıkla:</p>
  <a href="https://likya-guvenlik-RANDOM.netlify.app" 
     style="padding: 10px 20px; background: #2a5298; color: white; 
            text-decoration: none; border-radius: 5px;">
    Haritayı Aç
  </a>
</div>
```

---

## 🌐 Adım 3: Canva Web Sitesini Yayınla

### 3.1 Yayınlama Ayarları

1. Sağ üst köşede "Share" → "Publish website" tıkla
2. "Get your link" seç
3. Canva otomatik bir URL oluşturacak: `https://canva.site/likya-guvenlik`

### 3.2 Özel Domain Bağla (İsteğe Bağlı)

1. "Share" → "Publish website" → "Custom domain"
2. Kendi domain'ini bağla (örn: likya-guvenlik.com)
3. DNS ayarlarını takip et

### 3.3 SEO Optimizasyonu

1. "Website settings" → "SEO"
2. **Title:** "Likya Yolu Güvenlik Sistemi - YZ Destekli Rota Optimizasyonu"
3. **Description:** "Likya Yolu'nda yürüyüş yapanlar için yapay zeka destekli güvenlik analizi ve dinamik rota optimizasyonu sistemi."
4. **Keywords:** "likya yolu, güvenlik, rota, harita, yürüyüş, türkiye"

---

## 📱 Adım 4: Mobil Optimizasyonu

### 4.1 Responsive Tasarım

Canva otomatik olarak mobil uyumlu tasarım yapar, ancak kontrol et:

1. "Preview" → "Mobile" seç
2. Tüm öğelerin düzgün göründüğünü kontrol et
3. Butonların tıklanabilir olduğunu doğrula

### 4.2 Mobil Menüsü

1. Canva'da hamburger menüsü otomatik oluşturulur
2. Menü öğelerini düzenle:
   - Ana Sayfa
   - Harita
   - Özellikler
   - Hakkında
   - İletişim

---

## 🎯 Adım 5: Sosyal Medya Entegrasyonu

### 5.1 Sosyal Bağlantılar Ekle

1. Footer'a sosyal medya ikonları ekle
2. Linkler:
   - GitHub: `https://github.com/USERNAME/likya-guvenlik`
   - Twitter: `https://twitter.com/likyaguvenlik`
   - Instagram: `https://instagram.com/likyaguvenlik`

### 5.2 Share Butonları

Canva otomatik olarak share butonları ekler:
- Facebook
- Twitter
- LinkedIn
- Email

---

## 📊 Adım 6: Analytics ve İstatistikler

### 6.1 Canva Analytics

1. "Analytics" sekmesine git
2. İzle:
   - Ziyaretçi sayısı
   - Sayfa görüntülemeleri
   - Tıklanan bağlantılar

### 6.2 Google Analytics (İsteğe Bağlı)

1. Google Analytics hesabı oluştur
2. Tracking ID'sini al
3. Canva'da "Website settings" → "Analytics" → Google Analytics ID'sini yapıştır

---

## 🎨 Adım 7: Tasarım İpuçları

### Renk Şeması
```
Ana Renk: #2a5298 (Mavi)
Vurgu: #ff6b6b (Kırmızı)
Başarı: #51cf66 (Yeşil)
Uyarı: #ffd43b (Sarı)
Arka Plan: #f8f9fa (Açık Gri)
Metin: #333333 (Koyu Gri)
```

### Typography
- **Başlıklar:** Montserrat Bold, 36-48px
- **Alt Başlıklar:** Montserrat SemiBold, 24-32px
- **Gövde:** Open Sans Regular, 16-18px
- **Butonlar:** Montserrat Bold, 14-16px

### Spacing
- Margin: 20px, 40px, 60px
- Padding: 15px, 30px, 45px
- Gap: 20px

---

## 📋 İçerik Şablonları

### Ana Sayfa Metni

```
Likya Yolu Güvenlik Sistemi

Yapay Zeka Destekli Güvenlik Analizi ve Dinamik Rota Optimizasyonu

Likya Yolu'nda yürüyüş yapanların güvenliğini artırmak için geliştirilen 
bu sistem, gerçek zamanlı hava durumu verileri, makine öğrenmesi 
algoritmaları ve GPS konumlandırması kullanarak en güvenli rotayı önerir.

Özellikler:
- 32 etap etkileşimli harita
- %84+ doğruluk oranıyla YZ risk analizi
- Dinamik rota optimizasyonu
- Canlı hava durumu
- SOS acil durum sistemi
```

### Özellikler Metni

```
🗺️ Etkileşimli Harita
540 km'lik Likya Yolu'nun tüm 32 etapını gösteren 
interaktif harita. Güvenlik riski renk kodlaması ile 
her etapın risk seviyesini anlık olarak görebilirsiniz.

🤖 YZ Tabanlı Risk Analizi
Gradient Boosting Machine algoritması kullanarak 
%84+ doğruluk oranıyla güvenlik riski tahmini yapılır. 
Coğrafi, meteorolojik ve sosyal faktörleri dikkate alır.

🛣️ Dinamik Rota Optimizasyonu
A* algoritması ile başlangıç ve bitiş noktaları arasında 
en güvenli rotayı hesaplar. Güvenlik, mesafe ve 
yükseklik değişimini optimize eder.
```

---

## 🚀 Adım 8: Yayınlama ve Promosyon

### 8.1 Son Kontroller

- [ ] Tüm sayfalar yükleniyor mu?
- [ ] Linkler çalışıyor mu?
- [ ] Mobil görünüm düzgün mü?
- [ ] Yazım hataları var mı?
- [ ] Görseller yükleniyor mu?

### 8.2 Yayınla

1. "Publish" tıkla
2. URL'yi kopyala
3. Sosyal medyada paylaş

### 8.3 Promosyon

- Twitter: #LikyaYolu #Güvenlik #YapayZeka
- Instagram: Likya Yolu fotoğrafları
- LinkedIn: Proje detayları
- GitHub: Repository linki

---

## 💡 İpuçları

1. **Canva Pro Özellikleri:**
   - Sınırsız tasarım
   - Özel domain
   - Analytics
   - Brand kit

2. **Performans:**
   - Görselleri optimize et (< 2MB)
   - Lazy loading kullan
   - CDN otomatik

3. **SEO:**
   - Meta açıklamalar ekle
   - Alt text ekle
   - İç linkler kullan
   - Sitemaps otomatik oluşturulur

---

## 📞 Destek

- **Canva Help:** https://support.canva.com
- **Canva Tutorials:** https://www.canva.com/learn

---

**Son Güncelleme:** 18 Aralık 2025
**Versiyon:** 1.0.0
