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
        // Using wttr.in API for Sydney weather
        const response = await fetch('https://wttr.in/Sydney?format=%C+%t&lang=zh', {
          cache: 'no-cache',
        });
        
        if (!response.ok) {
          throw new Error('Weather fetch failed');
        }
        
        const data = await response.text();
        const parts = data.trim().split(' ');
        
        if (parts.length >= 2) {
          const condition = parts.slice(0, -1).join(' ');
          const temperature = parts[parts.length - 1];
          
          // Map weather conditions to icons
          const getWeatherIcon = (condition: string) => {
            const lowerCondition = condition.toLowerCase();
            if (lowerCondition.includes('晴') || lowerCondition.includes('sunny')) return '☀️';
            if (lowerCondition.includes('雨') || lowerCondition.includes('rain')) return '🌧️';
            if (lowerCondition.includes('云') || lowerCondition.includes('cloud')) return '☁️';
            if (lowerCondition.includes('雪') || lowerCondition.includes('snow')) return '❄️';
            if (lowerCondition.includes('雾') || lowerCondition.includes('fog')) return '🌫️';
            return '🌤️';
          };
          
          setWeather({
            condition,
            temperature,
            icon: getWeatherIcon(condition)
          });
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather data every 30 minutes
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