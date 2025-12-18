// Likya Yolu Güvenlik Sistemi - Ana JavaScript Dosyası

// Harita ve Temel Değişkenler
let map;
let userMarker;
let userLocation = null;
let gpsActive = false;
let gpsWatchId = null;
let currentLanguage = 'tr';
let weatherChart = null;

// Likya Yolu Segmentleri (32 Etap)
const stages = [
    { id: 1, name: 'Fethiye - Ölüdeniz', distance: 15, difficulty: 'Kolay', elevation: 300, risk: 'low', coords: [[36.6167, 29.1167], [36.5849, 29.1144]] },
    { id: 2, name: 'Ölüdeniz - Kabak', distance: 18, difficulty: 'Orta', elevation: 450, risk: 'medium', coords: [[36.5849, 29.1144], [36.5667, 29.0833]] },
    { id: 3, name: 'Kabak - Faralya', distance: 14, difficulty: 'Zor', elevation: 600, risk: 'high', coords: [[36.5667, 29.0833], [36.5500, 29.0500]] },
    { id: 4, name: 'Faralya - Geyikbayırı', distance: 16, difficulty: 'Orta', elevation: 400, risk: 'medium', coords: [[36.5500, 29.0500], [36.5333, 29.0167]] },
    { id: 5, name: 'Geyikbayırı - Alınca', distance: 17, difficulty: 'Orta', elevation: 350, risk: 'low', coords: [[36.5333, 29.0167], [36.5167, 28.9833]] },
    { id: 6, name: 'Alınca - Çıralı', distance: 19, difficulty: 'Orta', elevation: 500, risk: 'medium', coords: [[36.5167, 28.9833], [36.4833, 28.9500]] },
    { id: 7, name: 'Çıralı - Antalya', distance: 20, difficulty: 'Kolay', elevation: 200, risk: 'low', coords: [[36.4833, 28.9500], [36.4667, 28.9167]] },
    { id: 8, name: 'Antalya - Kemer', distance: 22, difficulty: 'Kolay', elevation: 150, risk: 'low', coords: [[36.4667, 28.9167], [36.6167, 29.0833]] },
    { id: 9, name: 'Kemer - Beldibi', distance: 18, difficulty: 'Orta', elevation: 400, risk: 'medium', coords: [[36.6167, 29.0833], [36.6333, 29.1167]] },
    { id: 10, name: 'Beldibi - Göynük', distance: 16, difficulty: 'Orta', elevation: 380, risk: 'medium', coords: [[36.6333, 29.1167], [36.6500, 29.1500]] },
    { id: 11, name: 'Göynük - Tekirova', distance: 17, difficulty: 'Zor', elevation: 550, risk: 'high', coords: [[36.6500, 29.1500], [36.6667, 29.1833]] },
    { id: 12, name: 'Tekirova - Phaselis', distance: 14, difficulty: 'Orta', elevation: 420, risk: 'medium', coords: [[36.6667, 29.1833], [36.6833, 29.2167]] },
    { id: 13, name: 'Phaselis - Çamyuva', distance: 15, difficulty: 'Kolay', elevation: 250, risk: 'low', coords: [[36.6833, 29.2167], [36.7000, 29.2500]] },
    { id: 14, name: 'Çamyuva - Kumluca', distance: 19, difficulty: 'Orta', elevation: 380, risk: 'medium', coords: [[36.7000, 29.2500], [36.7167, 29.2833]] },
    { id: 15, name: 'Kumluca - Adrasan', distance: 17, difficulty: 'Orta', elevation: 400, risk: 'medium', coords: [[36.7167, 29.2833], [36.7333, 29.3167]] },
    { id: 16, name: 'Adrasan - Olympos', distance: 16, difficulty: 'Zor', elevation: 520, risk: 'high', coords: [[36.7333, 29.3167], [36.7500, 29.3500]] },
    { id: 17, name: 'Olympos - Çıralı', distance: 18, difficulty: 'Orta', elevation: 450, risk: 'medium', coords: [[36.7500, 29.3500], [36.7667, 29.3833]] },
    { id: 18, name: 'Çıralı - Ulupınar', distance: 15, difficulty: 'Kolay', elevation: 280, risk: 'low', coords: [[36.7667, 29.3833], [36.7833, 29.4167]] },
    { id: 19, name: 'Ulupınar - Kaş', distance: 20, difficulty: 'Orta', elevation: 380, risk: 'medium', coords: [[36.7833, 29.4167], [36.8000, 29.4500]] },
    { id: 20, name: 'Kaş - Kalkan', distance: 17, difficulty: 'Orta', elevation: 420, risk: 'medium', coords: [[36.8000, 29.4500], [36.8167, 29.4833]] },
    { id: 21, name: 'Kalkan - Patara', distance: 18, difficulty: 'Kolay', elevation: 300, risk: 'low', coords: [[36.8167, 29.4833], [36.8333, 29.5167]] },
    { id: 22, name: 'Patara - Xanthos', distance: 16, difficulty: 'Orta', elevation: 350, risk: 'medium', coords: [[36.8333, 29.5167], [36.8500, 29.5500]] },
    { id: 23, name: 'Xanthos - Letoon', distance: 14, difficulty: 'Kolay', elevation: 200, risk: 'low', coords: [[36.8500, 29.5500], [36.8667, 29.5833]] },
    { id: 24, name: 'Letoon - Tlos', distance: 19, difficulty: 'Orta', elevation: 400, risk: 'medium', coords: [[36.8667, 29.5833], [36.8833, 29.6167]] },
    { id: 25, name: 'Tlos - Saklikent', distance: 17, difficulty: 'Zor', elevation: 580, risk: 'high', coords: [[36.8833, 29.6167], [36.9000, 29.6500]] },
    { id: 26, name: 'Saklikent - Ölüdeniz', distance: 18, difficulty: 'Orta', elevation: 450, risk: 'medium', coords: [[36.9000, 29.6500], [36.9167, 29.6833]] },
    { id: 27, name: 'Ölüdeniz - Butterfly Valley', distance: 15, difficulty: 'Kolay', elevation: 250, risk: 'low', coords: [[36.9167, 29.6833], [36.9333, 29.7167]] },
    { id: 28, name: 'Butterfly Valley - Gemile', distance: 16, difficulty: 'Orta', elevation: 380, risk: 'medium', coords: [[36.9333, 29.7167], [36.9500, 29.7500]] },
    { id: 29, name: 'Gemile - Sarsala', distance: 17, difficulty: 'Orta', elevation: 420, risk: 'medium', coords: [[36.9500, 29.7500], [36.9667, 29.7833]] },
    { id: 30, name: 'Sarsala - Akkaya', distance: 19, difficulty: 'Zor', elevation: 550, risk: 'high', coords: [[36.9667, 29.7833], [36.9833, 29.8167]] },
    { id: 31, name: 'Akkaya - Sidyma', distance: 18, difficulty: 'Orta', elevation: 400, risk: 'medium', coords: [[36.9833, 29.8167], [37.0000, 29.8500]] },
    { id: 32, name: 'Sidyma - Antalya', distance: 16, difficulty: 'Kolay', elevation: 300, risk: 'low', coords: [[37.0000, 29.8500], [36.87, 30.47]] }
];

