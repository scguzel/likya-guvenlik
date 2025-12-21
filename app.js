// Likya Yolu Gelişmiş Harita Sistemi - 32 ETAP TAM LİSTE
// GPX Entegrasyonu + Yükseklik Profili + Su Kaynakları

'use strict';

// ============================================================================
// GLOBAL STATE
// ============================================================================

const State = {
    map: null,
    activeStage: null,
    gpsActive: false,
    gpsWatchId: null,
    userMarker: null,
    currentLayer: 'street',
    layers: {
        street: null,
        satellite: null
    },
    gpxLayers: [],
    waterMarkers: [],
    stageMarkers: []
};

// ============================================================================
// 32 ETAP TAM LİSTESİ - LİKYA YOLU
// ============================================================================

const ALL_STAGES = [
    { id: 1, name: 'Fethiye - Ölüdeniz', distance: 15, difficulty: 'Kolay', risk: 'low', group: 1 },
    { id: 2, name: 'Ölüdeniz - Kabak', distance: 18, difficulty: 'Orta', risk: 'medium', group: 1 },
    { id: 3, name: 'Kabak - Faralya', distance: 14, difficulty: 'Zor', risk: 'high', group: 1 },
    { id: 4, name: 'Faralya - Geyikbayırı', distance: 16, difficulty: 'Orta', risk: 'medium', group: 1 },
    { id: 5, name: 'Geyikbayırı - Alınca', distance: 17, difficulty: 'Orta', risk: 'low', group: 1 },
    { id: 6, name: 'Alınca - Çıralı', distance: 19, difficulty: 'Orta', risk: 'medium', group: 1 },
    { id: 7, name: 'Çıralı - Antalya', distance: 20, difficulty: 'Kolay', risk: 'low', group: 1 },
    { id: 8, name: 'Antalya - Kemer', distance: 22, difficulty: 'Kolay', risk: 'low', group: 1 },
    { id: 9, name: 'Kemer - Beldibi', distance: 18, difficulty: 'Orta', risk: 'medium', group: 2 },
    { id: 10, name: 'Beldibi - Göynük', distance: 16, difficulty: 'Orta', risk: 'medium', group: 2 },
    { id: 11, name: 'Göynük - Tekirova', distance: 17, difficulty: 'Zor', risk: 'high', group: 2 },
    { id: 12, name: 'Tekirova - Phaselis', distance: 14, difficulty: 'Orta', risk: 'medium', group: 2 },
    { id: 13, name: 'Phaselis - Çamyuva', distance: 15, difficulty: 'Kolay', risk: 'low', group: 2 },
    { id: 14, name: 'Çamyuva - Kumluca', distance: 19, difficulty: 'Orta', risk: 'medium', group: 2 },
    { id: 15, name: 'Kumluca - Adrasan', distance: 17, difficulty: 'Orta', risk: 'medium', group: 2 },
    { id: 16, name: 'Adrasan - Olympos', distance: 16, difficulty: 'Zor', risk: 'high', group: 2 },
    { id: 17, name: 'Olympos - Çıralı', distance: 18, difficulty: 'Orta', risk: 'medium', group: 3 },
    { id: 18, name: 'Çıralı - Ulupınar', distance: 15, difficulty: 'Kolay', risk: 'low', group: 3 },
    { id: 19, name: 'Ulupınar - Kaş', distance: 20, difficulty: 'Orta', risk: 'medium', group: 3 },
    { id: 20, name: 'Kaş - Kalkan', distance: 17, difficulty: 'Orta', risk: 'medium', group: 3 },
    { id: 21, name: 'Kalkan - Patara', distance: 18, difficulty: 'Kolay', risk: 'low', group: 3 },
    { id: 22, name: 'Patara - Xanthos', distance: 16, difficulty: 'Orta', risk: 'medium', group: 3 },
    { id: 23, name: 'Xanthos - Letoon', distance: 14, difficulty: 'Kolay', risk: 'low', group: 3 },
    { id: 24, name: 'Letoon - Tlos', distance: 19, difficulty: 'Orta', risk: 'medium', group: 3 },
    { id: 25, name: 'Tlos - Saklıkent', distance: 17, difficulty: 'Zor', risk: 'high', group: 3 },
    { id: 26, name: 'Saklıkent - Ölüdeniz', distance: 18, difficulty: 'Orta', risk: 'medium', group: 3 },
    { id: 27, name: 'Ölüdeniz - Butterfly Valley', distance: 15, difficulty: 'Kolay', risk: 'low', group: 3 },
    { id: 28, name: 'Butterfly Valley - Gemile', distance: 16, difficulty: 'Orta', risk: 'medium', group: 3 },
    { id: 29, name: 'Gemile - Sarsala', distance: 17, difficulty: 'Orta', risk: 'medium', group: 3 },
    { id: 30, name: 'Sarsala - Akkaya', distance: 19, difficulty: 'Zor', risk: 'high', group: 3 },
    { id: 31, name: 'Akkaya - Sidyma', distance: 18, difficulty: 'Orta', risk: 'medium', group: 3 },
    { id: 32, name: 'Sidyma - Antalya', distance: 16, difficulty: 'Kolay', risk: 'low', group: 3 }
];

