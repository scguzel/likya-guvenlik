// Likya Yolu Güvenlik Sistemi - Seçenek B: PWA + Dark Mode + Elevation
'use strict';

// ============================================================================
// SERVICE WORKER REGISTRATION (PWA)
// ============================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker registered'))
            .catch(err => console.log('❌ SW registration failed:', err));
    });
}

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
        UPDATE_INTERVAL: 1800000,
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
    elevationChart: null,
    darkMode: localStorage.getItem('darkMode') === 'true',
    layers: {
        route: null,
        stages: [],
        facilities: [],
        waterSources: []
    }
};

// ============================================================================
// STAGES DATA WITH ELEVATION
// ============================================================================

const STAGES = [
    { id: 1, name: 'Ölüdeniz - Kabak', distance: 15, difficulty: 'Kolay', elevation: 300, elevationGain: 450, elevationLoss: 380, risk: 'low', coords: [[36.56473, 29.13874], [36.50516, 29.15486]] },
    { id: 2, name: 'Kabak - Faralya', distance: 18, difficulty: 'Orta', elevation: 450, elevationGain: 680, elevationLoss: 520, risk: 'medium', coords: [[36.50516, 29.15486], [36.46728, 29.12323]] },
    { id: 3, name: 'Faralya - Alınca', distance: 14, difficulty: 'Zor', elevation: 600, elevationGain: 890, elevationLoss: 650, risk: 'high', coords: [[36.46728, 29.12323], [36.402188, 29.134435]] },
    { id: 4, name: 'Alınca - Gey', distance: 16, difficulty: 'Orta', elevation: 400, elevationGain: 620, elevationLoss: 580, risk: 'medium', coords: [[36.402188, 29.134435], [36.336185, 29.202019]] },
    { id: 5, name: 'Gey - Kınık', distance: 17, difficulty: 'Orta', elevation: 350, elevationGain: 480, elevationLoss: 520, risk: 'low', coords: [[36.336185, 29.202019], [36.354826, 29.315061]] },
    { id: 6, name: 'Kınık - Patara', distance: 19, difficulty: 'Orta', elevation: 500, elevationGain: 720, elevationLoss: 680, risk: 'medium', coords: [[36.354826, 29.315061], [36.280936, 29.408318]] },
    { id: 7, name: 'Patara - Kalkan', distance: 20, difficulty: 'Kolay', elevation: 200, elevationGain: 320, elevationLoss: 340, risk: 'low', coords: [[36.280936, 29.408318], [36.273689, 29.320948]] },
    { id: 8, name: 'Kalkan - Bezirgan', distance: 22, difficulty: 'Kolay', elevation: 150, elevationGain: 280, elevationLoss: 290, risk: 'low', coords: [[36.273689, 29.320948], [36.262284, 29.418125]] },
    { id: 9, name: 'Bezirgan - Gökçeören', distance: 18, difficulty: 'Orta', elevation: 400, elevationGain: 650, elevationLoss: 590, risk: 'medium', coords: [[36.262284, 29.418125], [36.275763, 29.462322]] },
    { id: 10, name: 'Gökçeören - Çukurbağ', distance: 16, difficulty: 'Orta', elevation: 380, elevationGain: 580, elevationLoss: 560, risk: 'medium', coords: [[36.275763, 29.462322], [36.241378, 29.543008]] },
    { id: 11, name: 'Çukurbağ - Kaş', distance: 17, difficulty: 'Zor', elevation: 550, elevationGain: 820, elevationLoss: 780, risk: 'high', coords: [[36.241378, 29.543008], [36.240079, 29.67097]] },
    { id: 12, name: 'Kaş - Körmen Adası', distance: 14, difficulty: 'Orta', elevation: 420, elevationGain: 580, elevationLoss: 620, risk: 'medium', coords: [[36.240079, 29.67097], [36.199832, 29.639668]] }
];

// ============================================================================
// WATER SOURCES - 15+ LOCATIONS
// ============================================================================