// Tesisler (Konaklama, Su Kaynakları, Tıbbi Yardım)
const facilities = [
    { name: 'Fethiye Hastanesi', type: 'Tıbbi Yardım', coords: [36.6167, 29.1167], distance: '0 km' },
    { name: 'Ölüdeniz Pansiyon', type: 'Konaklama', coords: [36.5849, 29.1144], distance: '15 km' },
    { name: 'Kabak Su Kaynağı', type: 'Su Kaynağı', coords: [36.5667, 29.0833], distance: '33 km' },
    { name: 'Faralya Konaklama', type: 'Konaklama', coords: [36.5500, 29.0500], distance: '47 km' },
    { name: 'Geyikbayırı Hastanesi', type: 'Tıbbi Yardım', coords: [36.5333, 29.0167], distance: '63 km' },
    { name: 'Çıralı Pansiyon', type: 'Konaklama', coords: [36.4833, 28.9500], distance: '80 km' },
    { name: 'Antalya Hastanesi', type: 'Tıbbi Yardım', coords: [36.4667, 28.9167], distance: '100 km' },
    { name: 'Kemer Otel', type: 'Konaklama', coords: [36.6167, 29.0833], distance: '122 km' },
    { name: 'Beldibi Su Kaynağı', type: 'Su Kaynağı', coords: [36.6333, 29.1167], distance: '140 km' },
    { name: 'Kaş Hastanesi', type: 'Tıbbi Yardım', coords: [36.8000, 29.4500], distance: '280 km' },
    { name: 'Kalkan Pansiyon', type: 'Konaklama', coords: [36.8167, 29.4833], distance: '297 km' },
    { name: 'Patara Su Kaynağı', type: 'Su Kaynağı', coords: [36.8333, 29.5167], distance: '315 km' }
];

