// app.js - Likya Yolu Güvenli Adımlar
'use strict';

// ============================================================================
// GLOBAL STATE
// ============================================================================

const State = {
    map: null,
    gpsActive: false,
    gpsWatchId: null,
    userMarker: null,
    currentLayer: 'street',
    layers: { street: null, satellite: null },
    weather: null,
    selectedSection: null
};

// ============================================================================
// VERİ YAPILARI - 32 ETAP
// ============================================================================

const ALL_STAGES = [
    { id: 1, name: 'Fethiye - Ölüdeniz', distance: 15, difficulty: 'Kolay', risk: 'low', slipRisk: 20, dehydrationRisk: 30 },
    { id: 2, name: 'Ölüdeniz - Kabak', distance: 18, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 40 },
    { id: 3, name: 'Kabak - Faralya', distance: 14, difficulty: 'Zor', risk: 'high', slipRisk: 70, dehydrationRisk: 60 },
    { id: 4, name: 'Faralya - Geyikbayırı', distance: 16, difficulty: 'Orta', risk: 'medium', slipRisk: 50, dehydrationRisk: 45 },
    { id: 5, name: 'Geyikbayırı - Alınca', distance: 17, difficulty: 'Orta', risk: 'low', slipRisk: 30, dehydrationRisk: 35 },
    { id: 6, name: 'Alınca - Çıralı', distance: 19, difficulty: 'Orta', risk: 'medium', slipRisk: 40, dehydrationRisk: 50 },
    { id: 7, name: 'Çıralı - Antalya', distance: 20, difficulty: 'Kolay', risk: 'low', slipRisk: 25, dehydrationRisk: 30 },
    { id: 8, name: 'Antalya - Kemer', distance: 22, difficulty: 'Kolay', risk: 'low', slipRisk: 20, dehydrationRisk: 35 },
    { id: 9, name: 'Kemer - Beldibi', distance: 18, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 40 },
    { id: 10, name: 'Beldibi - Göynük', distance: 16, difficulty: 'Orta', risk: 'medium', slipRisk: 50, dehydrationRisk: 45 },
    { id: 11, name: 'Göynük - Tekirova', distance: 17, difficulty: 'Zor', risk: 'high', slipRisk: 65, dehydrationRisk: 55 },
    { id: 12, name: 'Tekirova - Phaselis', distance: 14, difficulty: 'Orta', risk: 'medium', slipRisk: 40, dehydrationRisk: 40 },
    { id: 13, name: 'Phaselis - Çamyuva', distance: 15, difficulty: 'Kolay', risk: 'low', slipRisk: 25, dehydrationRisk: 30 },
    { id: 14, name: 'Çamyuva - Kumluca', distance: 19, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 50 },
    { id: 15, name: 'Kumluca - Adrasan', distance: 17, difficulty: 'Orta', risk: 'medium', slipRisk: 40, dehydrationRisk: 45 },
    { id: 16, name: 'Adrasan - Olympos', distance: 16, difficulty: 'Zor', risk: 'high', slipRisk: 70, dehydrationRisk: 60 },
    { id: 17, name: 'Olympos - Çıralı', distance: 18, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 50 },
    { id: 18, name: 'Çıralı - Ulupınar', distance: 15, difficulty: 'Kolay', risk: 'low', slipRisk: 30, dehydrationRisk: 35 },
    { id: 19, name: 'Ulupınar - Kaş', distance: 20, difficulty: 'Orta', risk: 'medium', slipRisk: 50, dehydrationRisk: 55 },
    { id: 20, name: 'Kaş - Kalkan', distance: 17, difficulty: 'Orta', risk: 'medium', slipRisk: 40, dehydrationRisk: 45 },
    { id: 21, name: 'Kalkan - Patara', distance: 18, difficulty: 'Kolay', risk: 'low', slipRisk: 25, dehydrationRisk: 40 },
    { id: 22, name: 'Patara - Xanthos', distance: 16, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 50 },
    { id: 23, name: 'Xanthos - Letoon', distance: 14, difficulty: 'Kolay', risk: 'low', slipRisk: 20, dehydrationRisk: 30 },
    { id: 24, name: 'Letoon - Tlos', distance: 19, difficulty: 'Orta', risk: 'medium', slipRisk: 50, dehydrationRisk: 45 },
    { id: 25, name: 'Tlos - Saklıkent', distance: 17, difficulty: 'Zor', risk: 'high', slipRisk: 75, dehydrationRisk: 65 },
    { id: 26, name: 'Saklıkent - Ölüdeniz', distance: 18, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 50 },
    { id: 27, name: 'Ölüdeniz - Butterfly Valley', distance: 15, difficulty: 'Kolay', risk: 'low', slipRisk: 30, dehydrationRisk: 35 },
    { id: 28, name: 'Butterfly Valley - Gemile', distance: 16, difficulty: 'Orta', risk: 'medium', slipRisk: 40, dehydrationRisk: 45 },
    { id: 29, name: 'Gemile - Sarsala', distance: 17, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 50 },
    { id: 30, name: 'Sarsala - Akkaya', distance: 19, difficulty: 'Zor', risk: 'high', slipRisk: 70, dehydrationRisk: 60 },
    { id: 31, name: 'Akkaya - Sidyma', distance: 18, difficulty: 'Orta', risk: 'medium', slipRisk: 50, dehydrationRisk: 45 },
    { id: 32, name: 'Sidyma - Antalya', distance: 16, difficulty: 'Kolay', risk: 'low', slipRisk: 25, dehydrationRisk: 30 }
];

