# Likya Yolu Güvenlik Sistemi - Mobil Uygulama Rehberi (Expo/React Native)

Bu rehber, Likya Yolu Güvenlik Sistemi'ni **Expo** ve **React Native** kullanarak iOS ve Android mobil uygulaması olarak geliştirmek için adım adım talimatlar içerir.

## 📋 Ön Koşullar

1. **Node.js 14+** - https://nodejs.org
2. **Expo CLI** - `npm install -g expo-cli`
3. **Expo Go App** - iOS/Android'de Expo Go uygulamasını indir
4. **Code Editor** - VS Code veya benzeri

## 🚀 Adım 1: Expo Projesi Oluştur

### 1.1 Yeni Expo Projesi

```bash
# Expo projesi oluştur
expo init likya-guvenlik-mobile --template

# Şablonları seç:
# 1. blank
# 2. bare workflow
# Seç: blank (Managed workflow)

cd likya-guvenlik-mobile
```

### 1.2 Gerekli Paketleri Yükle

```bash
npm install \
  react-native \
  react-navigation \
  react-navigation-native \
  react-native-screens \
  react-native-safe-area-context \
  react-native-gesture-handler \
  react-native-reanimated \
  react-native-tab-view \
  react-native-pager-view \
  react-native-maps \
  expo-location \
  expo-permissions \
  expo-notifications \
  axios \
  chart.js \
  react-native-chart-kit
```

---

## 📁 Adım 2: Proje Yapısını Oluştur

```
likya-guvenlik-mobile/
├── App.js
├── app.json
├── package.json
├── screens/
│   ├── HomeScreen.js
│   ├── MapScreen.js
│   ├── WeatherScreen.js
│   ├── StagesScreen.js
│   ├── FacilitiesScreen.js
│   └── EmergencyScreen.js
├── components/
│   ├── MapComponent.js
│   ├── WeatherPanel.js
│   ├── RiskBadge.js
│   └── EmergencyModal.js
├── navigation/
│   └── BottomTabNavigator.js
├── utils/
│   ├── api.js
│   ├── constants.js
│   └── helpers.js
└── assets/
    ├── images/
    └── icons/
```

---

## 💻 Adım 3: Ana Dosyaları Oluştur

### 3.1 App.js - Ana Uygulama

```javascript
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

// Screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import WeatherScreen from './screens/WeatherScreen';
import StagesScreen from './screens/StagesScreen';
import FacilitiesScreen from './screens/FacilitiesScreen';
import EmergencyScreen from './screens/EmergencyScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function MapStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MapScreen" 
        component={MapScreen}
        options={{ title: 'Likya Yolu Haritası' }}
      />
    </Stack.Navigator>
  );
}

function WeatherStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="WeatherScreen" 
        component={WeatherScreen}
        options={{ title: 'Hava Durumu' }}
      />
    </Stack.Navigator>
  );
}

function StagesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="StagesScreen" 
        component={StagesScreen}
        options={{ title: 'Etaplar' }}
      />
    </Stack.Navigator>
  );
}

function FacilitiesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FacilitiesScreen" 
        component={FacilitiesScreen}
        options={{ title: 'Tesisler' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // GPS izni iste
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('GPS izni reddedildi');
      }
    })();

    // Notification izni iste
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? '🏠' : '🏡';
            } else if (route.name === 'Map') {
              iconName = '🗺️';
            } else if (route.name === 'Weather') {
              iconName = '🌡️';
            } else if (route.name === 'Stages') {
              iconName = '🥾';
            } else if (route.name === 'Facilities') {
              iconName = '🏕️';
            } else if (route.name === 'Emergency') {
              iconName = '🆘';
            }
            return <Text style={{ fontSize: size }}>{iconName}</Text>;
          },
          tabBarActiveTintColor: '#2a5298',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Ana Sayfa', headerShown: false }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapStackNavigator}
          options={{ title: 'Harita', headerShown: false }}
        />
        <Tab.Screen 
          name="Weather" 
          component={WeatherStackNavigator}
          options={{ title: 'Hava', headerShown: false }}
        />
        <Tab.Screen 
          name="Stages" 
          component={StagesStackNavigator}
          options={{ title: 'Etaplar', headerShown: false }}
        />
        <Tab.Screen 
          name="Facilities" 
          component={FacilitiesStackNavigator}
          options={{ title: 'Tesisler', headerShown: false }}
        />
        <Tab.Screen 
          name="Emergency" 
          component={EmergencyScreen}
          options={{ title: 'SOS', headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### 3.2 utils/api.js - API İstemcisi

```javascript
import axios from 'axios';

// Backend URL
const API_URL = 'https://likya-guvenlik-api.onrender.com/api';

// Axios örneği
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// API Fonksiyonları
export const getStages = async () => {
  try {
    const response = await api.get('/stages');
    return response.data;
  } catch (error) {
    console.error('Etaplar alınamadı:', error);
    throw error;
  }
};

export const getRiskAnalysis = async (weather = {}, crowding = 0.5) => {
  try {
    const response = await api.post('/risk-analysis', {
      weather,
      crowding,
    });
    return response.data;
  } catch (error) {
    console.error('Risk analizi alınamadı:', error);
    throw error;
  }
};

