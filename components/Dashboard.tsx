
import React from 'react';
import { useWeatherData } from '../hooks/useWeatherData';
import WeatherCard from './WeatherCard';
import WindCard from './WindCard';
import HistoryChart from './HistoryChart';
import { ThermometerIcon, DropletIcon, UmbrellaIcon } from './icons/WeatherIcons';

const Dashboard: React.FC = () => {
    const { currentWeather, historicalData, isLoading } = useWeatherData();

    if (isLoading || !currentWeather) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
                <p className="ml-4 text-slate-300 text-lg">Oczekiwanie na dane ze stacji...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <WeatherCard
                icon={<ThermometerIcon />}
                title="Temperatura"
                value={currentWeather.temperature.toFixed(1)}
                unit="°C"
            />
            <WeatherCard
                icon={<DropletIcon />}
                title="Wilgotność"
                value={currentWeather.humidity.toFixed(0)}
                unit="%"
            />
            <WindCard
                speed={currentWeather.windSpeed}
                direction={currentWeather.windDirection}
            />
             <WeatherCard
                icon={<UmbrellaIcon />}
                title="Suma opadów"
                value={currentWeather.rainRate.toFixed(1)}
                unit="mm"
            />
            <div className="md:col-span-2 lg:col-span-4">
                 <HistoryChart data={historicalData} />
            </div>
        </div>
    );
};

export default Dashboard;