// ============================================================================
// GPX BÖLÜM VERİLERİ (3 GPX Dosyası)
// ============================================================================

const GPX_SECTIONS = [
    {
        id: 1,
        name: 'Bölüm 1: Ovacık - Kaş',
        file: 'bolum1.gpx',
        distance: 140,
        color: '#dc2626',
        style: 'solid',
        difficulty: 'Orta',
        waterSources: 8,
        elevation: { gain: 2800, loss: 2600 },
        warning: '✅ Popüler rota, su kaynağı bol ama dik çıkışlar mevcut.',
        elevationData: [439, 554, 771, 766, 730, 612, 300, 150, 76],
        stages: [1, 2, 3, 4, 5, 6, 7, 8]
    },
    {
        id: 2,
        name: 'Bölüm 2: Kaş - Adrasan',
        file: 'bolum2.gpx',
        distance: 170,
        color: '#2563eb',
        style: 'dashed',
        difficulty: 'Zor',
        waterSources: 3,
        elevation: { gain: 3200, loss: 3400 },
        warning: '⚠️ DİKKAT: Su kaynağı EN KISITLI ve RİSKLİ etap. Hazırlıklı olun!',
        elevationData: [10, 100, 300, 558, 850, 1200, 800, 400, 240],
        stages: [9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
        id: 3,
        name: 'Bölüm 3: Adrasan - Hisarçandır',
        file: 'bolum3.gpx',
        distance: 218,
        color: '#16a34a',
        style: 'dotted',
        difficulty: 'Orta-Zor',
        waterSources: 5,
        elevation: { gain: 4100, loss: 3900 },
        warning: '🏔️ Yüksek irtifa geçişi ve ormanlık alan. Hava durumuna dikkat!',
        elevationData: [240, 460, 680, 1020, 1250, 1800, 1400, 1100, 873],
        stages: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]
    }
];

// ============================================================================
// WATER SOURCES
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

// ============================================================================
// HOSPITALS
// ============================================================================

const HOSPITALS = [
    { 
        name: 'Fethiye Devlet Hastanesi', 
        coords: [36.6526, 29.1198], 
        phone: '112',
        distance: 'Başlangıç noktası',
        icon: '🏥'
    },
    { 
        name: 'Kaş Devlet Hastanesi', 
        coords: [36.1992, 29.6362], 
        phone: '112',
        distance: '~200 km',
        icon: '🏥'
    },
    { 
        name: 'Antalya Eğitim Araştırma Hastanesi', 
        coords: [36.8969, 30.7133], 
        phone: '112',
        distance: 'Bitiş noktası',
        icon: '🏥'
    }
];

// ============================================================================
// WEATHER API CONFIG
// ============================================================================

