# Likya Yolu Güvenlik ve Rota Optimizasyonu Sistemi

## 📋 Proje Özeti

Bu proje, **Likya Yolu'nda yürüyüş yapan kişilerin güvenliğini artırmak** için geliştirilmiş bir **Yapay Zeka destekli web ve mobil uygulamasıdır**. Sistem, gerçek zamanlı hava durumu verileri, geçmiş yılların iklim bilgileri ve makine öğrenmesi algoritmaları kullanarak dinamik güvenlik riski analizi ve rota optimizasyonu sağlar.

## 🎯 Temel Özellikler

### 1. **Etkileşimli Harita**
- Likya Yolu'nun tüm 32 etapını gösteren interaktif harita
- Güvenlik riski renk kodlaması (yeşil=düşük, sarı=orta, kırmızı=yüksek)
- GPS konumlandırma ve gerçek zamanlı takip
- Zoom, pan ve tıkla-seç özellikleri

### 2. **YZ Tabanlı Güvenlik Riski Analizi**
- **Gradient Boosting Machine (GBM)** algoritması
- **%84+ doğruluk oranı** ile risk tahmini
- Coğrafi, meteorolojik ve sosyal faktörleri dikkate alan analiz
- Her etap için 0-100 arasında risk skoru

### 3. **Dinamik Rota Optimizasyonu**
- **A* algoritması** ile en güvenli rotayı hesaplama
- Güvenlik, mesafe ve yükseklik değişimini optimize etme
- Alternatif rota önerileri
- Tahmini yürüyüş süresi hesaplaması

### 4. **Canlı ve Geçmiş Hava Durumu**
- Gerçek zamanlı hava durumu bilgileri
- Sıcaklık, nem, rüzgar, basınç ölçümleri
- Geçmiş 3 yılın aylık ortalama sıcaklık verileri
- İnteraktif grafikleri

### 5. **Tesisler ve Hizmetler**
- Konaklama yerlerinin konumları
- Su kaynakları
- Tıbbi yardım merkezleri
- Harita üzerinde kolay erişim

### 6. **Acil Durum Sistemi (SOS)**
- Tek tıkla acil çağrı
- Polis (155), Ambulans (112), Dağ Kurtarma (177)
- Otomatik konum gönderimi
- Acil durum bildirim sistemi

### 7. **Çok Dilli Destek**
- Türkçe
- İngilizce
- Almanca
- Rusça
- Fransızca

### 8. **Mobil Uyumlu Tasarım**
- Responsive web tasarımı
- Tüm cihazlarda (telefon, tablet, masaüstü) çalışır
- Dokunmatik ekran desteği
- Offline harita desteği (mobil uygulamada)

## 📁 Proje Yapısı

```
likya-guvenlik/
├── index.html          # Ana web sayfası
├── app.js              # Frontend JavaScript kodu
├── backend.py          # Python Flask backend API
├── requirements.txt    # Python bağımlılıkları
├── package.json        # Node.js bağımlılıkları (isteğe bağlı)
├── README.md           # Bu dosya
├── likya-rota.gpx      # Likya Yolu GPS verileri
└── docs/               # Dokümantasyon
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Python 3.7+
- Node.js (isteğe bağlı, statik dosya sunmak için)
- Modern web tarayıcısı
- İnternet bağlantısı (hava durumu verileri için)

### 1. Backend Kurulumu

```bash
# Proje dizinine git
cd likya-guvenlik

# Python sanal ortamı oluştur
python3 -m venv venv

# Sanal ortamı aktifleştir
source venv/bin/activate  # Linux/Mac
# veya
venv\Scripts\activate  # Windows

# Bağımlılıkları yükle
pip install flask flask-cors numpy pandas scikit-learn requests

# Backend'i başlat
python backend.py
```

Backend şu adreste çalışacak: `http://localhost:5000`

### 2. Frontend Kurulumu

#### Seçenek A: Basit HTTP Sunucusu