const WATER_SOURCES = [
    { name: 'Ölüdeniz Çeşme', coords: [36.5849, 29.1144], type: 'Çeşme', quality: 'İyi' },
    { name: 'Kabak Pınar', coords: [36.5667, 29.0833], type: 'Doğal Kaynak', quality: 'Mükemmel' },
    { name: 'Faralya Su Deposu', coords: [36.5500, 29.0500], type: 'Depo', quality: 'İyi' },
    { name: 'Alınca Çeşme', coords: [36.5167, 28.9833], type: 'Çeşme', quality: 'İyi' },
    { name: 'Gey Köyü Çeşme', coords: [36.46728, 29.12323], type: 'Çeşme', quality: 'İyi' },
    { name: 'Kınık Pınar', coords: [36.354826, 29.315061], type: 'Doğal Kaynak', quality: 'Mükemmel' },
    { name: 'Patara Çeşme', coords: [36.280936, 29.408318], type: 'Çeşme', quality: 'İyi' },
    { name: 'Kalkan Çeşme', coords: [36.273689, 29.320948], type: 'Çeşme', quality: 'İyi' },
    { name: 'Bezirgan Sarnıç', coords: [36.262284, 29.418125], type: 'Sarnıç', quality: 'Orta' },
    { name: 'Gökçeören Pınar', coords: [36.275763, 29.462322], type: 'Doğal Kaynak', quality: 'Mükemmel' },
    { name: 'Kaş Çeşme Merkez', coords: [36.2001, 29.6400], type: 'Çeşme', quality: 'İyi' },
    { name: 'Üçağız Su Kaynağı', coords: [36.159247, 29.787096], type: 'Doğal Kaynak', quality: 'İyi' },
    { name: 'Demre Çeşme', coords: [36.197333, 29.847213], type: 'Çeşme', quality: 'İyi' },
    { name: 'Finike Pınar', coords: [36.300443, 30.073634], type: 'Doğal Kaynak', quality: 'Mükemmel' },
    { name: 'Adrasan Çeşme', coords: [36.276047, 30.41079], type: 'Çeşme', quality: 'İyi' },
    { name: 'Göynük Sarnıç', coords: [36.614042, 30.447094], type: 'Sarnıç', quality: 'Orta' }
];

// ============================================================================
// FACILITIES DATA
// ============================================================================

const FACILITIES = [
    { name: 'Fethiye Devlet Hastanesi', type: 'Tıbbi Yardım', coords: [36.6526, 29.1198], distance: '0 km', phone: '112' },
    { name: 'Ölüdeniz Sağlık Ocağı', type: 'Tıbbi Yardım', coords: [36.5849, 29.1144], distance: '15 km', phone: '112' },
    { name: 'Kaş Devlet Hastanesi', type: 'Tıbbi Yardım', coords: [36.1992, 29.6362], distance: '200 km', phone: '112' },
    { name: 'Antalya Eğitim Araştırma Hastanesi', type: 'Tıbbi Yardım', coords: [36.8969, 30.7133], distance: '450 km', phone: '112' },
    { name: 'Ölüdeniz Pansiyon', type: 'Konaklama', coords: [36.5849, 29.1144], distance: '15 km' },
    { name: 'Kabak Konaklama', type: 'Konaklama', coords: [36.5667, 29.0833], distance: '33 km' },
    { name: 'Faralya Konaklama', type: 'Konaklama', coords: [36.5500, 29.0500], distance: '47 km' },
    { name: 'Kaş Pansiyon', type: 'Konaklama', coords: [36.2001, 29.6400], distance: '200 km' },
    { name: 'Demre Konaklama', type: 'Konaklama', coords: [36.2444, 29.9850], distance: '300 km' }
];

// ============================================================================
// TRANSLATIONS
// ============================================================================