const WEATHER_CONFIG = {
    API_KEY: '007b67b6185ac73e3b2226ae39d527df',
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    LOCATION: { lat: 36.5, lon: 29.5 }, // Likya Yolu merkez koordinatı
    UPDATE_INTERVAL: 1800000 // 30 dakika
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getRiskColor(risk) {
    return risk === 'low' ? '#51cf66' : risk === 'high' ? '#dc2626' : '#fbbf24';
}

function getRiskText(risk) {
    return risk === 'low' ? 'Düşük' : risk === 'high' ? 'Yüksek' : 'Orta';
}

function getDifficultyColor(difficulty) {
    return difficulty === 'Kolay' ? '#22c55e' : difficulty === 'Zor' ? '#ef4444' : '#f59e0b';
}

function getDashArray(style) {
    return style === 'dashed' ? '10, 10' : style === 'dotted' ? '2, 8' : null;
}

// ============================================================================
// MAP INITIALIZATION
// ============================================================================

function initMap() {
    // Create map
    State.map = L.map('map', {
        center: [36.4, 29.8],
        zoom: 9,
        zoomControl: true
    });

    // Street layer
    State.layers.street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18
    }).addTo(State.map);

    // Satellite layer
    State.layers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 18
    });

    // Load GPX files
    loadGPXFiles();

    // Add water sources
    addWaterSources();

    // Add hospitals
    addHospitals();

    // Load weather
    loadWeather();

    // Hide loading
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1500);
}

// ============================================================================
// GPX LOADING
// ============================================================================

function loadGPXFiles() {
    GPX_SECTIONS.forEach(section => {
        const gpxLayer = new L.GPX(section.file, {
            async: true,
            marker_options: {
                startIconUrl: null,
                endIconUrl: null,
                shadowUrl: null
            },
            polyline_options: {
                color: section.color,
                weight: 5,
                opacity: 0.8,
                dashArray: getDashArray(section.style)
            }
        });

        gpxLayer.on('loaded', function(e) {
            console.log(`✅ ${section.name} yüklendi`);
            
            const bounds = e.target.getBounds();
            const center = bounds.getCenter();
            
            L.marker(center, {
                icon: L.divIcon({
                    html: `<div style="background: ${section.color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">GPX ${section.id}</div>`,
                    className: '',
                    iconSize: [60, 20]
                })
            }).addTo(State.map).bindPopup(createGPXPopup(section));
        });

        gpxLayer.on('error', function(e) {
            console.error(`❌ ${section.name} yüklenemedi:`, e);
        });

        gpxLayer.addTo(State.map);
        State.gpxLayers.push({ section, layer: gpxLayer });
    });
}

function createGPXPopup(section) {
    return `
        <div style="font-family: 'Inter', sans-serif; min-width: 220px;">
            <h3 style="margin: 0 0 8px 0; color: ${section.color}; font-size: 16px; font-weight: 700;">
                ${section.name}
            </h3>
            <div style="font-size: 13px; line-height: 1.6; color: #334155;">
                <p style="margin: 4px 0;"><strong>📏 Mesafe:</strong> ${section.distance} km</p>
                <p style="margin: 4px 0;"><strong>⚡ Zorluk:</strong> ${section.difficulty}</p>
                <p style="margin: 4px 0;"><strong>💧 Su Kaynağı:</strong> ${section.waterSources} adet</p>
                <p style="margin: 4px 0;"><strong>⬆️ Tırmanış:</strong> ${section.elevation.gain}m</p>
                <p style="margin: 4px 0;"><strong>⬇️ İniş:</strong> ${section.elevation.loss}m</p>
                <p style="margin: 4px 0;"><strong>📍 Etaplar:</strong> ${section.stages[0]}-${section.stages[section.stages.length-1]}</p>
            </div>
            <div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px; font-size: 12px; line-height: 1.5; color: #78350f;">
                ${section.warning}
            </div>
        </div>
    `;
}

// ============================================================================
// WATER SOURCES
// ============================================================================