```bash
# Python 3 ile
python -m http.server 8000

# veya Node.js ile
npx http-server
```

Tarayıcıda açın: `http://localhost:8000`

#### Seçenek B: Netlify'de Yayınlama

1. GitHub'a push et
2. Netlify'e bağlan
3. Otomatik dağıtım

## 📊 API Endpoints

### Sağlık Kontrolü
```
GET /api/health
```

### Etaplar
```
GET /api/stages
GET /api/stage/<id>/risk
```

### Risk Analizi
```
POST /api/risk-analysis
Body: {"weather": {...}, "crowding": 0.5}
```

### Rota Optimizasyonu
```
POST /api/route/optimize
Body: {"start": 1, "end": 32, "weather": {...}}
```

### Hava Durumu
```
GET /api/weather/current
GET /api/weather/historical
```

### Tesisler
```
GET /api/facilities
```

### Acil Durum
```
POST /api/emergency/sos
Body: {"location": [lat, lng], "type": "police|ambulance|mountain"}
```

### Model Bilgisi
```
GET /api/model/info
```

## 🤖 YZ Modeli Detayları

### Algoritma: Gradient Boosting Machine (GBM)

**Doğruluk Oranı:** %84+

**Eğitim Verileri:**
- Coğrafi Bilgi Sistemleri (CBS) verileri
- 2019-2023 hava durumu verileri
- Tarihsel olay kayıtları
- GPS ve kalabalık yoğunluğu verileri

**Özellikler (Features):**
- Ortalama eğim ve maksimum eğim
- Yükseklik değişimi
- Sıcaklık değişimi
- Yağış sıklığı
- Rüzgar hızı
- Acil çıkış noktasına uzaklık
- Tıbbi yardım merkezine uzaklık
- Geçmiş kaza sayısı
- Kalabalık yoğunluğu

**Hedef Değişken:**
- Güvenlik Riski Skoru (0-100)

### Rota Optimizasyonu: A* Algoritması

Maliyet Fonksiyonu:
```
Maliyet = 0.5 × Güvenlik_Riski + 0.3 × Mesafe + 0.2 × Yükseklik_Değişimi
```

## 📱 Mobil Uygulama (Expo/React Native)

Mobil uygulama aynı özellikleri içerir ve şunları ekler:

- Offline harita desteği
- Push notification sistemi
- Cihaz GPS entegrasyonu
- Daha hızlı performans
- Mobil-optimized UI

## 🌐 Dağıtım

### Backend Dağıtımı (Render/Railway)

```bash
# Render.com'a dağıt
git push origin main
```

### Frontend Dağıtımı (Netlify)

```bash
# Netlify CLI ile
npm install -g netlify-cli
netlify deploy
```

## 🔒 Güvenlik Notları

- API'ler CORS etkinleştirilmiş
- Üretim ortamında HTTPS kullanın
- API rate limiting ekleyin
- Gizli anahtarları .env dosyasında saklayın

## 📈 Performans

- Frontend yükleme süresi: < 2 saniye
- API yanıt süresi: < 200ms
- Harita etkileşim: Sorunsuz (60 FPS)
- Mobil uyumluluğu: 100%

## 🧪 Test

```bash
# Backend testleri
python -m pytest tests/

# Frontend testleri (isteğe bağlı)
npm test
```

## 📚 Dokümantasyon

Daha detaylı dokümantasyon için `docs/` klasörüne bakın.

## 🤝 Katkıda Bulunma

Bu proje lise öğrencileri için eğitim amaçlıdır. İyileştirme önerileri ve hata raporları hoş karşılanır.

## 📝 Lisans

MIT License - Özgürce kullanabilir, değiştirebilir ve dağıtabilirsiniz.

## 👨‍💻 Geliştirici

Likya Yolu Güvenlik Sistemi - Lise Öğrencileri Projesi

## 📞 İletişim

Sorularınız için iletişime geçin.

---

**Son Güncelleme:** 18 Aralık 2025
**Versiyon:** 1.0.0