const TRANSLATIONS = {
    tr: {
        gpsOff: 'GPS Kapalı', gpsOn: 'GPS Açık - Konum: ', startGPS: 'GPS\'i Başlat', stopGPS: 'GPS\'i Durdur',
        centerMap: 'Konumuma Git', emergency: 'SOS - ACİL 112', overview: 'Genel', weather: 'Hava',
        stages: 'Etaplar', facilities: 'Tesisler', waterSources: 'Su Kaynakları',
        totalLength: 'Toplam Uzunluk', stageCount: 'Etap Sayısı', difficulty: 'Zorluk',
        elevation: 'Yükseklik', elevationGain: 'Tırmanış', elevationLoss: 'İniş',
        distance: 'Mesafe', riskLow: 'Düşük', riskMedium: 'Orta', riskHigh: 'Yüksek',
        darkMode: 'Karanlık Mod', copyCoords: 'Koordinatları Kopyala', call112: '112\'Yİ ARA',
        quality: 'Kalite', type: 'Tür', good: 'İyi', excellent: 'Mükemmel', medium: 'Orta'
    },
    en: {
        gpsOff: 'GPS Off', gpsOn: 'GPS On - Location: ', startGPS: 'Start GPS', stopGPS: 'Stop GPS',
        centerMap: 'Center Map', emergency: 'SOS - CALL 112', overview: 'Overview', weather: 'Weather',
        stages: 'Stages', facilities: 'Facilities', waterSources: 'Water Sources',
        totalLength: 'Total Length', stageCount: 'Stages', difficulty: 'Difficulty',
        elevation: 'Elevation', elevationGain: 'Climb', elevationLoss: 'Descent',
        distance: 'Distance', riskLow: 'Low', riskMedium: 'Medium', riskHigh: 'High',
        darkMode: 'Dark Mode', copyCoords: 'Copy Coordinates', call112: 'CALL 112',
        quality: 'Quality', type: 'Type', good: 'Good', excellent: 'Excellent', medium: 'Medium'
    }
};

// ============================================================================
// DARK MODE
// ============================================================================

const DarkMode = {
    init() {
        if (State.darkMode) {
            document.body.classList.add('dark-mode');
        }
        this.createToggle();
    },

    createToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'dark-mode-toggle';
        toggle.innerHTML = State.darkMode ? '☀️' : '🌙';
        toggle.title = Utils.translate('darkMode');
        toggle.onclick = () => this.toggle();
        document.body.appendChild(toggle);
    },

    toggle() {
        State.darkMode = !State.darkMode;
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', State.darkMode);
        
        const toggle = document.querySelector('.dark-mode-toggle');
        if (toggle) toggle.innerHTML = State.darkMode ? '☀️' : '🌙';
    }
};

// ============================================================================
// UTILITIES
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
        return { low: '#51cf66', medium: '#ffd43b', high: '#ff6b6b' }[risk] || '#ffd43b';
    },

    getRiskText(risk) {
        const t = TRANSLATIONS[State.currentLanguage];
        return { low: t.riskLow, medium: t.riskMedium, high: t.riskHigh }[risk] || t.riskMedium;
    },

    formatCoords(lat, lng) {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    },

    getFacilityIcon(type) {
        return { 'Konaklama': '🏨', 'Su Kaynağı': '💧', 'Tıbbi Yardım': '🏥' }[type] || '📍';
    },

    translate(key) {
        return TRANSLATIONS[State.currentLanguage][key] || key;
    },

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => alert('✅ Koordinatlar kopyalandı!'))
                .catch(() => this.fallbackCopy(text));
        } else {
            this.fallbackCopy(text);
        }
    },

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ Koordinatlar kopyalandı!');
    }
};

// ============================================================================
// ELEVATION CHART
// ============================================================================

