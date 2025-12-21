// Likya Yolu Gelişmiş Harita Sistemi
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
    waterMarkers: []
};

// ============================================================================
// STAGE DATA
// ============================================================================

const STAGES = [
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
        elevationData: [439, 554, 771, 766, 730, 612, 300, 150, 76]
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
        elevationData: [10, 100, 300, 558, 850, 1200, 800, 400, 240]
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
        elevationData: [240, 460, 680, 1020, 1250, 1800, 1400, 1100, 873]
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

    // Hide loading
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1500);
}

// ============================================================================
// GPX LOADING
// ============================================================================

function loadGPXFiles() {
    STAGES.forEach(stage => {
        const gpxLayer = new L.GPX(stage.file, {
            async: true,
            marker_options: {
                startIconUrl: null,
                endIconUrl: null,
                shadowUrl: null
            },
            polyline_options: {
                color: stage.color,
                weight: 5,
                opacity: 0.8,
                dashArray: getDashArray(stage.style)
            }
        });

        gpxLayer.on('loaded', function(e) {
            console.log(`✅ ${stage.name} yüklendi`);
            
            // Add popup
            const bounds = e.target.getBounds();
            const center = bounds.getCenter();
            
            L.marker(center, {
                icon: L.divIcon({
                    html: `<div style="background: ${stage.color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">Bölüm ${stage.id}</div>`,
                    className: '',
                    iconSize: [60, 20]
                })
            }).addTo(State.map).bindPopup(createStagePopup(stage));
        });

        gpxLayer.on('error', function(e) {
            console.error(`❌ ${stage.name} yüklenemedi:`, e);
        });

        gpxLayer.addTo(State.map);
        State.gpxLayers.push({ stage, layer: gpxLayer });
    });
}

function getDashArray(style) {
    switch(style) {
        case 'dashed': return '10, 10';
        case 'dotted': return '2, 8';
        default: return null;
    }
}

function createStagePopup(stage) {
    return `
        <div style="font-family: 'Inter', sans-serif; min-width: 220px;">
            <h3 style="margin: 0 0 8px 0; color: ${stage.color}; font-size: 16px; font-weight: 700;">
                ${stage.name}
            </h3>
            <div style="font-size: 13px; line-height: 1.6; color: #334155;">
                <p style="margin: 4px 0;"><strong>📏 Mesafe:</strong> ${stage.distance} km</p>
                <p style="margin: 4px 0;"><strong>⚡ Zorluk:</strong> ${stage.difficulty}</p>
                <p style="margin: 4px 0;"><strong>💧 Su Kaynağı:</strong> ${stage.waterSources} adet</p>
                <p style="margin: 4px 0;"><strong>⬆️ Tırmanış:</strong> ${stage.elevation.gain}m</p>
                <p style="margin: 4px 0;"><strong>⬇️ İniş:</strong> ${stage.elevation.loss}m</p>
            </div>
            <div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-radius: 6px; font-size: 12px; line-height: 1.5; color: #78350f;">
                ${stage.warning}
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
                <p style="margin: 0; font-size: 11px; color: #64748b;">Bölüm ${water.stage}</p>
            </div>
        `);

        State.waterMarkers.push(marker);
    });
}

// ============================================================================
// UI RENDERING
// ============================================================================

function renderStages() {
    const container = document.getElementById('stagesList');
    container.innerHTML = '';

    STAGES.forEach(stage => {
        const card = document.createElement('div');
        card.className = 'stage-card';
        card.onclick = () => selectStage(stage);

        card.innerHTML = `
            <div class="stage-header">
                <div class="stage-line" style="background: ${stage.color};"></div>
                <div class="stage-title">${stage.name}</div>
            </div>
            <div class="stage-info">
                <span>📏 ${stage.distance} km</span>
                <span>⚡ ${stage.difficulty}</span>
                <span>💧 ${stage.waterSources} su</span>
            </div>
        `;

        container.appendChild(card);
    });
}

function selectStage(stage) {
    State.activeStage = stage;

    // Update UI
    document.querySelectorAll('.stage-card').forEach((card, i) => {
        if (i === stage.id - 1) {
            card.classList.add('active');
            card.style.borderColor = stage.color;
        } else {
            card.classList.remove('active');
        }
    });

    // Zoom to stage
    const gpxData = State.gpxLayers.find(g => g.stage.id === stage.id);
    if (gpxData && gpxData.layer) {
        const bounds = gpxData.layer.getBounds();
        if (bounds.isValid()) {
            State.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    // Show elevation chart
    renderElevationChart(stage);
}

function renderElevationChart(stage) {
    const container = document.getElementById('elevationContainer');
    const barsContainer = document.getElementById('chartBars');
    const statsContainer = document.getElementById('chartStats');

    container.style.display = 'block';
    barsContainer.innerHTML = '';

    const data = stage.elevationData;
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
        <span>⬆️ Tırmanış: ${stage.elevation.gain}m</span>
        <span>⬇️ İniş: ${stage.elevation.loss}m</span>
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

            // Remove old marker
            if (State.userMarker) {
                State.map.removeLayer(State.userMarker);
            }

            // Add new marker
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
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
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
    console.log('🚀 Likya Yolu Harita Sistemi başlatılıyor...');
    initMap();
    renderStages();
    console.log('✅ Sistem hazır!');
});