// ============================================================================
// GPX BÖLÜMLERİ - GitHub raw URL'lerinizi buraya ekleyin!
// ============================================================================

const GPX_SECTIONS = [
    {
        id: 1,
        name: 'Bölüm 1: Ovacık - Kaş',
        file: 'https://raw.githubusercontent.com/scguzel/likya-guvenlik/main/bolum1.gpx',
        distance: 140,
        color: '#dc2626',
        difficulty: 'Orta',
        waterSources: 8,
        elevation: { gain: 2800, loss: 2600 },
        warning: '✅ Popüler rota, su kaynağı bol ama dik çıkışlar mevcut.',
        elevationData: [439, 554, 771, 766, 730, 612, 300, 150, 76]
    },
    {
        id: 2,
        name: 'Bölüm 2: Kaş - Adrasan',
        file: 'https://raw.githubusercontent.com/scguzel/likya-guvenlik/main/bolum2.gpx',
        distance: 170,
        color: '#2563eb',
        difficulty: 'Zor',
        waterSources: 3,
        elevation: { gain: 3200, loss: 3400 },
        warning: '⚠️ DİKKAT: Su kaynağı EN KISITLI ve RİSKLİ etap. Hazırlıklı olun!',
        elevationData: [10, 100, 300, 558, 850, 1200, 800, 400, 240]
    },
    {
        id: 3,
        name: 'Bölüm 3: Adrasan - Hisarçandır',
        file: 'https://raw.githubusercontent.com/scguzel/likya-guvenlik/main/bolum3.gpx',
        distance: 218,
        color: '#16a34a',
        difficulty: 'Orta-Zor',
        waterSources: 5,
        elevation: { gain: 4100, loss: 3900 },
        warning: '🏔️ Yüksek irtifa geçişi ve ormanlık alan. Hava durumuna dikkat!',
        elevationData: [240, 460, 680, 1020, 1250, 1800, 1400, 1100, 873]
    }
];

// ============================================================================
// SU KAYNAKLARI VE HASTANELER
// ============================================================================

const WATER_SOURCES = [
    { name: 'Kabak Su Kaynağı', coords: [36.5667, 29.0833], stage: 1 },
    { name: 'Faralya Çeşme', coords: [36.5200, 29.0600], stage: 1 },
    { name: 'Alınca Su', coords: [36.4482, 29.1422], stage: 1 },
    { name: 'Bel Köyü Çeşme', coords: [36.3826, 29.1707], stage: 1 },
    { name: 'Patara Su', coords: [36.2809, 29.4083], stage: 1 },
    { name: 'Bezirgan Su', coords: [36.2757, 29.4622], stage: 1 },
    { name: 'Gökçeören Çeşme', coords: [36.2393, 29.5447], stage: 1 },
    { name: 'Kaş Su Kaynağı', coords: [36.2037, 29.6409], stage: 1 },
    { name: 'Üçağız Su', coords: [36.1592, 29.7870], stage: 2 },
    { name: 'Demre Çeşme', coords: [36.2444, 29.9850], stage: 2 },
    { name: 'Finike Su', coords: [36.2970, 30.1460], stage: 2 },
    { name: 'Adrasan Kaynak', coords: [36.3022, 30.4659], stage: 2 },
    { name: 'Beycik Su', coords: [36.5000, 30.4245], stage: 3 },
    { name: 'Ulupınar Çeşme', coords: [36.4547, 30.4317], stage: 3 },
    { name: 'Gedelme Su', coords: [36.6140, 30.4470], stage: 3 },
    { name: 'Göynük Çeşme', coords: [36.6813, 30.5510], stage: 3 },
    { name: 'Sarıçınar Kaynak', coords: [36.7091, 30.5198], stage: 3 }
];