const ElevationChart = {
    show(stage) {
        const modal = document.getElementById('elevationModal');
        if (!modal) {
            this.createModal();
        }
        
        this.updateChart(stage);
        document.getElementById('elevationModal').classList.add('show');
    },

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'elevationModal';
        modal.className = 'modal-custom';
        modal.innerHTML = `
            <div class="modal-content-custom" style="max-width: 600px;">
                <h3>📊 Yükseklik Profili</h3>
                <div id="elevationInfo" style="margin: 1rem 0;"></div>
                <canvas id="elevationChart"></canvas>
                <button class="btn-custom" onclick="closeElevationModal()" style="margin-top: 1rem;">Kapat</button>
            </div>
        `;
        document.body.appendChild(modal);
    },

    updateChart(stage) {
        const info = document.getElementById('elevationInfo');
        if (info) {
            info.innerHTML = `
                <strong>${stage.name}</strong><br>
                ${Utils.translate('distance')}: ${stage.distance} km<br>
                ${Utils.translate('elevationGain')}: ${stage.elevationGain}m<br>
                ${Utils.translate('elevationLoss')}: ${stage.elevationLoss}m
            `;
        }

        const canvas = document.getElementById('elevationChart');
        if (!canvas) return;

        if (State.elevationChart) {
            State.elevationChart.destroy();
        }

        // Simulated elevation profile
        const distances = [];
        const elevations = [];
        const points = 20;
        for (let i = 0; i <= points; i++) {
            distances.push((stage.distance / points * i).toFixed(1));
            elevations.push(
                Math.sin(i / points * Math.PI) * stage.elevation + 
                Math.random() * 50
            );
        }

        State.elevationChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: distances,
                datasets: [{
                    label: 'Yükseklik (m)',
                    data: elevations,
                    borderColor: '#2a5298',
                    backgroundColor: 'rgba(42, 82, 152, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Yükseklik Profili' }
                },
                scales: {
                    x: { title: { display: true, text: 'Mesafe (km)' } },
                    y: { title: { display: true, text: 'Yükseklik (m)' } }
                }
            }
        });
    }
};

// ============================================================================
// WEATHER API
// ============================================================================

const WeatherAPI = {
    async getCurrentWeather() {
        const { API_KEY, BASE_URL } = CONFIG.WEATHER;
        
        try {
            const response = await fetch(
                `${BASE_URL}/weather?lat=36.5&lon=29.1&appid=${API_KEY}&units=metric&lang=${State.currentLanguage}`
            );
            
            if (!response.ok) throw new Error('Weather API error');
            
            const data = await response.json();
            return {
                temp: Math.round(data.main.temp),
                humidity: data.main.humidity,
                wind: Math.round(data.wind.speed * 3.6),
                pressure: data.main.pressure
            };
        } catch (error) {
            console.error('Weather error:', error);
            return { temp: 22, humidity: 65, wind: 15, pressure: 1013 };
        }
    },

    async updateDisplay() {
        const weather = await this.getCurrentWeather();
        
        const els = {
            temp: document.getElementById('tempValue'),
            humidity: document.getElementById('humidityValue'),
            wind: document.getElementById('windValue'),
            pressure: document.getElementById('pressureValue')
        };

        if (els.temp) els.temp.textContent = `${weather.temp}°C`;
        if (els.humidity) els.humidity.textContent = `${weather.humidity}%`;
        if (els.wind) els.wind.textContent = `${weather.wind} km/h`;
        if (els.pressure) els.pressure.textContent = `${weather.pressure} mb`;
        
        setTimeout(() => this.updateDisplay(), CONFIG.WEATHER.UPDATE_INTERVAL);
    },

    initChart() {
        const canvas = document.getElementById('weatherChart');
        if (!canvas) return;

        State.weatherChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
                datasets: [{
                    label: '2023',
                    data: [12, 13, 16, 20, 25, 30, 33, 32, 28, 22, 17, 13],
                    borderColor: '#2a5298',
                    backgroundColor: 'rgba(42, 82, 152, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true, max: 35 } }
            }
        });
    }
};

