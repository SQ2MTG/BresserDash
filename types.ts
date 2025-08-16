
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  rainRate: number;
  pressure?: number;
  timestamp: number;
}

export interface HistoricalDataPoint {
  time: string;
  temperature: number;
  humidity: number;
}