// Dil Çevirileri
const translations = {
    tr: {
        gpsOff: 'GPS Kapalı',
        gpsOn: 'GPS Açık - Konum: ',
        startGPS: 'GPS\'i Başlat',
        stopGPS: 'GPS\'i Durdur',
        centerMap: 'Konumuma Git',
        emergency: 'SOS - Acil Durum',
        overview: 'Genel',
        weather: 'Hava',
        stages: 'Etaplar',
        facilities: 'Tesisler',
        totalLength: 'Toplam Uzunluk',
        stageCount: 'Etap Sayısı',
        difficulty: 'Zorluk Seviyesi',
        recommendedTime: 'Tavsiye Edilen Süre',
        currentRisk: 'Mevcut Risk Seviyesi',
        liveWeather: 'Canlı Hava Durumu',
        temperature: 'Sıcaklık',
        humidity: 'Nem',
        wind: 'Rüzgar',
        pressure: 'Basınç',
        pastWeather: 'Geçmiş Yıllar Hava Durumu',
        stageList: '32 Etap Listesi',
        accommodationFacilities: 'Konaklama ve Tesisler',
        emergencyAlert: 'Acil Durum Bildirimi',
        selectOption: 'Acil durumda, aşağıdaki seçeneklerden birini seçin:',
        callPolice: 'Polis Çağır (155)',
        callAmbulance: 'Ambulans Çağır (112)',
        callMountainRescue: 'Dağ Kurtarma (177)',
        locationWillBeSent: 'Konumunuz otomatik olarak gönderilecektir.',
        cancel: 'İptal'
    },
    en: {
        gpsOff: 'GPS Off',
        gpsOn: 'GPS On - Location: ',
        startGPS: 'Start GPS',
        stopGPS: 'Stop GPS',
        centerMap: 'Center Map',
        emergency: 'SOS - Emergency',
        overview: 'Overview',
        weather: 'Weather',
        stages: 'Stages',
        facilities: 'Facilities',
        totalLength: 'Total Length',
        stageCount: 'Stage Count',
        difficulty: 'Difficulty Level',
        recommendedTime: 'Recommended Time',
        currentRisk: 'Current Risk Level',
        liveWeather: 'Live Weather',
        temperature: 'Temperature',
        humidity: 'Humidity',
        wind: 'Wind',
        pressure: 'Pressure',
        pastWeather: 'Past Years Weather',
        stageList: '32 Stage List',
        accommodationFacilities: 'Accommodation & Facilities',
        emergencyAlert: 'Emergency Alert',
        selectOption: 'In case of emergency, select one of the following options:',
        callPolice: 'Call Police (155)',
        callAmbulance: 'Call Ambulance (112)',
        callMountainRescue: 'Call Mountain Rescue (177)',
        locationWillBeSent: 'Your location will be sent automatically.',
        cancel: 'Cancel'
    },
    de: {
        gpsOff: 'GPS aus',
        gpsOn: 'GPS an - Standort: ',
        startGPS: 'GPS starten',
        stopGPS: 'GPS stoppen',
        centerMap: 'Karte zentrieren',
        emergency: 'SOS - Notfall',
        overview: 'Übersicht',
        weather: 'Wetter',
        stages: 'Etappen',
        facilities: 'Einrichtungen',
        totalLength: 'Gesamtlänge',
        stageCount: 'Etappenzahl',
        difficulty: 'Schwierigkeitsgrad',
        recommendedTime: 'Empfohlene Zeit',
        currentRisk: 'Aktuelles Risiko',
        liveWeather: 'Aktuelles Wetter',
        temperature: 'Temperatur',
        humidity: 'Luftfeuchtigkeit',
        wind: 'Wind',
        pressure: 'Luftdruck',
        pastWeather: 'Wetter der Vorjahre',
        stageList: '32 Etappenliste',
        accommodationFacilities: 'Unterkunft & Einrichtungen',
        emergencyAlert: 'Notfallmeldung',
        selectOption: 'Wählen Sie im Notfall eine der folgenden Optionen:',
        callPolice: 'Polizei anrufen (155)',
        callAmbulance: 'Krankenwagen anrufen (112)',
        callMountainRescue: 'Bergrettung anrufen (177)',
        locationWillBeSent: 'Ihr Standort wird automatisch gesendet.',
        cancel: 'Abbrechen'
    },
    ru: {
        gpsOff: 'GPS выключен',
        gpsOn: 'GPS включен - Местоположение: ',
        startGPS: 'Включить GPS',
        stopGPS: 'Выключить GPS',
        centerMap: 'Центрировать карту',
        emergency: 'SOS - Экстренная помощь',
        overview: 'Обзор',
        weather: 'Погода',
        stages: 'Этапы',
        facilities: 'Объекты',
        totalLength: 'Общая длина',
        stageCount: 'Количество этапов',
        difficulty: 'Уровень сложности',
        recommendedTime: 'Рекомендуемое время',
        currentRisk: 'Текущий уровень риска',
        liveWeather: 'Текущая погода',
        temperature: 'Температура',
        humidity: 'Влажность',
        wind: 'Ветер',
        pressure: 'Давление',
        pastWeather: 'Погода прошлых лет',
        stageList: 'Список из 32 этапов',
        accommodationFacilities: 'Проживание и объекты',
        emergencyAlert: 'Оповещение об экстренной ситуации',
        selectOption: 'В случае чрезвычайной ситуации выберите один из следующих вариантов:',
        callPolice: 'Вызвать полицию (155)',
        callAmbulance: 'Вызвать скорую помощь (112)',
        callMountainRescue: 'Вызвать горноспасательную службу (177)',
        locationWillBeSent: 'Ваше местоположение будет отправлено автоматически.',
        cancel: 'Отмена'
    },
    fr: {
        gpsOff: 'GPS désactivé',
        gpsOn: 'GPS activé - Localisation: ',
        startGPS: 'Démarrer GPS',
        stopGPS: 'Arrêter GPS',
        centerMap: 'Centrer la carte',
        emergency: 'SOS - Urgence',
        overview: 'Aperçu',
        weather: 'Météo',
        stages: 'Étapes',
        facilities: 'Installations',
        totalLength: 'Longueur totale',
        stageCount: 'Nombre d\'étapes',
        difficulty: 'Niveau de difficulté',
        recommendedTime: 'Temps recommandé',
        currentRisk: 'Niveau de risque actuel',
        liveWeather: 'Météo en direct',
        temperature: 'Température',
        humidity: 'Humidité',
        wind: 'Vent',
        pressure: 'Pression',
        pastWeather: 'Météo des années précédentes',
        stageList: 'Liste des 32 étapes',
        accommodationFacilities: 'Hébergement et installations',
        emergencyAlert: 'Alerte d\'urgence',
        selectOption: 'En cas d\'urgence, sélectionnez l\'une des options suivantes:',
        callPolice: 'Appeler la police (155)',
        callAmbulance: 'Appeler une ambulance (112)',
        callMountainRescue: 'Appeler le secours en montagne (177)',
        locationWillBeSent: 'Votre localisation sera envoyée automatiquement.',
        cancel: 'Annuler'
    }
};

