import { useState, useEffect, useCallback } from 'react';
import { WeatherData, HistoricalDataPoint } from '../types';
import { subscribeToWeatherData } from '../services/weatherService';

const MAX_HISTORY_LENGTH = 30; // Keep the last 30 data points

export const useWeatherData = () => {
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleNewData = useCallback((data: WeatherData) => {
        // It's safe to call setIsLoading(false) repeatedly.
        // It will only trigger a state change the first time.
        setIsLoading(false);
        
        setCurrentWeather(data);

        setHistoricalData(prevHistory => {
            const newPoint: HistoricalDataPoint = {
                time: new Date(data.timestamp).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit'}),
                temperature: data.temperature,
                humidity: data.humidity,
            };
            const updatedHistory = [...prevHistory, newPoint];
            // Keep the history array at a fixed size
            if (updatedHistory.length > MAX_HISTORY_LENGTH) {
                return updatedHistory.slice(1);
            }
            return updatedHistory;
        });
    }, []);

    useEffect(() => {
        const { unsubscribe } = subscribeToWeatherData(handleNewData);
        // Cleanup subscription on component unmount
        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleNewData]);

    return { currentWeather, historicalData, isLoading };
};