function addWaterSources() {
    WATER_SOURCES.forEach(water => {
        const marker = L.marker(water.coords, {
            icon: L.divIcon({
                html: `<div class="water-marker" style="background: #3b82f6; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">💧</div>`,
                className: '',
                iconSize: [28, 28]
            })
        }).addTo(State.map);

        marker.bindPopup(`
            <div style="font-family: 'Inter', sans-serif; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 8px;">💧</div>
                <h4 style="margin: 0 0 4px 0; color: #1e40af; font-size: 14px;">${water.name}</h4>
                <p style="margin: 0; font-size: 11px; color: #64748b;">GPX Bölüm ${water.stage}</p>
            </div>
        `);

        State.waterMarkers.push(marker);
    });
}

// ============================================================================
// HOSPITALS
// ============================================================================

function addHospitals() {
    HOSPITALS.forEach(hospital => {
        const marker = L.marker(hospital.coords, {
            icon: L.divIcon({
                html: `<div style="background: #dc2626; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">🏥</div>`,
                className: '',
                iconSize: [32, 32]
            })
        }).addTo(State.map);

        marker.bindPopup(`
            <div style="font-family: 'Inter', sans-serif; text-align: center; min-width: 180px;">
                <div style="font-size: 28px; margin-bottom: 8px;">🏥</div>
                <h4 style="margin: 0 0 6px 0; color: #dc2626; font-size: 14px; font-weight: 700;">${hospital.name}</h4>
                <p style="margin: 4px 0; font-size: 12px; color: #64748b;"><strong>📞 Acil:</strong> ${hospital.phone}</p>
                <p style="margin: 4px 0; font-size: 11px; color: #64748b;">📍 ${hospital.distance}</p>
                <button onclick="window.location.href='tel:112'" style="margin-top: 8px; padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px;">
                    📞 112 ARA
                </button>
            </div>
        `);
    });
}

function renderHospitalsList() {
    const container = document.getElementById('hospitalsList');
    container.innerHTML = '';

    HOSPITALS.forEach(hospital => {
        const card = document.createElement('div');
        card.className = 'hospital-card';
        
        card.innerHTML = `
            <div class="hospital-name">
                <span>${hospital.icon}</span>
                <span>${hospital.name}</span>
            </div>
            <div class="hospital-info">
                📞 ${hospital.phone} • 📍 ${hospital.distance}
            </div>
        `;

        card.addEventListener('click', () => {
            State.map.setView(hospital.coords, 13);
        });

        container.appendChild(card);
    });
}

// ============================================================================
// WEATHER API
// ============================================================================

async function loadWeather() {
    const container = document.getElementById('weatherCard');
    
    try {
        const { lat, lon } = WEATHER_CONFIG.LOCATION;
        const url = `${WEATHER_CONFIG.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_CONFIG.API_KEY}&units=metric&lang=tr`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            renderWeather(data);
        } else {
            throw new Error('Weather API error');
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        container.innerHTML = `
            <div style="text-align: center; font-size: 12px;">
                <i class="fas fa-exclamation-triangle"></i> Hava durumu yüklenemedi
            </div>
        `;
    }

    // Auto update every 30 minutes
    setTimeout(loadWeather, WEATHER_CONFIG.UPDATE_INTERVAL);
}

function renderWeather(data) {
    const container = document.getElementById('weatherCard');
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // m/s to km/h
    const pressure = data.main.pressure;
    const description = data.weather[0].description;
    const icon = getWeatherIcon(data.weather[0].main);

    container.innerHTML = `
        <div class="weather-location">
            <i class="fas fa-map-marker-alt"></i>
            Likya Yolu - Fethiye/Antalya
        </div>
        <div class="weather-temp">
            <span style="font-size: 40px;">${icon}</span>
            <span>${temp}°C</span>
        </div>
        <div class="weather-desc">${description}</div>
        <div class="weather-details">
            <div class="weather-item">
                <i class="fas fa-temperature-half"></i>
                Hissedilen: ${feelsLike}°C
            </div>
            <div class="weather-item">
                <i class="fas fa-droplet"></i>
                Nem: ${humidity}%
            </div>
            <div class="weather-item">
                <i class="fas fa-wind"></i>
                Rüzgar: ${windSpeed} km/h
            </div>
            <div class="weather-item">
                <i class="fas fa-gauge"></i>
                Basınç: ${pressure} mb
            </div>
        </div>
    `;
}