const HOSPITALS = [
    { name: 'Fethiye Devlet Hastanesi', coords: [36.6526, 29.1198], phone: '112', distance: 'Başlangıç' },
    { name: 'Kaş Devlet Hastanesi', coords: [36.1992, 29.6362
// app.js - Likya Yolu Güvenli Adımlar
'use strict';

// ============================================================================
// GLOBAL STATE
// ============================================================================

const State = {
    map: null,
    gpsActive: false,
    gpsWatchId: null,
    userMarker: null,
    currentLayer: 'street',
    layers: { street: null, satellite: null },
    weather: null,
    selectedSection: null
};

// ============================================================================
// VERİ YAPILARI - 32 ETAP
// ============================================================================

const ALL_STAGES = [
    { id: 1, name: 'Fethiye - Ölüdeniz', distance: 15, difficulty: 'Kolay', risk: 'low', slipRisk: 20, dehydrationRisk: 30 },
    { id: 2, name: 'Ölüdeniz - Kabak', distance: 18, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 40 },
    { id: 3, name: 'Kabak - Faralya', distance: 14, difficulty: 'Zor', risk: 'high', slipRisk: 70, dehydrationRisk: 60 },
    { id: 4, name: 'Faralya - Geyikbayırı', distance: 16, difficulty: 'Orta', risk: 'medium', slipRisk: 50, dehydrationRisk: 45 },
    { id: 5, name: 'Geyikbayırı - Alınca', distance: 17, difficulty: 'Orta', risk: 'low', slipRisk: 30, dehydrationRisk: 35 },
    { id: 6, name: 'Alınca - Çıralı', distance: 19, difficulty: 'Orta', risk: 'medium', slipRisk: 40, dehydrationRisk: 50 },
    { id: 7, name: 'Çıralı - Antalya', distance: 20, difficulty: 'Kolay', risk: 'low', slipRisk: 25, dehydrationRisk: 30 },
    { id: 8, name: 'Antalya - Kemer', distance: 22, difficulty: 'Kolay', risk: 'low', slipRisk: 20, dehydrationRisk: 35 },
    { id: 9, name: 'Kemer - Beldibi', distance: 18, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 40 },
    { id: 10, name: 'Beldibi - Göynük', distance: 16, difficulty: 'Orta', risk: 'medium', slipRisk: 50, dehydrationRisk: 45 },
    { id: 11, name: 'Göynük - Tekirova', distance: 17, difficulty: 'Zor', risk: 'high', slipRisk: 65, dehydrationRisk: 55 },
    { id: 12, name: 'Tekirova - Phaselis', distance: 14, difficulty: 'Orta', risk: 'medium', slipRisk: 40, dehydrationRisk: 40 },
    { id: 13, name: 'Phaselis - Çamyuva', distance: 15, difficulty: 'Kolay', risk: 'low', slipRisk: 25, dehydrationRisk: 30 },
    { id: 14, name: 'Çamyuva - Kumluca', distance: 19, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 50 },
    { id: 15, name: 'Kumluca - Adrasan', distance: 17, difficulty: 'Orta', risk: 'medium', slipRisk: 40, dehydrationRisk: 45 },
    { id: 16, name: 'Adrasan - Olympos', distance: 16, difficulty: 'Zor', risk: 'high', slipRisk: 70, dehydrationRisk: 60 },
    { id: 17, name: 'Olympos - Çıralı', distance: 18, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 50 },
    { id: 18, name: 'Çıralı - Ulupınar', distance: 15, difficulty: 'Kolay', risk: 'low', slipRisk: 30, dehydrationRisk: 35 },
    { id: 19, name: 'Ulupınar - Kaş', distance: 20, difficulty: 'Orta', risk: 'medium', slipRisk: 50, dehydrationRisk: 55 },
    { id: 20, name: 'Kaş - Kalkan', distance: 17, difficulty: 'Orta', risk: 'medium', slipRisk: 40, dehydrationRisk: 45 },
    { id: 21, name: 'Kalkan - Patara', distance: 18, difficulty: 'Kolay', risk: 'low', slipRisk: 25, dehydrationRisk: 40 },
    { id: 22, name: 'Patara - Xanthos', distance: 16, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 50 },
    { id: 23, name: 'Xanthos - Letoon', distance: 14, difficulty: 'Kolay', risk: 'low', slipRisk: 20, dehydrationRisk: 30 },
    { id: 24, name: 'Letoon - Tlos', distance: 19, difficulty: 'Orta', risk: 'medium', slipRisk: 50, dehydrationRisk: 45 },
    { id: 25, name: 'Tlos - Saklıkent', distance: 17, difficulty: 'Zor', risk: 'high', slipRisk: 75, dehydrationRisk: 65 },
    { id: 26, name: 'Saklıkent - Ölüdeniz', distance: 18, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 50 },
    { id: 27, name: 'Ölüdeniz - Butterfly Valley', distance: 15, difficulty: 'Kolay', risk: 'low', slipRisk: 30, dehydrationRisk: 35 },
    { id: 28, name: 'Butterfly Valley - Gemile', distance: 16, difficulty: 'Orta', risk: 'medium', slipRisk: 40, dehydrationRisk: 45 },
    { id: 29, name: 'Gemile - Sarsala', distance: 17, difficulty: 'Orta', risk: 'medium', slipRisk: 45, dehydrationRisk: 50 },
    { id: 30, name: 'Sarsala - Akkaya', distance: 19, difficulty: 'Zor', risk: 'high', slipRisk: 70, dehydrationRisk: 60 },
    { id: 31, name: 'Akkaya - Sidyma', distance: 18, difficulty: 'Orta', risk: 'medium', slipRisk: 50, dehydrationRisk: 45 },
    { id: 32, name: 'Sidyma - Antalya', distance: 16, difficulty: 'Kolay', risk: 'low', slipRisk: 25, dehydrationRisk: 30 }
];

// ============================================================================
// GPX BÖLÜMLERİ - GitHub raw URL'lerinizi buraya ekleyin!
// ============================================================================

const GPX_SECTIONS = [
    {
        id: 1,
        name: 'Bölüm 1: Ovacık - Kaş',
        file: 'https://raw.githubusercontent.com/scguzel/likya-guvenlik/main/bolum1.gpx',
        distance: 140,
        color: '#dc2626',
        difficulty: 'Orta',
        waterSources: 8,
        elevation: { gain: 2800, loss: 2600 },
        warning: '✅ Popüler rota, su kaynağı bol ama dik çıkışlar mevcut.',
        elevationData: [439, 554, 771, 766, 730, 612, 300, 150, 76]
    },
    {
        id: 2,
        name: 'Bölüm 2: Kaş - Adrasan',
        file: 'https://raw.githubusercontent.com/scguzel/likya-guvenlik/main/bolum2.gpx',
        distance: 170,
        color: '#2563eb',
        difficulty: 'Zor',
        waterSources: 3,
        elevation: { gain: 3200, loss: 3400 },
        warning: '⚠️ DİKKAT: Su kaynağı EN KISITLI ve RİSKLİ etap. Hazırlıklı olun!',
        elevationData: [10, 100, 300, 558, 850, 1200, 800, 400, 240]
    },
    {
        id: 3,
        name: 'Bölüm 3: Adrasan - Hisarçandır',
        file: 'https://raw.githubusercontent.com/scguzel/likya-guvenlik/main/bolum3.gpx',
        distance: 218,
        color: '#16a34a',
        difficulty: 'Orta-Zor',
        waterSources: 5,
        elevation: { gain: 4100, loss: 3900 },
        warning: '🏔️ Yüksek irtifa geçişi ve ormanlık alan. Hava durumuna dikkat!',
        elevationData: [240, 460, 680, 1020, 1250, 1800, 1400, 1100, 873]
    }
];

// ============================================================================
// SU KAYNAKLARI VE HASTANELER
// ============================================================================

const WATER_SOURCES = [
    { name: 'Kabak Su Kaynağı', coords: [36.5667, 29.0833], stage: 1 },
    { name: 'Faralya Çeşme', coords: [36.5200, 29.0600], stage: 1 },
    { name: 'Alınca Su', coords: [36.4482, 29.1422], stage: 1 },
    { name: 'Bel Köyü Çeşme', coords: [36.3826, 29.1707], stage: 1 },
    { name: 'Patara Su', coords: [36.2809, 29.4083], stage: 1 },
    { name: 'Bezirgan Su', coords: [36.2757, 29.4622], stage: 1 },
    { name: 'Gökçeören Çeşme', coords: [36.2393, 29.5447], stage: 1 },
    { name: 'Kaş Su Kaynağı', coords: [36.2037, 29.6409], stage: 1 },
    { name: 'Üçağız Su', coords: [36.1592, 29.7870], stage: 2 },
    { name: 'Demre Çeşme', coords: [36.2444, 29.9850], stage: 2 },
    { name: 'Finike Su', coords: [36.2970, 30.1460], stage: 2 },
    { name: 'Adrasan Kaynak', coords: [36.3022, 30.4659], stage: 2 },
    { name: 'Beycik Su', coords: [36.5000, 30.4245], stage: 3 },
    { name: 'Ulupınar Çeşme', coords: [36.4547, 30.4317], stage: 3 },
    { name: 'Gedelme Su', coords: [36.6140, 30.4470], stage: 3 },
    { name: 'Göynük Çeşme', coords: [36.6813, 30.5510], stage: 3 },
    { name: 'Sarıçınar Kaynak', coords: [36.7091, 30.5198], stage: 3 }
];

const HOSPITALS = [
    { name: 'Fethiye Devlet Hastanesi', coords: [36.6526, 29.1198], phone: '112', distance: 'Başlangıç' },
    { name: 'Kaş Devlet Hastanesi', coords: [36.1992, 29.6362], phone: '112', distance: '~200 km' },
    { name: 'Antalya Eğitim Hastanesi', coords: [36.8969, 30.7133], phone: '112', distance: 'Bitiş' }
];

const WEATHER_API_KEY = '007b67b6185ac73e3b2226ae39d527df';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getRiskColor(risk) {
    return risk === 'low' ? '#22c55e' : risk === 'high' ? '#dc2626' : '#f59e0b';
}

function getRiskText(risk) {
    return risk === 'low' ? 'Düşük' : risk === 'high' ? 'Yüksek' : 'Orta';
}

function getWeatherIcon(condition) {
    const icons = {
        'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
        'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Fog': '🌫️', 'Haze': '🌫️'
    };
    return icons[condition] || '🌤️';
}

// ============================================================================
// ABTM - AKILLI BAĞLAMSAL TAVSİYE MEKANİZMASI
// ============================================================================

function getContextualAdvice(stage, weather) {
    if (!weather) return '';
    
    const advice = [];
    const temp = weather.main.temp;
    const rain = weather.weather[0].main === 'Rain';
    const windSpeed = weather.wind.speed * 3.6;
    
    if (temp > 35 && stage.dehydrationRisk > 50) {
        advice.push(`<div class="abtm-advice abtm-critical"><div class="abtm-title">🔥 KRİTİK SUSUZLUK RİSKİ!</div>Sıcaklık ${Math.round(temp)}°C. En az 4 litre su alın. Öğle saatlerinde (11:00-15:00) mola verin.</div>`);
    } else if (temp > 30 && stage.dehydrationRisk > 40) {
        advice.push(`<div class="abtm-advice abtm-warning"><div class="abtm-title">☀️ Yüksek Sıcaklık</div>${Math.round(temp)}°C. En az 3 litre su taşıyın.</div>`);
    }
    
    if (rain && stage.slipRisk > 60) {
        advice.push(`<div class="abtm-advice abtm-critical"><div class="abtm-title">⚠️ ZEMİN KAYGAN!</div>Yağmur + ${stage.slipRisk}% kayma riski. Baton kullanın!</div>`);
    } else if (rain && stage.slipRisk > 40) {
        advice.push(`<div class="abtm-advice abtm-warning"><div class="abtm-title">🌧️ Kaygan Zemin</div>Dikkatli ilerleyin.</div>`);
    }
    
    if (windSpeed > 40) {
        advice.push(`<div class="abtm-advice abtm-warning"><div class="abtm-title">💨 Şiddetli Rüzgar</div>${Math.round(windSpeed)} km/h rüzgar.</div>`);
    }
    
    if (stage.risk === 'high') {
        advice.push(`<div class="abtm-advice abtm-info"><div class="abtm-title">🎯 Yüksek Risk</div>Deneyimli yürüyüşçüler için.</div>`);
    }
    
    return advice.join('');
}

// ============================================================================
// MAP & GPX
// ============================================================================

function initMap() {
    State.map = L.map('map', { center: [36.4, 29.8], zoom: 9, zoomControl: true });
    State.layers.street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 18
    }).addTo(State.map);
    State.layers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri', maxZoom: 18
    });
    loadGPXFiles();
    addWaterSources();
    addHospitals();
    loadWeather();
    renderGPXSections();
    renderStages();
    renderHospitals();
}