export const getOptimalRoute = async (start, end, weather = {}) => {
  try {
    const response = await api.post('/route/optimize', {
      start,
      end,
      weather,
    });
    return response.data;
  } catch (error) {
    console.error('Optimal rota alınamadı:', error);
    throw error;
  }
};

export const getCurrentWeather = async () => {
  try {
    const response = await api.get('/weather/current');
    return response.data;
  } catch (error) {
    console.error('Hava durumu alınamadı:', error);
    throw error;
  }
};

export const getHistoricalWeather = async () => {
  try {
    const response = await api.get('/weather/historical');
    return response.data;
  } catch (error) {
    console.error('Geçmiş hava durumu alınamadı:', error);
    throw error;
  }
};

export const getFacilities = async () => {
  try {
    const response = await api.get('/facilities');
    return response.data;
  } catch (error) {
    console.error('Tesisler alınamadı:', error);
    throw error;
  }
};

export const sendEmergencySOS = async (location, type) => {
  try {
    const response = await api.post('/emergency/sos', {
      location,
      type,
    });
    return response.data;
  } catch (error) {
    console.error('SOS gönderilemedi:', error);
    throw error;
  }
};

export const getModelInfo = async () => {
  try {
    const response = await api.get('/model/info');
    return response.data;
  } catch (error) {
    console.error('Model bilgisi alınamadı:', error);
    throw error;
  }
};

export default api;
```

### 3.3 screens/MapScreen.js - Harita Ekranı

```javascript
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getStages } from '../utils/api';

const STAGES = [
  // Likya Yolu etapları (backend'den alınacak)
];

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    loadData();
    startLocationTracking();
  }, []);

  const loadData = async () => {
    try {
      const stagesData = await getStages();
      setStages(stagesData.stages);
    } catch (error) {
      console.error('Veri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Konum izni reddedildi');
      return;
    }

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (newLocation) => {
        setLocation(newLocation.coords);
      }
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2a5298" />
      </View>
    );
  }

  const initialRegion = {
    latitude: 36.7,
    longitude: 29.3,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={setMapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {/* Likya Yolu rotası */}
        {stages.map((stage, index) => (
          <Polyline
            key={index}
            coordinates={stage.coords}
            strokeColor={
              stage.risk === 'low'
                ? '#51cf66'
                : stage.risk === 'medium'
                ? '#ffd43b'
                : '#ff6b6b'
            }
            strokeWidth={3}
          />
        ))}

        {/* Kullanıcı konumu */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Mevcut Konumunuz"
            pinColor="#2a5298"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
```

---

## 🔧 Adım 4: Diğer Ekranları Oluştur

### 4.1 HomeScreen.js

```javascript
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Likya Yolu Güvenlik Sistemi</Text>
        <Text style={styles.subtitle}>
          Yapay Zeka Destekli Güvenlik Analizi
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🗺️ Harita</Text>
        <Text style={styles.cardDescription}>
          32 etap etkileşimli harita
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Map')}
        >
          <Text style={styles.buttonText}>Haritayı Aç</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤖 Risk Analizi</Text>
        <Text style={styles.cardDescription}>
          %84+ doğruluk oranıyla güvenlik riski tahmini
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🛣️ Rota Optimizasyonu</Text>
        <Text style={styles.cardDescription}>
          En güvenli rotayı dinamik olarak hesapla
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2a5298',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a5298',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2a5298',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
```

---

## 🚀 Adım 5: Uygulamayı Çalıştır

### 5.1 Geliştirme Sunucusu

```bash
# Proje dizininde
npm start

# veya
expo start
```

### 5.2 Test Cihazında

1. **iOS:**
   - Expo Go uygulamasını App Store'dan indir
   - QR kodunu tara

2. **Android:**
   - Expo Go uygulamasını Play Store'dan indir
   - QR kodunu tara

3. **Web (Test):**
   - `w` tuşuna bas
   - Tarayıcıda açılacak

---

## 📦 Adım 6: Uygulamayı Build Et

### 6.1 EAS Build Kurulumu

```bash
# EAS CLI'yi yükle
npm install -g eas-cli

# Expo hesabına giriş yap
eas login

# EAS yapılandırması
eas build:configure
```

### 6.2 iOS Build

```bash
eas build --platform ios
```

### 6.3 Android Build

```bash
eas build --platform android
```

---

## 📱 Adım 7: App Store'da Yayınla

### 7.1 iOS App Store

1. Apple Developer hesabı oluştur
2. App ID oluştur
3. TestFlight'ta test et
4. App Store'a gönder

### 7.2 Google Play Store

1. Google Play Developer hesabı oluştur
2. Uygulama oluştur
3. Internal testing'te test et
4. Play Store'a gönder

---

## 💡 İpuçları

1. **Offline Desteği:**
   ```javascript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   ```

2. **Push Notifications:**
   ```javascript
   import * as Notifications from 'expo-notifications';
   ```

3. **Performans:**
   - Lazy loading kullan
   - Resimler optimize et
   - Gereksiz re-render'ları önle

---

## 📞 Destek

- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Expo Community:** https://forums.expo.dev

---

**Son Güncelleme:** 18 Aralık 2025
**Versiyon:** 1.0.0