// Harita Başlatma
function initMap() {
    // Likya Yolu'nun merkez koordinatı
    const likyaCenterLat = 36.7;
    const likyaCenterLng = 29.3;

    map = L.map('map').setView([likyaCenterLat, likyaCenterLng], 8);

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 6
    }).addTo(map);

    // Likya Yolu rotasını haritaya ekle
    drawLikyaRoute();

    // Segmentleri haritaya ekle
    drawSegments();

    // Tesisleri haritaya ekle
    drawFacilities();

    // Etapları sidebar'a ekle
    populateStages();

    // Tesisleri sidebar'a ekle
    populateFacilities();

    // Hava durumu grafiğini oluştur
    initWeatherChart();

    // Hava durumunu güncelle
    updateWeather();
}

// Likya Yolu Rotasını Çiz
function drawLikyaRoute() {
    let routeCoords = [];
    stages.forEach(stage => {
        routeCoords = routeCoords.concat(stage.coords);
    });

    L.polyline(routeCoords, {
        color: '#2a5298',
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 5'
    }).addTo(map);

    // Başlangıç ve bitiş noktaları
    L.circleMarker([36.6167, 29.1167], {
        radius: 8,
        fillColor: '#51cf66',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map).bindPopup('<b>Fethiye - Başlangıç</b>');

    L.circleMarker([36.87, 30.47], {
        radius: 8,
        fillColor: '#ff6b6b',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map).bindPopup('<b>Antalya - Bitiş</b>');
}

// Segmentleri Çiz
function drawSegments() {
    stages.forEach(stage => {
        const riskColor = stage.risk === 'low' ? '#51cf66' : stage.risk === 'medium' ? '#ffd43b' : '#ff6b6b';

        L.polyline(stage.coords, {
            color: riskColor,
            weight: 4,
            opacity: 0.7
        }).addTo(map).bindPopup(`
            <b>${stage.name}</b><br>
            Mesafe: ${stage.distance} km<br>
            Zorluk: ${stage.difficulty}<br>
            Risk: ${stage.risk === 'low' ? 'Düşük' : stage.risk === 'medium' ? 'Orta' : 'Yüksek'}
        `);
    });
}

// Tesisleri Çiz
function drawFacilities() {
    facilities.forEach(facility => {
        const icon = facility.type === 'Konaklama' ? '🏨' : facility.type === 'Su Kaynağı' ? '💧' : '🏥';
        
        L.marker(facility.coords, {
            icon: L.divIcon({
                html: `<div style="font-size: 24px; text-align: center;">${icon}</div>`,
                iconSize: [30, 30]
            })
        }).addTo(map).bindPopup(`
            <b>${facility.name}</b><br>
            Tür: ${facility.type}<br>
            Mesafe: ${facility.distance}
        `);
    });
}

// Etapları Sidebar'a Ekle
function populateStages() {
    const stagesList = document.getElementById('stagesList');
    stagesList.innerHTML = '';

    stages.forEach(stage => {
        const riskClass = stage.risk === 'low' ? 'risk-low' : stage.risk === 'medium' ? 'risk-medium' : 'risk-high';
        const riskText = stage.risk === 'low' ? 'Düşük' : stage.risk === 'medium' ? 'Orta' : 'Yüksek';

        const stageDiv = document.createElement('div');
        stageDiv.className = 'stage-item';
        stageDiv.innerHTML = `
            <div class="stage-name">${stage.id}. ${stage.name}</div>
            <div class="stage-info">
                <span>${stage.distance} km</span> | 
                <span>${stage.difficulty}</span> | 
                <span class="risk-badge ${riskClass}">${riskText} Risk</span>
            </div>
        `;
        stageDiv.onclick = () => {
            map.fitBounds(L.polyline(stage.coords).getBounds());
        };
        stagesList.appendChild(stageDiv);
    });
}

// Tesisleri Sidebar'a Ekle
function populateFacilities() {
    const facilitiesList = document.getElementById('facilitiesList');
    facilitiesList.innerHTML = '';

    facilities.forEach(facility => {
        const facilityDiv = document.createElement('div');
        facilityDiv.className = 'facility-item';
        facilityDiv.innerHTML = `
            <div class="facility-name">${facility.name}</div>
            <div class="facility-type">${facility.type}</div>
        `;
        facilityDiv.onclick = () => {
            map.setView(facility.coords, 12);
        };
        facilitiesList.appendChild(facilityDiv);
    });
}

// GPS Başlat
function startGPS() {
    if (!gpsActive) {
        gpsActive = true;
        document.getElementById('gpsStatus').classList.remove('inactive');

        if (navigator.geolocation) {
            gpsWatchId = navigator.geolocation.watchPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    userLocation = [lat, lng];

                    // Kullanıcı konumunu güncelle
                    if (userMarker) {
                        map.removeLayer(userMarker);
                    }

                    userMarker = L.circleMarker([lat, lng], {
                        radius: 8,
                        fillColor: '#2a5298',
                        color: '#fff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map).bindPopup('Mevcut Konumunuz');

                    document.getElementById('gpsStatusText').textContent = `GPS Açık - Konum: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                },
                error => {
                    console.error('GPS Hatası:', error);
                    document.getElementById('gpsStatusText').textContent = 'GPS Hatası';
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );
        } else {
            alert('Tarayıcınız GPS desteği sağlamıyor!');
            gpsActive = false;
        }
    }
}

// Haritayı Konuma Ortala
function centerMap() {
    if (userLocation) {
        map.setView(userLocation, 13);
    } else {
        alert('Konumunuz henüz alınamadı. Lütfen GPS\'i başlatın.');
    }
}

// Acil Durum Modal'ı Göster
function showEmergency() {
    document.getElementById('emergencyModal').classList.add('show');
}

// Acil Durum Modal'ını Kapat
function closeEmergency() {
    document.getElementById('emergencyModal').classList.remove('show');
}

// Acil Durum Çağrısı
function callEmergency(type) {
    const numbers = {
        police: '155',
        ambulance: '112',
        mountain: '177'
    };

    const location = userLocation ? `Konum: ${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}` : 'Konum bilinmiyor';
    
    alert(`${type === 'police' ? 'Polis' : type === 'ambulance' ? 'Ambulans' : 'Dağ Kurtarma'} çağrısı yapılıyor...\n${location}`);
    
    // Gerçek uygulamada, burada telefon numarası aranacak
    // window.location.href = `tel:${numbers[type]}`;

    closeEmergency();
}

// Hava Durumu Güncelle
function updateWeather() {
    // Simüle edilmiş hava durumu verileri (gerçek API'den alınabilir)
    const weatherData = {
        temp: 22,
        humidity: 65,
        wind: 15,
        pressure: 1013
    };

    document.getElementById('tempValue').textContent = `${weatherData.temp}°C`;
    document.getElementById('humidityValue').textContent = `${weatherData.humidity}%`;
    document.getElementById('windValue').textContent = `${weatherData.wind} km/h`;
    document.getElementById('pressureValue').textContent = `${weatherData.pressure} mb`;

    // Her 30 dakikada bir güncelle
    setTimeout(updateWeather, 30 * 60 * 1000);
}

// Hava Durumu Grafiği Oluştur
function initWeatherChart() {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    
    // Geçmiş yılların ortalama sıcaklık verileri (simüle)
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const temps2023 = [12, 13, 16, 20, 25, 30, 33, 32, 28, 22, 17, 13];
    const temps2022 = [11, 12, 15, 19, 24, 29, 32, 31, 27, 21, 16, 12];
    const temps2021 = [13, 14, 17, 21, 26, 31, 34, 33, 29, 23, 18, 14];

    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '2023',
                    data: temps2023,
                    borderColor: '#2a5298',
                    backgroundColor: 'rgba(42, 82, 152, 0.1)',
                    tension: 0.4
                },
                {
                    label: '2022',
                    data: temps2022,
                    borderColor: '#51cf66',
                    backgroundColor: 'rgba(81, 207, 102, 0.1)',
                    tension: 0.4
                },
                {
                    label: '2021',
                    data: temps2021,
                    borderColor: '#ffd43b',
                    backgroundColor: 'rgba(255, 212, 59, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Ortalama Aylık Sıcaklık (°C)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 35
                }
            }
        }
    });
}

// Tab Değiştir
function switchTab(tabName) {
    // Tüm tab içeriklerini gizle
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Tüm tab butonlarından active sınıfını kaldır
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Seçilen tab'ı göster
    document.getElementById(tabName).classList.add('active');

    // Seçilen tab butonuna active sınıfı ekle
    event.target.classList.add('active');
}

// Dil Değiştir
function changeLanguage(lang) {
    currentLanguage = lang;
    // Dil değişikliğini uygula (basit örnek)
    document.documentElement.lang = lang;
}

// Sayfa Yüklendiğinde Başlat
window.addEventListener('DOMContentLoaded', () => {
    initMap();
});

// Modal Dışında Tıklanırsa Kapat
window.addEventListener('click', (event) => {
    const modal = document.getElementById('emergencyModal');
    if (event.target === modal) {
        closeEmergency();
    }
});