// ============================================================================
// MAP MANAGER
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

            this.drawStages();
            this.drawFacilities();
            this.drawWaterSources();
            
            console.log('✅ Map ready with water sources');
        } catch (error) {
            console.error('Map error:', error);
        }
    },

    drawStages() {
        STAGES.forEach(stage => {
            const color = Utils.getRiskColor(stage.risk);

            const layer = L.polyline(stage.coords, {
                color,
                weight: 5,
                opacity: 0.8
            }).addTo(State.map);

            layer.bindPopup(`
                <div style="min-width: 200px;">
                    <h4 style="margin: 0 0 0.5rem 0;">${stage.name}</h4>
                    <p style="margin: 0.25rem 0;">
                        📏 ${stage.distance} km<br>
                        ⛰️ Tırmanış: ${stage.elevationGain}m<br>
                        ⬇️ İniş: ${stage.elevationLoss}m<br>
                        🎯 Zorluk: ${stage.difficulty}
                    </p>
                    <button onclick="showElevation(${stage.id})" class="btn-custom" style="margin-top: 0.5rem; padding: 0.5rem; font-size: 0.9rem;">
                        📊 Yükseklik Profili
                    </button>
                </div>
            `);

            State.layers.stages.push(layer);
        });
    },

    drawFacilities() {
        FACILITIES.forEach(facility => {
            const div = document.createElement('div');
            div.className = 'facility-item';
            div.innerHTML = `
                <div class="facility-name">${facility.name}</div>
                <div class="facility-type">${facility.type}</div>
            `;
            div.onclick = () => State.map.setView(facility.coords, 13);
            container.appendChild(div);
        });
    },

    populateWaterSources() {
        const container = document.getElementById('waterSourcesList');
        if (!container) return;

        container.innerHTML = '';

        WATER_SOURCES.forEach(source => {
            const div = document.createElement('div');
            div.className = 'water-item';
            div.innerHTML = `
                <div class="water-name">💧 ${source.name}</div>
                <div class="water-info">${source.type} - ${source.quality}</div>
            `;
            div.onclick = () => State.map.setView(source.coords, 14);
            container.appendChild(div);
        });
    }
};

// ============================================================================
// GLOBAL FUNCTIONS
// ============================================================================

function startGPS() { GPSManager.start(); }
function centerMap() {
    if (State.userLocation) {
        State.map.setView(State.userLocation, 13);
    } else {
        alert('GPS aktif değil');
    }
}

function showEmergency() {
    document.getElementById('emergencyModal').classList.add('show');
}

function closeEmergency() {
    document.getElementById('emergencyModal').classList.remove('show');
}

function call112() {
    if (State.userLocation) {
        const coords = Utils.formatCoords(State.userLocation[0], State.userLocation[1]);
        const smsBody = `ACİL DURUM - Likya Yolu\nKonum: ${coords}\nhttps://www.google.com/maps?q=${coords}`;
        
        // Try to open SMS app
        window.location.href = `sms:112?body=${encodeURIComponent(smsBody)}`;
        
        // Also copy to clipboard
        Utils.copyToClipboard(`${smsBody}`);
        
        setTimeout(() => {
            alert('📱 SMS uygulaması açıldı ve koordinatlar kopyalandı!\n\nŞimdi SMS\'i gönderin.');
        }, 500);
    } else {
        // Direct call
        window.location.href = 'tel:112';
    }
    closeEmergency();
}

function copyCoordinates() {
    if (State.userLocation) {
        const coords = Utils.formatCoords(State.userLocation[0], State.userLocation[1]);
        Utils.copyToClipboard(coords);
    } else {
        alert('GPS aktif değil');
    }
}

function showElevation(stageId) {
    const stage = STAGES.find(s => s.id === stageId);
    if (stage) {
        ElevationChart.show(stage);
    }
}

function closeElevationModal() {
    document.getElementById('elevationModal').classList.remove('show');
}

function switchTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const tab = document.getElementById(tabName);
    if (tab) tab.classList.add('active');
    
    if (event && event.target) event.target.classList.add('active');
}