function getWeatherIcon(condition) {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Fog': '🌫️',
        'Haze': '🌫️'
    };
    return icons[condition] || '🌤️';
}

// ============================================================================
// UI RENDERING - GPX SECTIONS + 32 STAGES
// ============================================================================

function renderGPXSections() {
    const container = document.getElementById('gpxSectionsList');
    container.innerHTML = '';

    GPX_SECTIONS.forEach(section => {
        const card = document.createElement('div');
        card.className = 'gpx-card';
        card.onclick = () => selectGPXSection(section);

        const dashStyle = section.style === 'dashed' ? 'border-top: 4px dashed' : 
                         section.style === 'dotted' ? 'border-top: 4px dotted' : '';

        card.innerHTML = `
            <div class="gpx-header">
                <div class="gpx-line" style="background: ${section.color}; ${dashStyle}"></div>
                <div class="gpx-title">${section.name}</div>
            </div>
            <div class="gpx-info">
                <span>📏 ${section.distance} km</span>
                <span>⚡ ${section.difficulty}</span>
                <span>💧 ${section.waterSources} su</span>
                <span>📍 Etap ${section.stages[0]}-${section.stages[section.stages.length-1]}</span>
            </div>
        `;

        container.appendChild(card);
    });
}

function renderAllStages() {
    const container = document.getElementById('stagesList');
    container.innerHTML = '';

    // Add filter event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            renderStagesList(btn.dataset.filter);
        });
    });

    // Initial render
    renderStagesList('all');
}

function renderStagesList(filter) {
    const container = document.getElementById('stagesList');
    container.innerHTML = '';

    const filtered = filter === 'all' ? ALL_STAGES : ALL_STAGES.filter(s => s.risk === filter);

    filtered.forEach(stage => {
        const card = document.createElement('div');
        card.className = 'stage-card-mini';
        card.style.borderColor = getRiskColor(stage.risk);

        card.innerHTML = `
            <div class="stage-header-mini">
                <span class="stage-name">${stage.id}. ${stage.name}</span>
                <span class="risk-badge" style="background: ${getRiskColor(stage.risk)};">${getRiskText(stage.risk)}</span>
            </div>
            <div class="stage-info-mini">
                <span>📏 ${stage.distance} km</span>
                <span style="color: ${getDifficultyColor(stage.difficulty)};">⚡ ${stage.difficulty}</span>
            </div>
        `;

        card.addEventListener('click', () => selectStageById(stage.id));

        container.appendChild(card);
    });
}

