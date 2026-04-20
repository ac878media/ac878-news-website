'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  condition: string;
  temperature: string;
  icon: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Use Open-Meteo API — no API key, works globally, CORS-enabled
        // Sydney: lat=-33.8688, lon=151.2093
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-33.8688&longitude=151.2093&current=temperature_2m,weather_code&timezone=Australia%2FSydney&forecast_days=1',
          { cache: 'no-cache' }
        );

        if (!response.ok) {
          throw new Error('Weather fetch failed');
        }

        const data = await response.json();
        const temp = Math.round(data.current?.temperature_2m ?? 0);
        const code = data.current?.weather_code ?? 0;

        // Map WMO weather codes to Chinese conditions + emoji
        const weatherMap: Record<number, { condition: string; icon: string }> = {
          0: { condition: '晴天', icon: '☀️' },
          1: { condition: '晴间多云', icon: '🌤️' },
          2: { condition: '多云', icon: '☁️' },
          3: { condition: '阴天', icon: '☁️' },
          45: { condition: '有雾', icon: '🌫️' },
          48: { condition: '雾凇', icon: '🌫️' },
          51: { condition: '小毛毛雨', icon: '🌧️' },
          53: { condition: '中毛毛雨', icon: '🌧️' },
          55: { condition: '大毛毛雨', icon: '🌧️' },
          61: { condition: '小雨', icon: '🌧️' },
          63: { condition: '中雨', icon: '🌧️' },
          65: { condition: '大雨', icon: '🌧️' },
          66: { condition: '冻雨', icon: '🌨️' },
          67: { condition: '冻雨', icon: '🌨️' },
          71: { condition: '小雪', icon: '❄️' },
          73: { condition: '中雪', icon: '❄️' },
          75: { condition: '大雪', icon: '❄️' },
          77: { condition: '雪粒', icon: '❄️' },
          80: { condition: '阵雨', icon: '🌦️' },
          81: { condition: '中阵雨', icon: '🌧️' },
          82: { condition: '强阵雨', icon: '🌧️' },
          85: { condition: '阵雪', icon: '🌨️' },
          86: { condition: '强阵雪', icon: '🌨️' },
          95: { condition: '雷暴', icon: '⛈️' },
          96: { condition: '雷暴冰雹', icon: '⛈️' },
          99: { condition: '强雷暴冰雹', icon: '⛈️' },
        };

        const mapped = weatherMap[code] ?? { condition: '未知', icon: '🌤️' };

        setWeather({
          temperature: `${temp}°C`,
          condition: mapped.condition,
          icon: mapped.icon,
        });
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
            <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <span className="text-lg">🌤️</span>
          <div>
            <div className="font-medium text-sm">悉尼天气</div>
            <div className="text-xs">暂时无法获取</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{weather.icon}</span>
        <div>
          <div className="font-medium text-sm text-gray-900 dark:text-white">
            悉尼 {weather.temperature}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {weather.condition}
          </div>
        </div>
      </div>
    </div>
  );
}
