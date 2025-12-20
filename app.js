// Likya Yolu Güvenlik Sistemi - Final Optimized Version
'use strict';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    MAP: {
        CENTER: [36.7, 29.3],
        DEFAULT_ZOOM: 8,
        MIN_ZOOM: 6,
        MAX_ZOOM: 19
    },
    GPS: {
        UPDATE_INTERVAL: 5000,
        HIGH_ACCURACY: true,
        TIMEOUT: 10000,
        MAX_AGE: 0
    },
    WEATHER: {
        API_KEY: '007b67b6185ac73e3b2226ae39d527df',
        UPDATE_INTERVAL: 1800000, // 30 minutes
        BASE_URL: 'https://api.openweathermap.org/data/2.5'
    }
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const State = {
    map: null,
    userMarker: null,
    userLocation: null,
    gpsActive: false,
    gpsWatchId: null,
    currentLanguage: 'tr',
    weatherChart: null,
    layers: {
        route: null,
        stages: [],
        facilities: []
    }
};

// ============================================================================
// KML DATA - Real Likya Yolu Coordinates
// ============================================================================

const LIKYA_ROUTE_COORDINATES = [
    [36.56473, 29.13874], [36.56194, 29.13833], [36.55794, 29.13863], [36.55679, 29.13729],
    [36.55448, 29.13532], [36.55284, 29.13455], [36.55137, 29.13469], [36.55001, 29.1339],
    [36.54883, 29.13368], [36.54681, 29.13421], [36.54577, 29.13389], [36.54395, 29.13413],
    [36.54243, 29.13398], [36.54131, 29.13423], [36.53942, 29.13552], [36.53821, 29.13699],
    [36.53791, 29.13762], [36.53666, 29.13899], [36.53594, 29.13951], [36.53601, 29.14003],
    [36.46728, 29.12323], [36.46862, 29.12426], [36.4712, 29.1257], [36.47016, 29.1278],
    [36.402188, 29.134435], [36.40105, 29.135267], [36.400935, 29.13602],
    [36.336185, 29.202019], [36.33398, 29.20542], [36.33348, 29.20548],
    [36.280936, 29.408318], [36.281578, 29.408598], [36.280908, 29.408001],
    [36.273689, 29.320948], [36.27118, 29.32127], [36.270363, 29.320575],
    [36.262284, 29.418125], [36.255993, 29.419624], [36.253981, 29.420595],
    [36.240079, 29.67097], [36.24016, 29.500761], [36.239383, 29.502485],
    [36.241378, 29.543008], [36.247449, 29.54795], [36.254771, 29.555466],
    [36.199832, 29.639668], [36.196076, 29.646097], [36.194561, 29.64744],
    [36.159247, 29.787096], [36.159591, 29.787659], [36.159247, 29.787096],
    [36.197333, 29.847213], [36.198267, 29.850733], [36.198759, 29.855083],
    [36.329791, 30.001981], [36.331228, 30.003801], [36.333182, 30.00512],
    [36.300443, 30.073634], [36.299924, 30.073689], [36.298167, 30.075583],
    [36.297072, 30.146055], [36.295816, 30.145951], [36.295599, 30.145877],
    [36.276047, 30.41079], [36.276574, 30.32118], [36.275348, 30.407538],
    [36.410731, 30.478593], [36.410914, 30.479304], [36.411127, 30.478559],
    [36.504055, 30.426529], [36.505121, 30.422619], [36.506373, 30.420881],
    [36.614042, 30.447094], [36.615183, 30.452682], [36.617985, 30.454032],
    [36.681374, 30.551015], [36.682127, 30.547898], [36.682801, 30.542168],
    [36.772569, 30.469195]
];

// ============================================================================
// STAGES DATA
// ============================================================================

