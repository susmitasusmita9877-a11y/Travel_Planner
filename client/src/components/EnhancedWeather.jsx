// client/src/components/EnhancedWeather.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaSun, 
  FaCloud, 
  FaCloudRain, 
  FaCloudShowersHeavy,
  FaBolt,
  FaSnowflake,
  FaWind,
  FaTint,
  FaEye,
  FaCompress,
  FaThermometerHalf,
  FaCloudSun,
  FaCloudMoon
} from 'react-icons/fa';

export default function EnhancedWeather({ destination }) {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'

  useEffect(() => {
    if (destination) {
      fetchWeatherData();
    }
  }, [destination, unit]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || 'b11e146909ebc67ca735dc9e28a8760d';
      
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${API_KEY}&units=${unit}`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const currentData = await currentResponse.json();
      setCurrentWeather(currentData);
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=${API_KEY}&units=${unit}`
      );
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        
        // Process daily forecast (one per day)
        const dailyForecasts = processDailyForecast(forecastData.list);
        setForecast(dailyForecasts);
        
        // Process hourly forecast (next 24 hours)
        const hourlyForecasts = forecastData.list.slice(0, 8); // 8 x 3-hour intervals = 24 hours
        setHourlyForecast(hourlyForecasts);
      }
      
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Unable to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const processDailyForecast = (forecastList) => {
    const dailyData = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: item.dt,
          temps: [],
          weather: item.weather[0],
          humidity: item.main.humidity,
          wind: item.wind.speed
        };
      }
      
      dailyData[date].temps.push(item.main.temp);
    });
    
    // Convert to array and calculate min/max temps
    return Object.values(dailyData).slice(0, 5).map(day => ({
      ...day,
      tempMin: Math.min(...day.temps),
      tempMax: Math.max(...day.temps)
    }));
  };

  const getWeatherIcon = (weatherCode, size = 32) => {
    const iconProps = { size, className: 'drop-shadow-md' };
    
    if (weatherCode >= 200 && weatherCode < 300) {
      return <FaBolt {...iconProps} className="text-yellow-500" />;
    } else if (weatherCode >= 300 && weatherCode < 400) {
      return <FaCloudRain {...iconProps} className="text-blue-400" />;
    } else if (weatherCode >= 500 && weatherCode < 600) {
      return <FaCloudShowersHeavy {...iconProps} className="text-blue-500" />;
    } else if (weatherCode >= 600 && weatherCode < 700) {
      return <FaSnowflake {...iconProps} className="text-blue-200" />;
    } else if (weatherCode >= 700 && weatherCode < 800) {
      return <FaWind {...iconProps} className="text-gray-400" />;
    } else if (weatherCode === 800) {
      return <FaSun {...iconProps} className="text-yellow-500" />;
    } else if (weatherCode === 801) {
      return <FaCloudSun {...iconProps} className="text-yellow-400" />;
    } else {
      return <FaCloud {...iconProps} className="text-gray-400" />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTemperatureUnit = () => unit === 'metric' ? '°C' : '°F';
  const getWindSpeedUnit = () => unit === 'metric' ? 'm/s' : 'mph';

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-24 flex-1"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentWeather) {
    return (
      <div className="card text-center py-8">
        <FaCloudRain size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">{error || 'Weather data unavailable'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Weather */}
      <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{destination}</h3>
            <p className="text-blue-100 text-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setUnit('metric')}
              className={`px-3 py-1 rounded ${unit === 'metric' ? 'bg-white text-blue-600' : 'bg-blue-600'}`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`px-3 py-1 rounded ${unit === 'imperial' ? 'bg-white text-blue-600' : 'bg-blue-600'}`}
            >
              °F
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              {getWeatherIcon(currentWeather.weather[0].id, 64)}
            </div>
            <div>
              <div className="text-6xl font-bold">
                {Math.round(currentWeather.main.temp)}{getTemperatureUnit()}
              </div>
              <div className="text-xl capitalize mt-2">
                {currentWeather.weather[0].description}
              </div>
              <div className="text-blue-100 text-sm mt-1">
                Feels like {Math.round(currentWeather.main.feels_like)}{getTemperatureUnit()}
              </div>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-400">
          <div className="flex items-center gap-3">
            <FaTint className="text-blue-200" size={20} />
            <div>
              <div className="text-blue-100 text-xs">Humidity</div>
              <div className="font-semibold">{currentWeather.main.humidity}%</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaWind className="text-blue-200" size={20} />
            <div>
              <div className="text-blue-100 text-xs">Wind Speed</div>
              <div className="font-semibold">
                {Math.round(currentWeather.wind.speed)} {getWindSpeedUnit()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaCompress className="text-blue-200" size={20} />
            <div>
              <div className="text-blue-100 text-xs">Pressure</div>
              <div className="font-semibold">{currentWeather.main.pressure} hPa</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaEye className="text-blue-200" size={20} />
            <div>
              <div className="text-blue-100 text-xs">Visibility</div>
              <div className="font-semibold">
                {Math.round(currentWeather.visibility / 1000)} km
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      {hourlyForecast.length > 0 && (
        <div className="card">
          <h4 className="font-semibold mb-4">24-Hour Forecast</h4>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {hourlyForecast.map((hour, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 text-center p-3 bg-gray-50 rounded-lg min-w-[80px]"
              >
                <div className="text-sm text-gray-600 mb-2">
                  {formatTime(hour.dt)}
                </div>
                <div className="mb-2">
                  {getWeatherIcon(hour.weather[0].id, 24)}
                </div>
                <div className="font-semibold text-gray-900">
                  {Math.round(hour.main.temp)}{getTemperatureUnit()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(hour.pop * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="card">
          <h4 className="font-semibold mb-4">5-Day Forecast</h4>
          <div className="space-y-3">
            {forecast.map((day, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 text-sm font-medium text-gray-700">
                    {idx === 0 ? 'Today' : formatDate(day.date)}
                  </div>
                  
                  <div className="flex items-center gap-3 flex-1">
                    {getWeatherIcon(day.weather.id, 28)}
                    <div className="text-sm text-gray-600 capitalize">
                      {day.weather.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <FaTint className="text-blue-500" size={14} />
                    <span className="text-gray-600">{day.humidity}%</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm">
                      {Math.round(day.tempMin)}{getTemperatureUnit()}
                    </span>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-300 to-orange-300 rounded"></div>
                    <span className="font-semibold text-gray-900">
                      {Math.round(day.tempMax)}{getTemperatureUnit()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Alerts & Tips */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h4 className="font-semibold text-yellow-900 mb-3">Travel Tips</h4>
        <div className="space-y-2 text-sm text-yellow-800">
          {currentWeather.main.temp > 30 && (
            <p>🌡️ It's quite hot! Stay hydrated and use sunscreen.</p>
          )}
          {currentWeather.main.temp < 10 && (
            <p>🧥 It's cold! Don't forget to pack warm clothing.</p>
          )}
          {currentWeather.main.humidity > 80 && (
            <p>💧 High humidity levels. Dress in light, breathable fabrics.</p>
          )}
          {currentWeather.wind.speed > 10 && (
            <p>💨 Windy conditions. Secure loose items.</p>
          )}
          {forecast[0]?.weather.id >= 500 && forecast[0]?.weather.id < 600 && (
            <p>☔ Rain expected. Carry an umbrella or raincoat.</p>
          )}
        </div>
      </div>
    </div>
  );
}