function loadGPXFiles() {
    GPX_SECTIONS.forEach(section => {
        new L.GPX(section.file, {
            async: true,
            marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null },
            polyline_options: { color: section.color, weight: 5, opacity: 0.8 }
        }).on('loaded', e => console.log(`✅ ${section.name}`))
          .on('error', e => console.error(`❌ ${section.name}`, e))
          .addTo(State.map);
    });
}

function addWaterSources() {
    WATER_SOURCES.forEach(water => {
        L.marker(water.coords, {
            icon: L.divIcon({
                html: '<div style="background:#3b82f6;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">💧</div>',
                className: '', iconSize: [28, 28]
            })
        }).addTo(State.map).bindPopup(`<div style="text-align:center"><div style="font-size:24px;margin-bottom:8px">💧</div><h4 style="margin:0;color:#1e40af;font-size:14px">${water.name}</h4><p style="margin:4px 0 0 0;font-size:11px;color:#64748b">Bölüm ${water.stage}</p></div>`);
    });
}

function addHospitals() {
    HOSPITALS.forEach(h => {
        L.marker(h.coords, {
            icon: L.divIcon({
                html: '<div style="background:#dc2626;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)">🏥</div>',
                className: '', iconSize: [32, 32]
            })
        }).addTo(State.map).bindPopup(`<div style="text-align:center;min-width:180px"><div style="font-size:28px;margin-bottom:8px">🏥</div><h4 style="margin:0;color:#dc2626;font-size:14px;font-weight:700">${h.name}</h4><p style="margin:6px 0;font-size:12px">📞 ${h.phone}</p><p style="font-size:11px;color:#64748b">📍 ${h.distance}</p><button onclick="window.open('tel:112')" style="margin-top:8px;padding:8px 16px;background:#dc2626;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer">📞 112 ARA</button></div>`);
    });
}