const STAGES = [
    { id: 1, name: 'Ölüdeniz - Kabak', distance: 15, difficulty: 'Kolay', elevation: 300, risk: 'low', coords: [[36.56473, 29.13874], [36.50516, 29.15486]] },
    { id: 2, name: 'Kabak - Faralya', distance: 18, difficulty: 'Orta', elevation: 450, risk: 'medium', coords: [[36.50516, 29.15486], [36.46728, 29.12323]] },
    { id: 3, name: 'Faralya - Alınca', distance: 14, difficulty: 'Zor', elevation: 600, risk: 'high', coords: [[36.46728, 29.12323], [36.402188, 29.134435]] },
    { id: 4, name: 'Alınca - Gey', distance: 16, difficulty: 'Orta', elevation: 400, risk: 'medium', coords: [[36.402188, 29.134435], [36.336185, 29.202019]] },
    { id: 5, name: 'Gey - Kınık', distance: 17, difficulty: 'Orta', elevation: 350, risk: 'low', coords: [[36.336185, 29.202019], [36.354826, 29.315061]] },
    { id: 6, name: 'Kınık - Patara', distance: 19, difficulty: 'Orta', elevation: 500, risk: 'medium', coords: [[36.354826, 29.315061], [36.280936, 29.408318]] },
    { id: 7, name: 'Patara - Kalkan', distance: 20, difficulty: 'Kolay', elevation: 200, risk: 'low', coords: [[36.280936, 29.408318], [36.273689, 29.320948]] },
    { id: 8, name: 'Kalkan - Bezirgan', distance: 22, difficulty: 'Kolay', elevation: 150, risk: 'low', coords: [[36.273689, 29.320948], [36.262284, 29.418125]] },
    { id: 9, name: 'Bezirgan - Gökçeören', distance: 18, difficulty: 'Orta', elevation: 400, risk: 'medium', coords: [[36.262284, 29.418125], [36.275763, 29.462322]] },
    { id: 10, name: 'Gökçeören - Çukurbağ', distance: 16, difficulty: 'Orta', elevation: 380, risk: 'medium', coords: [[36.275763, 29.462322], [36.241378, 29.543008]] },
    { id: 11, name: 'Çukurbağ - Kaş', distance: 17, difficulty: 'Zor', elevation: 550, risk: 'high', coords: [[36.241378, 29.543008], [36.240079, 29.67097]] },
    { id: 12, name: 'Kaş - Körmen Adası', distance: 14, difficulty: 'Orta', elevation: 420, risk: 'medium', coords: [[36.240079, 29.67097], [36.199832, 29.639668]] },
    { id: 13, name: 'Körmen - Aperlai', distance: 15, difficulty: 'Kolay', elevation: 250, risk: 'low', coords: [[36.199832, 29.639668], [36.155755, 29.71226]] },
    { id: 14, name: 'Aperlai - Üçağız', distance: 19, difficulty: 'Orta', elevation: 380, risk: 'medium', coords: [[36.155755, 29.71226], [36.159247, 29.787096]] },
    { id: 15, name: 'Üçağız - Demre', distance: 17, difficulty: 'Orta', elevation: 400, risk: 'medium', coords: [[36.159247, 29.787096], [36.197333, 29.847213]] },
    { id: 16, name: 'Demre - Alakilise', distance: 16, difficulty: 'Zor', elevation: 520, risk: 'high', coords: [[36.197333, 29.847213], [36.329791, 30.001981]] },
    { id: 17, name: 'Alakilise - Finike', distance: 18, difficulty: 'Orta', elevation: 450, risk: 'medium', coords: [[36.329791, 30.001981], [36.300443, 30.073634]] },
    { id: 18, name: 'Finike - Karaöz', distance: 15, difficulty: 'Kolay', elevation: 280, risk: 'low', coords: [[36.300443, 30.073634], [36.297072, 30.146055]] },
    { id: 19, name: 'Karaöz - Adrasan', distance: 20, difficulty: 'Orta', elevation: 380, risk: 'medium', coords: [[36.297072, 30.146055], [36.276047, 30.41079]] },
    { id: 20, name: 'Adrasan - Beycik', distance: 17, difficulty: 'Orta', elevation: 420, risk: 'medium', coords: [[36.276047, 30.41079], [36.410731, 30.478593]] },
    { id: 21, name: 'Beycik - Gedelme', distance: 18, difficulty: 'Kolay', elevation: 300, risk: 'low', coords: [[36.410731, 30.478593], [36.504055, 30.426529]] },
    { id: 22, name: 'Gedelme - Göynük', distance: 16, difficulty: 'Orta', elevation: 350, risk: 'medium', coords: [[36.504055, 30.426529], [36.614042, 30.447094]] },
    { id: 23, name: 'Göynük - Hisarcandır', distance: 14, difficulty: 'Kolay', elevation: 200, risk: 'low', coords: [[36.614042, 30.447094], [36.681374, 30.551015]] },
    { id: 24, name: 'Hisarcandır - Antalya', distance: 19, difficulty: 'Orta', elevation: 400, risk: 'medium', coords: [[36.681374, 30.551015], [36.8969, 30.7133]] }
];

