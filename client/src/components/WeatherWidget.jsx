import React, { useState, useEffect } from 'react';
import { FaSun, FaCloud, FaCloudRain } from 'react-icons/fa';

export default function WeatherWidget({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination) return;
    
    const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || 'b11e146909ebc67ca735dc9e28a8760d';
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [destination]);

  if (loading) return <div className="skeleton h-32"></div>;
  if (!weather || weather.cod !== 200) return null;

  const getWeatherIcon = () => {
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('rain')) return <FaCloudRain size={32} className="text-blue-500" />;
    if (main.includes('cloud')) return <FaCloud size={32} className="text-gray-500" />;
    return <FaSun size={32} className="text-yellow-500" />;
  };

  return (
    <div className="card bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600 mb-1">Current Weather</div>
          <div className="text-3xl font-bold text-gray-900">
            {Math.round(weather.main.temp)}°C
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {weather.weather[0].description}
          </div>
        </div>
        <div>
          {getWeatherIcon()}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-sky-200">
        <div>
          <div className="text-xs text-gray-500">Humidity</div>
          <div className="font-semibold">{weather.main.humidity}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Wind Speed</div>
          <div className="font-semibold">{weather.wind.speed} m/s</div>
        </div>
      </div>
    </div>
  );
}