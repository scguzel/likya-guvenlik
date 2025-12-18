# Likya Yolu Güvenlik Sistemi - Dağıtım Rehberi

Bu rehber, Likya Yolu Güvenlik Sistemi'ni **Netlify** (Frontend) ve **Render** (Backend) üzerinde yayınlamak için adım adım talimatlar içerir.

## 📋 Ön Koşullar

1. **GitHub Hesabı** - https://github.com
2. **Netlify Hesabı** - https://netlify.com (ücretsiz)
3. **Render Hesabı** - https://render.com (ücretsiz)
4. **Git Kurulu** - Bilgisayarınızda

## 🚀 Adım 1: GitHub Repository Oluşturma

### 1.1 GitHub'da Yeni Repository Oluştur

1. https://github.com/new adresine git
2. Repository adı: `likya-guvenlik`
3. Açıklama: "Likya Yolu Güvenlik ve Rota Optimizasyonu Sistemi"
4. Visibility: **Public** (ücretsiz dağıtım için)
5. "Create repository" tıkla

### 1.2 Yerel Repository'yi GitHub'a Push Et

```bash
cd /home/ubuntu/likya-guvenlik

# Remote ekle (USERNAME ve REPO adını değiştir)
git remote add origin https://github.com/USERNAME/likya-guvenlik.git

# Branch adını değiştir (GitHub'ın yeni standardı)
git branch -M main

# Push et
git push -u origin main
```

**Sonuç:** Kodun GitHub'da olması gerekir.

---

## 🌐 Adım 2: Frontend'i Netlify'de Yayınla

### 2.1 Netlify'e Bağlan

1. https://netlify.com adresine git
2. "Sign up" tıkla
3. "Sign up with GitHub" seç
4. GitHub yetkilendirmesini onayla

### 2.2 Yeni Site Oluştur

1. Netlify Dashboard'da "Add new site" → "Import an existing project"
2. GitHub'ı seç
3. `likya-guvenlik` repository'sini seç
4. Build ayarlarını yapılandır:
   - **Build command:** (boş bırak)
   - **Publish directory:** `.` (kök dizin)
5. "Deploy site" tıkla

### 2.3 Otomatik Dağıtım Ayarla

- Netlify otomatik olarak her GitHub push'unda yeniden dağıtacaktır
- Dağıtım durumunu Netlify Dashboard'dan izleyebilirsiniz

**Sonuç:** Frontend şu adreste yayında: `https://likya-guvenlik-RANDOM.netlify.app`

---

## 🔧 Adım 3: Backend'i Render'da Yayınla

### 3.1 Render'a Bağlan

1. https://render.com adresine git
2. "Sign up" tıkla
3. "Sign up with GitHub" seç
4. GitHub yetkilendirmesini onayla

### 3.2 Yeni Web Service Oluştur

1. Render Dashboard'da "New +" → "Web Service"
2. GitHub repository'sini seç (`likya-guvenlik`)
3. Ayarları yapılandır:
   - **Name:** `likya-guvenlik-api`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python backend.py`
   - **Plan:** `Free`
4. "Create Web Service" tıkla

### 3.3 Environment Variables Ekle (İsteğe Bağlı)

1. Settings → Environment
2. Aşağıdaki değişkenleri ekle:
   ```
   FLASK_ENV = production
   FLASK_DEBUG = 0
   ```

**Sonuç:** Backend şu adreste yayında: `https://likya-guvenlik-api.onrender.com`

---

## 🔗 Adım 4: Frontend ve Backend'i Bağla

### 4.1 Frontend'de API URL'sini Güncelle

`app.js` dosyasında, API çağrılarını güncelle:

```javascript
// Eski
const API_URL = 'http://localhost:5000';

// Yeni
const API_URL = 'https://likya-guvenlik-api.onrender.com';
```

### 4.2 Değişiklikleri Commit ve Push Et

```bash
cd /home/ubuntu/likya-guvenlik

git add app.js
git commit -m "Update API URL for production"
git push origin main
```

Netlify otomatik olarak yeniden dağıtacaktır.

---

## ✅ Adım 5: Test Et

### 5.1 Frontend Test

1. Netlify sitesine git: `https://likya-guvenlik-RANDOM.netlify.app`
2. Haritanın yüklenmesini kontrol et
3. GPS butonunu test et
4. Hava durumu panelini kontrol et

### 5.2 Backend Test

```bash
# Terminal'de
curl https://likya-guvenlik-api.onrender.com/api/health

# Sonuç:
# {"status":"OK","timestamp":"...","version":"1.0.0"}
```

### 5.3 API Entegrasyonu Test

Frontend'de:
1. "Hava" sekmesine git
2. Hava durumu verilerinin yüklendiğini kontrol et
3. Etapları tıkla ve risk skorlarını gör

---

## 🎯 Özel Domainler (İsteğe Bağlı)

### Netlify'de Özel Domain

1. Netlify Dashboard → Site settings → Domain management
2. "Add custom domain" tıkla
3. Örnek: `likya-guvenlik.com`
4. DNS ayarlarını takip et

### Render'da Özel Domain

1. Render Dashboard → Web Service → Settings
2. "Custom Domains" bölümüne domain ekle
3. DNS ayarlarını takip et

---

## 🔄 Güncelleme Süreci

Kod güncellemesi yapmak için:

```bash
# Değişiklikleri yap
# ...

# Commit ve push
git add .
git commit -m "Açıklama"
git push origin main

# Netlify ve Render otomatik olarak yeniden dağıtacaktır
```

---

## 🚨 Sorun Giderme

### Netlify'de 404 Hatası

**Sorun:** Sayfa yenilendikten sonra 404 hatası
**Çözüm:** `netlify.toml` dosyasında redirect kuralı var, kontrol et

### Render'da 502 Bad Gateway

**Sorun:** Backend yanıt vermiyor
**Çözüm:** 
1. Render Dashboard'da logs kontrol et
2. `python backend.py` komutunun çalıştığını doğrula
3. `requirements.txt` dosyasının güncel olduğunu kontrol et

### CORS Hatası

**Sorun:** Frontend, Backend'den veri alamıyor
**Çözüm:**
1. `backend.py`'de CORS etkinleştirilmiş
2. API URL'nin doğru olduğunu kontrol et
3. Tarayıcı konsolunda hata mesajını kontrol et

---

## 📊 Dağıtım Durumu İzleme

### Netlify
- Dashboard → Deploys sekmesi
- Gerçek zamanlı build logları
- Dağıtım geçmişi

### Render
- Dashboard → Web Service
- Logs sekmesi
- Metrics sekmesi (CPU, RAM, vb.)

---

## 💡 İpuçları

1. **Ücretsiz Plan Sınırlamaları:**
   - Netlify: Sınırsız statik site
   - Render: 15 dakika inaktiviteden sonra uyku modu

2. **Performans Optimizasyonu:**
   - Frontend: Statik dosyalar Netlify CDN'de hızlı yüklenir
   - Backend: Render'da Python uygulaması çalışır

3. **Güvenlik:**
   - HTTPS otomatik olarak etkinleştirilir
   - API CORS korumalı

---

## 📞 Destek

- **Netlify Docs:** https://docs.netlify.com
- **Render Docs:** https://render.com/docs
- **GitHub Docs:** https://docs.github.com

---

**Son Güncelleme:** 18 Aralık 2025
**Versiyon:** 1.0.0