function selectGPXSection(section) {
    const gpxData = State.gpxLayers.find(g => g.section.id === section.id);
    if (gpxData && gpxData.layer) {
        const bounds = gpxData.layer.getBounds();
        if (bounds.isValid()) {
            State.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
    
    // Show elevation chart
    renderElevationChart(section);
}

function selectStageById(stageId) {
    const stage = ALL_STAGES.find(s => s.id === stageId);
    if (!stage) return;

    // Find which GPX section this stage belongs to
    const section = GPX_SECTIONS.find(sec => sec.stages.includes(stageId));
    if (section) {
        const gpxData = State.gpxLayers.find(g => g.section.id === section.id);
        if (gpxData && gpxData.layer) {
            const bounds = gpxData.layer.getBounds();
            if (bounds.isValid()) {
                State.map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
        
        // Show elevation for the GPX section
        renderElevationChart(section);
    }

    // Show stage info popup
    const popup = L.popup()
        .setLatLng(State.map.getCenter())
        .setContent(`
            <div style="font-family: 'Inter', sans-serif; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; color: ${getRiskColor(stage.risk)}; font-size: 15px; font-weight: 700;">
                    ${stage.id}. ${stage.name}
                </h3>
                <div style="font-size: 12px; line-height: 1.6; color: #334155;">
                    <p style="margin: 4px 0;"><strong>📏 Mesafe:</strong> ${stage.distance} km</p>
                    <p style="margin: 4px 0;"><strong>⚡ Zorluk:</strong> ${stage.difficulty}</p>
                    <p style="margin: 4px 0;"><strong>⚠️ Risk:</strong> ${getRiskText(stage.risk)}</p>
                    <p style="margin: 4px 0;"><strong>📦 GPX Bölüm:</strong> ${section ? section.id : '-'}</p>
                </div>
            </div>
        `)
        .openOn(State.map);
}

function renderElevationChart(section) {
    const container = document.getElementById('elevationContainer');
    const barsContainer = document.getElementById('chartBars');
    const statsContainer = document.getElementById('chartStats');

    container.style.display = 'block';
    barsContainer.innerHTML = '';

    const data = section.elevationData;
    const max = Math.max(...data);

    data.forEach((height, i) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${(height / max) * 100}%`;
        bar.title = `${height}m`;

        const label = document.createElement('div');
        label.className = 'chart-bar-label';
        label.textContent = `${height}m`;
        bar.appendChild(label);

        barsContainer.appendChild(bar);
    });

    statsContainer.innerHTML = `
        <span>⬆️ Tırmanış: ${section.elevation.gain}m</span>
        <span>⬇️ İniş: ${section.elevation.loss}m</span>
    `;
}

// ============================================================================
// GPS CONTROL
// ============================================================================

function toggleGPS() {
    if (!State.gpsActive) {
        startGPS();
    } else {
        stopGPS();
    }
}

function startGPS() {
    if (!navigator.geolocation) {
        alert('GPS bu tarayıcıda desteklenmiyor!');
        return;
    }

    State.gpsWatchId = navigator.geolocation.watchPosition(
        position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            if (State.userMarker) {
                State.map.removeLayer(State.userMarker);
            }

            State.userMarker = L.marker([lat, lng], {
                icon: L.divIcon({
                    html: '<div style="background: #dc2626; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); animation: pulse 2s infinite;">📍</div>',
                    className: '',
                    iconSize: [32, 32]
                })
            }).addTo(State.map);

            State.userMarker.bindPopup('📍 Mevcut Konumunuz').openPopup();
            State.map.setView([lat, lng], 13);

            State.gpsActive = true;
            updateGPSButton();
        },
        error => {
            console.error('GPS Error:', error);
            alert('GPS konumu alınamadı!');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

function stopGPS() {
    if (State.gpsWatchId) {
        navigator.geolocation.clearWatch(State.gpsWatchId);
        State.gpsWatchId = null;
    }
    if (State.userMarker) {
        State.map.removeLayer(State.userMarker);
        State.userMarker = null;
    }
    State.gpsActive = false;
    updateGPSButton();
}

function updateGPSButton() {
    const btn = document.getElementById('gpsBtn');
    const text = document.getElementById('gpsText');
    if (State.gpsActive) {
        btn.classList.add('active');
        text.textContent = 'GPS Aktif';
    } else {
        btn.classList.remove('active');
        text.textContent = "GPS'i Başlat";
    }
}

// ============================================================================
// LAYER CONTROL
// ============================================================================

function toggleLayer() {
    const newLayer = State.currentLayer === 'street' ? 'satellite' : 'street';
    State.currentLayer = newLayer;

    if (newLayer === 'satellite') {
        State.map.removeLayer(State.layers.street);
        State.layers.satellite.addTo(State.map);
        document.getElementById('layerText').textContent = 'Sokak Görünümü';
    } else {
        State.map.removeLayer(State.layers.satellite);
        State.layers.street.addTo(State.map);
        document.getElementById('layerText').textContent = 'Uydu Görünümü';
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.getElementById('gpsBtn').addEventListener('click', toggleGPS);
document.getElementById('layerBtn').addEventListener('click', toggleLayer);

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Likya Yolu Harita Sistemi - 32 ETAP başlatılıyor...');
    initMap();
    renderGPXSections();
    renderAllStages();
    console.log('✅ 32 Etap + 3 GPX Bölüm + Su Kaynakları hazır!');
});