function changeLanguage(lang) {
    State.currentLanguage = lang;
    document.documentElement.lang = lang;
    UIManager.populateStages();
    UIManager.populateFacilities();
    UIManager.populateWaterSources();
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    console.log('🚀 Likya Güvenlik v2.0 - PWA + Dark Mode + Elevation');
    
    DarkMode.init();
    MapManager.init();
    UIManager.populateStages();
    UIManager.populateFacilities();
    UIManager.populateWaterSources();
    WeatherAPI.initChart();
    WeatherAPI.updateDisplay();
    
    console.log('✅ System ready!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('emergencyModal');
    if (e.target === modal) closeEmergency();
    
    const elevModal = document.getElementById('elevationModal');
    if (e.target === elevModal) closeElevationModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEmergency();
        closeElevationModal();
    }
});
            const icon = Utils.getFacilityIcon(facility.type);
            
            L.marker(facility.coords, {
                icon: L.divIcon({
                    html: `<div style="font-size: 28px;">${icon}</div>`,
                    iconSize: [32, 32],
                    className: 'custom-marker'
                })
            }).addTo(State.map).bindPopup(`
                <strong>${facility.name}</strong><br>
                ${facility.type}${facility.phone ? `<br>Tel: ${facility.phone}` : ''}
            `);
        });
    },

    drawWaterSources() {
        WATER_SOURCES.forEach(source => {
            L.marker(source.coords, {
                icon: L.divIcon({
                    html: '<div style="font-size: 24px;">💧</div>',
                    iconSize: [28, 28],
                    className: 'water-marker'
                })
            }).addTo(State.map).bindPopup(`
                <strong>💧 ${source.name}</strong><br>
                Tür: ${source.type}<br>
                Kalite: ${source.quality}
            `);
        });
    }
};

// ============================================================================
// GPS MANAGER
// ============================================================================

const GPSManager = {
    start() {
        if (State.gpsActive) {
            this.stop();
            return;
        }

        if (!navigator.geolocation) {
            alert('GPS desteği yok!');
            return;
        }

        State.gpsActive = true;
        this.updateStatus(true);

        State.gpsWatchId = navigator.geolocation.watchPosition(
            pos => this.handleSuccess(pos),
            err => this.handleError(err),
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
            radius: 12,
            fillColor: '#2a5298',
            color: '#fff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(State.map);

        State.userMarker.bindPopup('📍 Konumunuz').openPopup();

        const statusText = document.getElementById('gpsStatusText');
        if (statusText) {
            statusText.textContent = `GPS: ${Utils.formatCoords(lat, lng)}`;
        }
    }, CONFIG.GPS.UPDATE_INTERVAL),

    handleError(error) {
        console.error('GPS error:', error);
        this.updateStatus(false, 'GPS hatası');
    },

    updateStatus(active, message = null) {
        const statusEl = document.getElementById('gpsStatus');
        const statusText = document.getElementById('gpsStatusText');

        if (!statusEl || !statusText) return;

        if (active) {
            statusEl.classList.remove('inactive');
            statusText.textContent = message || 'GPS Açık';
        } else {
            statusEl.classList.add('inactive');
            statusText.textContent = message || 'GPS Kapalı';
        }
    }
};

// ============================================================================
// UI MANAGER
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
            div.innerHTML = `
                <div class="stage-name">${stage.id}. ${stage.name}</div>
                <div class="stage-info">
                    ${stage.distance} km | ${stage.difficulty} | 
                    <span class="risk-badge ${riskClass}">${riskText}</span>
                </div>
                <div class="stage-elevation">
                    ⛰️ ${stage.elevationGain}m ⬇️ ${stage.elevationLoss}m
                </div>
            `;
            
            div.onclick = () => {
                State.map.fitBounds(L.polyline(stage.coords).getBounds());
            };

            container.appendChild(div);
        });
    },

    populateFacilities() {
        const container = document.getElementById('facilitiesList');
        if (!container) return;

        container.innerHTML = '';

        FACILITIES.forEach(facility => {