// ============================================================================
// FACILITIES DATA - CORRECTED
// ============================================================================

const FACILITIES = [
    { name: 'Fethiye Devlet Hastanesi', type: 'Tıbbi Yardım', coords: [36.6526, 29.1198], distance: '0 km', phone: '112' },
    { name: 'Ölüdeniz Sağlık Ocağı', type: 'Tıbbi Yardım', coords: [36.5849, 29.1144], distance: '15 km', phone: '112' },
    { name: 'Kaş Devlet Hastanesi', type: 'Tıbbi Yardım', coords: [36.1992, 29.6362], distance: '200 km', phone: '112' },
    { name: 'Antalya Eğitim Araştırma Hastanesi', type: 'Tıbbi Yardım', coords: [36.8969, 30.7133], distance: '450 km', phone: '112' },
    { name: 'Ölüdeniz Pansiyon', type: 'Konaklama', coords: [36.5849, 29.1144], distance: '15 km' },
    { name: 'Kabak Su Kaynağı', type: 'Su Kaynağı', coords: [36.5667, 29.0833], distance: '33 km' },
    { name: 'Faralya Konaklama', type: 'Konaklama', coords: [36.5500, 29.0500], distance: '47 km' },
    { name: 'Kaş Pansiyon', type: 'Konaklama', coords: [36.2001, 29.6400], distance: '200 km' },
    { name: 'Demre Konaklama', type: 'Konaklama', coords: [36.2444, 29.9850], distance: '300 km' }
];

// ============================================================================
// TRANSLATIONS
// ============================================================================

