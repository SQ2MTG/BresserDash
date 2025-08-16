
import { WeatherData } from '../types';
import mqtt from 'mqtt';

// Zgodnie z Twoim żądaniem, na stałe ustawiamy WS.
// UWAGA: To zadziała TYLKO jeśli strona jest załadowana przez HTTP.
// Jeśli przeglądarka załaduje stronę przez HTTPS, połączenie WS zostanie zablokowane.
const MQTT_BROKER_URL = 'ws://10.10.0.4:9002';

const MQTT_TOPIC = 'rtl_433/ZBOOK-MTG/devices/Bresser-6in1/0/1697981042';

// Parses the string payload from the rtl_433 MQTT topic
const parseMqttMessage = (payload: string): Partial<Record<string, string>> => {
    const data: Record<string, string> = {};
    payload.split('\n').forEach(line => {
        const parts = line.split(' = ');
        if (parts.length === 2) {
            const key = parts[0].trim();
            const value = parts[1].trim();
            if (key && value) {
                data[key] = value;
            }
        }
    });
    return data;
};

// Maps the parsed data to our WeatherData interface
const mapToWeatherData = (parsedData: Partial<Record<string, string>>): WeatherData | null => {
    if (!parsedData.temperature_C || !parsedData.humidity || !parsedData.wind_avg_m_s || !parsedData.wind_dir_deg || !parsedData.rain_mm) {
        return null; // Incomplete data
    }

    // Convert wind speed from m/s to km/h
    const windSpeedKmh = parseFloat(parsedData.wind_avg_m_s) * 3.6;

    return {
        temperature: parseFloat(parsedData.temperature_C),
        humidity: parseInt(parsedData.humidity, 10),
        windSpeed: windSpeedKmh,
        windDirection: parseInt(parsedData.wind_dir_deg, 10),
        rainRate: parseFloat(parsedData.rain_mm), // This is total rain, not rate
        timestamp: Date.now(),
    };
};


export const subscribeToWeatherData = (callback: (data: WeatherData) => void) => {
    // Kluczowa diagnostyka: Sprawdź, czy strona nie jest ładowana przez HTTPS.
    if (window.location.protocol === 'https:') {
        console.error(
            'KRYTYCZNY BŁĄD KONFIGURACJI: Strona jest załadowana przez HTTPS, ' +
            'ale próbuje połączyć się z niezabezpieczonym WebSocketem (ws://). ' +
            'Przeglądarka zablokuje to połączenie. Upewnij się, że w pasku adresu przeglądarki jest "http://", a nie "https://".'
        );
    }
    
    console.log(`Connecting to MQTT broker at ${MQTT_BROKER_URL}...`);
    const client = mqtt.connect(MQTT_BROKER_URL);

    client.on('connect', () => {
        console.log('Successfully connected to MQTT broker.');
        client.subscribe(MQTT_TOPIC, (err) => {
            if (!err) {
                console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
            } else {
                console.error('Subscription error:', err);
            }
        });
    });

    client.on('message', (topic, message) => {
        try {
            const messageString = message.toString();
            const parsedData = parseMqttMessage(messageString);
            const weatherData = mapToWeatherData(parsedData);
            if (weatherData) {
                callback(weatherData);
            } else {
                 console.warn('Received incomplete data, skipping update.');
            }
        } catch (e) {
            console.error('Error processing MQTT message:', e);
        }
    });

    client.on('error', (err) => {
        console.error('MQTT connection error:', err);
        client.end();
    });
    
    client.on('offline', () => {
        console.log('MQTT client is offline.');
    });

    const unsubscribe = () => {
        if (client) {
            console.log('Unsubscribing and disconnecting from MQTT broker.');
            client.end();
        }
    };

    return { unsubscribe };
};
