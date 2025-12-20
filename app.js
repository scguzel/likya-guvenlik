// Likya Yolu Güvenlik Sistemi - Optimized JavaScript

'use strict';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const CONFIG = {
    MAP: {
        CENTER: [36.7, 29.3],
        DEFAULT_ZOOM: 8,
        MIN_ZOOM: 6,
        MAX_ZOOM: 19
    },
    GPS: {
        UPDATE_INTERVAL: 5000, // 5 seconds
        HIGH_ACCURACY: true,
        TIMEOUT: 10000,
        MAX_AGE: 0
    },
    WEATHER: {
        UPDATE_INTERVAL: 1800000 // 30 minutes
    },
    API: {
        BASE_URL: 'http://localhost:5000/api',
        TIMEOUT: 5000
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
// DATA - Likya Yolu Stages
// ============================================================================

const STAGES = [
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

const FACILITIES = [
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

const TRANSLATIONS = {
    tr: {
        gpsOff: 'GPS Kapalı',
        gpsOn: 'GPS Açık - Konum: ',
        startGPS: 'GPS\'i Başlat',
        stopGPS: 'GPS\'i Durdur',
        riskLow: 'Düşük',
        riskMedium: 'Orta',
        riskHigh: 'Yüksek'
    },
    en: {
        gpsOff: 'GPS Off',
        gpsOn: 'GPS On - Location: ',
        startGPS: 'Start GPS',
        stopGPS: 'Stop GPS',
        riskLow: 'Low',
        riskMedium: 'Medium',
        riskHigh: 'High'
    }
    // Add more languages as needed
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for GPS updates
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

    // Get risk color
    getRiskColor(risk) {
        const colors = {
            low: '#51cf66',
            medium: '#ffd43b',
            high: '#ff6b6b'
        };
        return colors[risk] || colors.medium;
    },

    // Get risk text
    getRiskText(risk, lang = 'tr') {
        const texts = TRANSLATIONS[lang];
        const riskMap = {
            low: texts.riskLow,
            medium: texts.riskMedium,
            high: texts.riskHigh
        };
        return riskMap[risk] || texts.riskMedium;
    },

    // Format coordinates
    formatCoords(lat, lng) {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    },

    // Get facility icon
    getFacilityIcon(type) {
        const icons = {
            'Konaklama': '🏨',
            'Su Kaynağı': '💧',
            'Tıbbi Yardım': '🏥'
        };
        return icons[type] || '📍';
    }
};

// ============================================================================
// MAP INITIALIZATION
// ============================================================================

const MapManager = {
    init() {
        try {
            State.map = L.map('map', {
                zoomControl: true,
                attributionControl: true
            }).setView(CONFIG.MAP.CENTER, CONFIG.MAP.DEFAULT_ZOOM);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: CONFIG.MAP.MAX_ZOOM,
                minZoom: CONFIG.MAP.MIN_ZOOM
            }).addTo(State.map);

            this.drawRoute();
            this.drawStages();
            this.drawFacilities();

            console.log('Map initialized successfully');
        } catch (error) {
            console.error('Map initialization error:', error);
            this.showError('Harita yüklenemedi. Lütfen sayfayı yenileyin.');
        }
    },

    drawRoute() {
        const routeCoords = STAGES.flatMap(stage => stage.coords);
        
        State.layers.route = L.polyline(routeCoords, {
            color: '#2a5298',
            weight: 3,
            opacity: 0.8,
            dashArray: '5, 5'
        }).addTo(State.map);

        // Start marker
        L.circleMarker([36.6167, 29.1167], {
            radius: 8,
            fillColor: '#51cf66',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(State.map).bindPopup('<b>Fethiye - Başlangıç</b>');

        // End marker
        L.circleMarker([36.87, 30.47], {
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
            const riskText = Utils.getRiskText(stage.risk, State.currentLanguage);

            const layer = L.polyline(stage.coords, {
                color,
                weight: 4,
                opacity: 0.7
            }).addTo(State.map);

            layer.bindPopup(`
                <b>${stage.name}</b><br>
                Mesafe: ${stage.distance} km<br>
                Zorluk: ${stage.difficulty}<br>
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
                Mesafe: ${facility.distance}
            `);

            State.layers.facilities.push(layer);
        });
    },

    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'map-notification error';
        notification.textContent = message;
        notification.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
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

        const options = {
            enableHighAccuracy: CONFIG.GPS.HIGH_ACCURACY,
            timeout: CONFIG.GPS.TIMEOUT,
            maximumAge: CONFIG.GPS.MAX_AGE
        };

        State.gpsWatchId = navigator.geolocation.watchPosition(
            position => this.handleSuccess(position),
            error => this.handleError(error),
            options
        );

        console.log('GPS started');
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

        console.log('GPS stopped');
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
            statusText.textContent = `GPS Açık - ${Utils.formatCoords(lat, lng)}`;
        }
    }, CONFIG.GPS.UPDATE_INTERVAL),

    handleError(error) {
        console.error('GPS Error:', error);
        let message = 'GPS hatası oluştu';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                message = 'Konum izni reddedildi';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Konum bilgisi kullanılamıyor';
                break;
            case error.TIMEOUT:
                message = 'Konum isteği zaman aşımına uğradı';
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
            statusText.textContent = message || 'GPS Açık';
        } else {
            statusEl.classList.add('inactive');
            statusText.textContent = message || 'GPS Kapalı';
        }
    }
};