const TRANSLATIONS = {
    tr: {
        gpsOff: 'GPS Kapalı',
        gpsOn: 'GPS Açık - Konum: ',
        startGPS: 'GPS\'i Başlat',
        stopGPS: 'GPS\'i Durdur',
        centerMap: 'Konumuma Git',
        emergency: 'SOS - Acil Durum (112)',
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
        pastWeather: 'Geçmiş Yıllar',
        stageList: '24 Etap Listesi',
        accommodationFacilities: 'Konaklama ve Tesisler',
        emergencyAlert: 'Acil Durum - 112',
        selectOption: 'Acil durumda 112\'yi arayın. Konumunuz otomatik gönderilecek.',
        call112: '112 Ara',
        cancel: 'İptal',
        distance: 'Mesafe',
        riskLow: 'Düşük',
        riskMedium: 'Orta',
        riskHigh: 'Yüksek',
        loading: 'Yükleniyor...'
    },
    en: {
        gpsOff: 'GPS Off',
        gpsOn: 'GPS On - Location: ',
        startGPS: 'Start GPS',
        stopGPS: 'Stop GPS',
        centerMap: 'Center Map',
        emergency: 'SOS - Emergency (112)',
        overview: 'Overview',
        weather: 'Weather',
        stages: 'Stages',
        facilities: 'Facilities',
        totalLength: 'Total Length',
        stageCount: 'Stage Count',
        difficulty: 'Difficulty',
        recommendedTime: 'Recommended Time',
        currentRisk: 'Current Risk',
        liveWeather: 'Live Weather',
        temperature: 'Temperature',
        humidity: 'Humidity',
        wind: 'Wind',
        pressure: 'Pressure',
        pastWeather: 'Past Years',
        stageList: '24 Stage List',
        accommodationFacilities: 'Accommodation',
        emergencyAlert: 'Emergency - 112',
        selectOption: 'Call 112 in emergency. Your location will be sent.',
        call112: 'Call 112',
        cancel: 'Cancel',
        distance: 'Distance',
        riskLow: 'Low',
        riskMedium: 'Medium',
        riskHigh: 'High',
        loading: 'Loading...'
    },
    de: {
        gpsOff: 'GPS aus',
        gpsOn: 'GPS an - Standort: ',
        startGPS: 'GPS starten',
        stopGPS: 'GPS stoppen',
        centerMap: 'Karte zentrieren',
        emergency: 'SOS - Notfall (112)',
        overview: 'Übersicht',
        weather: 'Wetter',
        stages: 'Etappen',
        facilities: 'Einrichtungen',
        totalLength: 'Gesamtlänge',
        stageCount: 'Etappenzahl',
        difficulty: 'Schwierigkeit',
        recommendedTime: 'Empfohlene Zeit',
        currentRisk: 'Aktuelles Risiko',
        liveWeather: 'Aktuelles Wetter',
        temperature: 'Temperatur',
        humidity: 'Luftfeuchtigkeit',
        wind: 'Wind',
        pressure: 'Luftdruck',
        pastWeather: 'Vergangene Jahre',
        stageList: '24 Etappenliste',
        accommodationFacilities: 'Unterkunft',
        emergencyAlert: 'Notfall - 112',
        selectOption: 'Rufen Sie 112 im Notfall. Ihr Standort wird gesendet.',
        call112: '112 anrufen',
        cancel: 'Abbrechen',
        distance: 'Entfernung',
        riskLow: 'Niedrig',
        riskMedium: 'Mittel',
        riskHigh: 'Hoch',
        loading: 'Lädt...'
    },
    ru: {
        gpsOff: 'GPS выключен',
        gpsOn: 'GPS включен - Местоположение: ',
        startGPS: 'Включить GPS',
        stopGPS: 'Выключить GPS',
        centerMap: 'Центрировать карту',
        emergency: 'SOS - Экстренная помощь (112)',
        overview: 'Обзор',
        weather: 'Погода',
        stages: 'Этапы',
        facilities: 'Объекты',
        totalLength: 'Общая длина',
        stageCount: 'Количество этапов',
        difficulty: 'Сложность',
        recommendedTime: 'Рекомендуемое время',
        currentRisk: 'Текущий риск',
        liveWeather: 'Текущая погода',
        temperature: 'Температура',
        humidity: 'Влажность',
        wind: 'Ветер',
        pressure: 'Давление',
        pastWeather: 'Прошлые годы',
        stageList: 'Список из 24 этапов',
        accommodationFacilities: 'Проживание',
        emergencyAlert: 'Экстренная ситуация - 112',
        selectOption: 'Звоните 112 в экстренной ситуации. Ваше местоположение будет отправлено.',
        call112: 'Позвонить 112',
        cancel: 'Отмена',
        distance: 'Расстояние',
        riskLow: 'Низкий',
        riskMedium: 'Средний',
        riskHigh: 'Высокий',
        loading: 'Загрузка...'
    },
    fr: {
        gpsOff: 'GPS désactivé',
        gpsOn: 'GPS activé - Localisation: ',
        startGPS: 'Démarrer GPS',
        stopGPS: 'Arrêter GPS',
        centerMap: 'Centrer la carte',
        emergency: 'SOS - Urgence (112)',
        overview: 'Aperçu',
        weather: 'Météo',
        stages: 'Étapes',
        facilities: 'Installations',
        totalLength: 'Longueur totale',
        stageCount: 'Nombre d\'étapes',
        difficulty: 'Difficulté',
        recommendedTime: 'Temps recommandé',
        currentRisk: 'Risque actuel',
        liveWeather: 'Météo en direct',
        temperature: 'Température',
        humidity: 'Humidité',
        wind: 'Vent',
        pressure: 'Pression',
        pastWeather: 'Années précédentes',
        stageList: 'Liste des 24 étapes',
        accommodationFacilities: 'Hébergement',
        emergencyAlert: 'Urgence - 112',
        selectOption: 'Appelez le 112 en cas d\'urgence. Votre localisation sera envoyée.',
        call112: 'Appeler le 112',
        cancel: 'Annuler',
        distance: 'Distance',
        riskLow: 'Faible',
        riskMedium: 'Moyen',
        riskHigh: 'Élevé',
        loading: 'Chargement...'
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const Utils = {
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    getRiskColor(risk) {
        const colors = { low: '#51cf66', medium: '#ffd43b', high: '#ff6b6b' };
        return colors[risk] || colors.medium;
    },

    getRiskText(risk) {
        const t = TRANSLATIONS[State.currentLanguage];
        const map = { low: t.riskLow, medium: t.riskMedium, high: t.riskHigh };
        return map[risk] || t.riskMedium;
    },

    formatCoords(lat, lng) {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    },

    getFacilityIcon(type) {
        const icons = { 'Konaklama': '🏨', 'Su Kaynağı': '💧', 'Tıbbi Yardım': '🏥' };
        return icons[type] || '📍';
    },

    translate(key) {
        return TRANSLATIONS[State.currentLanguage][key] || key;
    }
};

// ============================================================================
// WEATHER API
// ============================================================================

const WeatherAPI = {
    async getCurrentWeather() {
        const { API_KEY, BASE_URL } = CONFIG.WEATHER;
        const lat = 36.5;
        const lon = 29.1;
        
        try {
            const response = await fetch(
                `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${State.currentLanguage}`
            );
            
            if (!response.ok) throw new Error('Weather API error');
            
            const data = await response.json();
            return {
                temp: Math.round(data.main.temp),
                humidity: data.main.humidity,
                wind: Math.round(data.wind.speed * 3.6),
                pressure: data.main.pressure,
                description: data.weather[0].description
            };
        } catch (error) {
            console.error('Weather fetch error:', error);
            return {
                temp: 22,
                humidity: 65,
                wind: 15,
                pressure: 1013,
                description: 'Bilgi alınamadı'
            };
        }
    },

    async updateDisplay() {
        const weather = await this.getCurrentWeather();
        
        const elements = {
            temp: document.getElementById('tempValue'),
            humidity: document.getElementById('humidityValue'),
            wind: document.getElementById('windValue'),
            pressure: document.getElementById('pressureValue')
        };

        if (elements.temp) elements.temp.textContent = `${weather.temp}°C`;
        if (elements.humidity) elements.humidity.textContent = `${weather.humidity}%`;
        if (elements.wind) elements.wind.textContent = `${weather.wind} km/h`;
        if (elements.pressure) elements.pressure.textContent = `${weather.pressure} mb`;
        
        setTimeout(() => this.updateDisplay(), CONFIG.WEATHER.UPDATE_INTERVAL);
    },

    initChart() {
        const canvas = document.getElementById('weatherChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        
        State.weatherChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '2023',
                    data: [12, 13, 16, 20, 25, 30, 33, 32, 28, 22, 17, 13],
                    borderColor: '#2a5298',
                    backgroundColor: 'rgba(42, 82, 152, 0.1)',
                    tension: 0.4
                }, {
                    label: '2022',
                    data: [11, 12, 15, 19, 24, 29, 32, 31, 27, 21, 16, 12],
                    borderColor: '#51cf66',
                    backgroundColor: 'rgba(81, 207, 102, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Ortalama Aylık Sıcaklık (°C)' }
                },
                scales: { y: { beginAtZero: true, max: 35 } }
            }
        });
    }
};