async function loadWeather() {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=36.5&lon=29.5&appid=${WEATHER_API_KEY}&units=metric&lang=tr`);
        const data = await res.json();
        State.weather = data;
        document.getElementById('weatherCard').innerHTML = `
            <div class="weather-location"><i class="fas fa-map-marker-alt"></i> Likya Yolu - Fethiye/Antalya</div>
            <div class="weather-temp"><div class="weather-temp-value">${Math.round(data.main.temp)}°C</div><div class="weather-icon">${getWeatherIcon(data.weather[0].main)}</div></div>
            <div class="weather-desc">${data.weather[0].description}</div>
            <div class="weather-details">
                <div class="weather-item"><i class="fas fa-temperature-half"></i> ${Math.round(data.main.feels_like)}°C</div>
                <div class="weather-item"><i class="fas fa-droplet"></i> ${data.main.humidity}%</div>
                <div class="weather-item"><i class="fas fa-wind"></i> ${Math.round(data.wind.speed*3.6)} km/h</div>
                <div class="weather-item"><i class="fas fa-gauge"></i> ${data.main.pressure} mb</div>
            </div>`;
        renderStages();
    } catch (e) {
        console.error('Hava:', e);
        document.getElementById('weatherCard').innerHTML = '<div class="loading" style="color:#dc2626"><i class="fas fa-exclamation-triangle"></i> Yüklenemedi</div>';
    }
}

// ============================================================================
// UI RENDERING
// ============================================================================

function renderGPXSections() {
    document.getElementById('gpxSectionsList').innerHTML = GPX_SECTIONS.map(s => `
        <div class="gpx-card" onclick="selectGPXSection(${s.id})">
            <div class="gpx-header"><div class="gpx-line" style="background:${s.color}"></div><div class="gpx-title">${s.name}</div></div>
            <div class="gpx-info"><span>📏 ${s.distance} km</span><span>⚡ ${s.difficulty}</span><span>💧 ${s.waterSources} su</span></div>
            <div class="gpx-warning">${s.warning}</div>
        </div>`).join('');
}

function renderStages() {
    const filter = document.querySelector('.filter-btn.active').dataset.filter;
    const filtered = filter === 'all' ? ALL_STAGES : ALL_STAGES.filter(s => s.risk === filter);
    document.getElementById('stagesList').innerHTML = filtered.map(s => `
        <div class="stage-card" style="border-color:${getRiskColor(s.risk)}">
            <div class="stage-header"><div class="stage-name">${s.id}. ${s.name}</div><div class="risk-badge" style="background:${getRiskColor(s.risk)}">${getRiskText(s.risk)}</div></div>
            <div class="stage-info"><span>📏 ${s.distance} km</span><span>⚡ ${s.difficulty}</span></div>
            ${getContextualAdvice(s, State.weather)}
        </div>`).join('');
}

function renderHospitals() {
    document.getElementById('hospitalsList').innerHTML = HOSPITALS.map(h => `
        <div class="hospital-card" onclick="State.map.setView([${h.coords}],13)">
            <div class="hospital-name"><span>🏥</span><span>${h.name}</span></div>
            <div class="hospital-info">📞 ${h.phone} • 📍 ${h.distance}</div>
        </div>`).join('');
}

function selectGPXSection(id) {
    const s = GPX_SECTIONS.find(x => x.id === id);
    State.selectedSection = s;
    const max = Math.max(...s.elevationData);
    document.getElementById('elevationContainer').innerHTML = `
        <div class="elevation-chart active">
            <div class="chart-title"><i class="fas fa-chart-line"></i> Yükseklik - ${s.name}</div>
            <div class="chart-bars">${s.elevationData.map(h => `<div class="chart-bar" style="height:${(h/max)*100}%"><div class="chart-bar-label">${h}m</div></div>`).join('')}</div>
            <div class="chart-stats"><span>⬆️ ${s.elevation.gain}m</span><span>⬇️ ${s.elevation.loss}m</span></div>
        </div>`;
}

// ============================================================================
// GPS & CONTROLS
// ============================================================================

function toggleGPS() {
    const btn = document.getElementById('gpsBtn');
    const txt = document.getElementById('gpsText');
    const badge = document.getElementById('userLocationBadge');
    if (!State.gpsActive) {
        if (navigator.geolocation) {
            State.gpsWatchId = navigator.geolocation.watchPosition(p => {
                if (State.userMarker) State.map.removeLayer(State.userMarker);
                State.userMarker = L.marker([p.coords.latitude, p.coords.longitude], {
                    icon: L.divIcon({html:'<div style="background:#dc2626;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;border:4px solid white;box-shadow:0 3px 12px rgba(0,0,0,0.4)">📍</div>',className:'',iconSize:[36,36]})
                }).addTo(State.map).bindPopup('📍 Konumunuz').openPopup();
                State.map.setView([p.coords.latitude,p.coords.longitude],13);
                State.gpsActive = true;
                btn.classList.add('active');
                txt.textContent = 'GPS Aktif';
                badge.classList.add('active');
            }, e => alert('GPS hatası!'), {enableHighAccuracy:true,timeout:10000,maximumAge:0});
        } else alert('GPS desteklenmiyor!');
    } else {
        if (State.gpsWatchId) navigator.geolocation.clearWatch(State.gpsWatchId);
        if (State.userMarker) State.map.removeLayer(State.userMarker);
        State.gpsActive = false;
        btn.classList.remove('active');
        txt.textContent = "GPS'i Başlat";
        badge.classList.remove('active');
    }
}

function toggleLayer() {
    const txt = document.getElementById('layerText');
    if (State.currentLayer === 'street') {
        State.map.removeLayer(State.layers.street);
        State.layers.satellite.addTo(State.map);
        State.currentLayer = 'satellite';
        txt.textContent = 'Sokak Görünümü';
    } else {
        State.map.removeLayer(State.layers.satellite);
        State.layers.street.addTo(State.map);
        State.currentLayer = 'street';
        txt.textContent = 'Uydu Görünümü';
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Likya Yolu Güvenli Adımlar başlatılıyor...');
    initMap();
    document.getElementById('gpsBtn').addEventListener('click', toggleGPS);
    document.getElementById('layerBtn').addEventListener('click', toggleLayer);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderStages();
        });
    });
    console.log('✅ Sistem hazır!');
});