// ============================================================================
// WEATHER MANAGEMENT
// ============================================================================

const WeatherManager = {
    async update() {
        try {
            // Simulated weather data
            const data = {
                temp: 22,
                humidity: 65,
                wind: 15,
                pressure: 1013
            };

            this.updateDisplay(data);
            
            // Schedule next update
            setTimeout(() => this.update(), CONFIG.WEATHER.UPDATE_INTERVAL);
        } catch (error) {
            console.error('Weather update error:', error);
        }
    },

    updateDisplay(data) {
        const elements = {
            temp: document.getElementById('tempValue'),
            humidity: document.getElementById('humidityValue'),
            wind: document.getElementById('windValue'),
            pressure: document.getElementById('pressureValue')
        };

        if (elements.temp) elements.temp.textContent = `${data.temp}°C`;
        if (elements.humidity) elements.humidity.textContent = `${data.humidity}%`;
        if (elements.wind) elements.wind.textContent = `${data.wind} km/h`;
        if (elements.pressure) elements.pressure.textContent = `${data.pressure} mb`;
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
                datasets: [
                    {
                        label: '2023',
                        data: [12, 13, 16, 20, 25, 30, 33, 32, 28, 22, 17, 13],
                        borderColor: '#2a5298',
                        backgroundColor: 'rgba(42, 82, 152, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: '2022',
                        data: [11, 12, 15, 19, 24, 29, 32, 31, 27, 21, 16, 12],
                        borderColor: '#51cf66',
                        backgroundColor: 'rgba(81, 207, 102, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Ortalama Aylık Sıcaklık (°C)'
                    }
                },
                scales: {
                    y: { beginAtZero: true, max: 35 }
                }
            }
        });
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
            const riskText = Utils.getRiskText(stage.risk, State.currentLanguage);

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
            `;
            
            div.onclick = () => {
                State.map.setView(facility.coords, 12);
            };

            container.appendChild(div);
        });
    }
};

// ============================================================================
// GLOBAL FUNCTIONS (called from HTML)
// ============================================================================

function startGPS() {
    GPSManager.start();
}

function centerMap() {
    if (State.userLocation) {
        State.map.setView(State.userLocation, 13);
    } else {
        alert('Konumunuz henüz alınamadı. Lütfen GPS\'i başlatın.');
    }
}

function showEmergency() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus first button in modal
        const firstButton = modal.querySelector('button');
        if (firstButton) firstButton.focus();
    }
}

function closeEmergency() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }
}

function callEmergency(type) {
    const numbers = {
        police: '155',
        ambulance: '112',
        mountain: '177'
    };

    const typeNames = {
        police: 'Polis',
        ambulance: 'Ambulans',
        mountain: 'Dağ Kurtarma'
    };

    const location = State.userLocation 
        ? `Konum: ${Utils.formatCoords(State.userLocation[0], State.userLocation[1])}`
        : 'Konum bilinmiyor';
    
    alert(`${typeNames[type]} çağrısı yapılıyor...\n${location}`);
    
    // In production, use: window.location.href = `tel:${numbers[type]}`;
    
    closeEmergency();
}

function switchTab(tabName, event) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
        event.target.setAttribute('aria-selected', 'true');
    }
}

function changeLanguage(lang) {
    State.currentLanguage = lang;
    document.documentElement.lang = lang;
    
    // Update UI with new language
    // This is a placeholder - implement full translation logic as needed
    console.log(`Language changed to: ${lang}`);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    console.log('Initializing Likya Yolu Security System...');
    
    // Initialize map
    MapManager.init();
    
    // Populate UI
    UIManager.populateStages();
    UIManager.populateFacilities();
    
    // Initialize weather
    WeatherManager.initChart();
    WeatherManager.update();
    
    console.log('✓ Initialization complete');
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

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('emergencyModal');
        if (modal && modal.classList.contains('show')) {
            closeEmergency();
        }
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        State,
        MapManager,
        GPSManager,
        WeatherManager,
        UIManager
    };
}