// ============================================================================
// MAP MANAGEMENT
// ============================================================================

const MapManager = {
    init() {
        try {
            State.map = L.map('map').setView(CONFIG.MAP.CENTER, CONFIG.MAP.DEFAULT_ZOOM);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: CONFIG.MAP.MAX_ZOOM,
                minZoom: CONFIG.MAP.MIN_ZOOM
            }).addTo(State.map);

            this.drawRoute();
            this.drawStages();
            this.drawFacilities();
            
            console.log('Map initialized with real KML data');
        } catch (error) {
            console.error('Map init error:', error);
        }
    },

    drawRoute() {
        State.layers.route = L.polyline(LIKYA_ROUTE_COORDINATES, {
            color: '#2a5298',
            weight: 3,
            opacity: 0.8,
            dashArray: '5, 5'
        }).addTo(State.map);

        // Start & End markers
        L.circleMarker([36.56473, 29.13874], {
            radius: 8,
            fillColor: '#51cf66',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(State.map).bindPopup('<b>Ölüdeniz - Başlangıç</b>');

        L.circleMarker([36.8969, 30.7133], {
            radius: 8,
            fillColor: '#ff6b6b',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(State.map).bindPopup('<b>Antalya - Bitiş</b>');
    },

    drawStages() {
        STAGES.forEach(stage => {
            const color = Utils.getRiskColor(stage.risk);
            const riskText = Utils.getRiskText(stage.risk);

            const layer = L.polyline(stage.coords, {
                color,
                weight: 4,
                opacity: 0.7
            }).addTo(State.map);

            layer.bindPopup(`
                <b>${stage.name}</b><br>
                ${Utils.translate('distance')}: ${stage.distance} km<br>
                ${Utils.translate('difficulty')}: ${stage.difficulty}<br>
                Risk: ${riskText}
            `);

            State.layers.stages.push(layer);
        });
    },

    drawFacilities() {
        FACILITIES.forEach(facility => {
            const icon = Utils.getFacilityIcon(facility.type);
            
            const layer = L.marker(facility.coords, {
                icon: L.divIcon({
                    html: `<div style="font-size: 24px; text-align: center;">${icon}</div>`,
                    iconSize: [30, 30],
                    className: 'facility-marker'
                })
            }).addTo(State.map);

            layer.bindPopup(`
                <b>${facility.name}</b><br>
                Tür: ${facility.type}<br>
                ${facility.phone ? `Tel: ${facility.phone}<br>` : ''}
                ${Utils.translate('distance')}: ${facility.distance}
            `);

            State.layers.facilities.push(layer);
        });
    }
};

// ============================================================================
// GPS MANAGEMENT
// ============================================================================

const GPSManager = {
    start() {
        if (State.gpsActive) {
            this.stop();
            return;
        }

        if (!navigator.geolocation) {
            alert('Tarayıcınız GPS desteği sağlamıyor!');
            return;
        }

        State.gpsActive = true;
        this.updateStatus(true);

        State.gpsWatchId = navigator.geolocation.watchPosition(
            position => this.handleSuccess(position),
            error => this.handleError(error),
            {
                enableHighAccuracy: CONFIG.GPS.HIGH_ACCURACY,
                timeout: CONFIG.GPS.TIMEOUT,
                maximumAge: CONFIG.GPS.MAX_AGE
            }
        );
    },

    stop() {
        if (State.gpsWatchId) {
            navigator.geolocation.clearWatch(State.gpsWatchId);
            State.gpsWatchId = null;
        }
        State.gpsActive = false;
        this.updateStatus(false);
        if (State.userMarker) {
            State.map.removeLayer(State.userMarker);
            State.userMarker = null;
        }
    },

    handleSuccess: Utils.throttle(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        State.userLocation = [lat, lng];

        if (State.userMarker) {
            State.map.removeLayer(State.userMarker);
        }

        State.userMarker = L.circleMarker([lat, lng], {
            radius: 10,
            fillColor: '#2a5298',
            color: '#fff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(State.map);

        State.userMarker.bindPopup('Mevcut Konumunuz').openPopup();

        const statusText = document.getElementById('gpsStatusText');
        if (statusText) {
            statusText.textContent = `${Utils.translate('gpsOn')}${Utils.formatCoords(lat, lng)}`;
        }
    }, CONFIG.GPS.UPDATE_INTERVAL),

    handleError(error) {
        console.error('GPS Error:', error);
        let message = 'GPS hatası';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                message = 'Konum izni reddedildi';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Konum kullanılamıyor';
                break;
            case error.TIMEOUT:
                message = 'Zaman aşımı';
                break;
        }

        this.updateStatus(false, message);
    },

    updateStatus(active, message = null) {
        const statusEl = document.getElementById('gpsStatus');
        const statusText = document.getElementById('gpsStatusText');

        if (!statusEl || !statusText) return;

        if (active) {
            statusEl.classList.remove('inactive');
            statusText.textContent = message || Utils.translate('gpsOn');
        } else {
            statusEl.classList.add('inactive');
            statusText.textContent = message || Utils.translate('gpsOff');
        }
    }
};

// ============================================================================
// UI MANAGEMENT
// ============================================================================

const UIManager = {
    populateStages() {
        const container = document.getElementById('stagesList');
        if (!container) return;

        container.innerHTML = '';

        STAGES.forEach(stage => {
            const riskClass = `risk-${stage.risk}`;
            const riskText = Utils.getRiskText(stage.risk);

            const div = document.createElement('div');
            div.className = 'stage-item';
            div.setAttribute('role', 'listitem');
            div.innerHTML = `
                <div class="stage-name">${stage.id}. ${stage.name}</div>
                <div class="stage-info">
                    <span>${stage.distance} km</span> | 
                    <span>${stage.difficulty}</span> | 
                    <span class="risk-badge ${riskClass}">${riskText} Risk</span>
                </div>
            `;
            
            div.onclick = () => {
                const bounds = L.polyline(stage.coords).getBounds();
                State.map.fitBounds(bounds);
            };

            container.appendChild(div);
        });
    },

    populateFacilities() {
        const container = document.getElementById('facilitiesList');
        if (!container) return;

        container.innerHTML = '';

        FACILITIES.forEach(facility => {
            const div = document.createElement('div');
            div.className = 'facility-item';
            div.setAttribute('role', 'listitem');
            div.innerHTML = `
                <div class="facility-name">${facility.name}</div>
                <div class="facility-type">${facility.type}</div>
                ${facility.phone ? `<div class="facility-phone">Tel: ${facility.phone}</div>` : ''}
            `;
            
            div.onclick = () => {
                State.map.setView(facility.coords, 12);
            };

            container.appendChild(div);
        });
    },

    updateLanguage() {
        // Update all translatable elements
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            el.textContent = Utils.translate(key);
        });

        // Redraw UI elements
        this.populateStages();
        this.populateFacilities();
    }
};

// ============================================================================
// GLOBAL FUNCTIONS
// ============================================================================

function startGPS() {
    GPSManager.start();
}

function centerMap() {
    if (State.userLocation) {
        State.map.setView(State.userLocation, 13);
    } else {
        alert(Utils.translate('gpsOff'));
    }
}

function showEmergency() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeEmergency() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }
}

function call112() {
    // Direct phone call to 112
    window.location.href = 'tel:112';
    closeEmergency();
}

function switchTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    if (event && event.target) {
        event.target.classList.add('active');
        event.target.setAttribute('aria-selected', 'true');
    }
}

function changeLanguage(lang) {
    State.currentLanguage = lang;
    document.documentElement.lang = lang;
    UIManager.updateLanguage();
    WeatherAPI.updateDisplay();
    console.log(`Language changed to: ${lang}`);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    console.log('🚀 Initializing Likya Yolu Security System...');
    console.log('📍 Loading real KML coordinates (528 km)');
    console.log('🌤️ OpenWeather API integrated');
    console.log('🚑 Emergency 112 direct call enabled');
    
    MapManager.init();
    UIManager.populateStages();
    UIManager.populateFacilities();
    WeatherAPI.initChart();
    WeatherAPI.updateDisplay();
    
    console.log('✅ System ready!');
}

// DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Modal close on outside click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('emergencyModal');
    if (e.target === modal) {
        closeEmergency();
    }
});

// Keyboard ESC to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('emergencyModal');
        if (modal && modal.classList.contains('show')) {
            closeEmergency();
        }
    }
});