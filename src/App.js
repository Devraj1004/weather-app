import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [time, setTime] = useState(new Date());

  const API_KEY = '12889617110ec9186914e80169024876';

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
        setError('');
      } else {
        setWeather(null);
        setError('City not found');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  useEffect(() => {
    fetchWeather();
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTime = () => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBackgroundClass = () => {
    if (!weather) return 'app-container default';

    const condition = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;
    const hour = time.getHours();

    const isNight = hour >= 19 || hour < 5;
    const isSunset = hour >= 17 && hour < 19;
    const isSunrise = hour >= 5 && hour < 7;

    if (isNight) return 'app-container night';
    if (isSunrise) return 'app-container sunrise';
    if (isSunset) return 'app-container sunset';

    if (condition.includes('clear')) return temp > 30 ? 'app-container hot' : 'app-container sunny';
    if (condition.includes('cloud')) return 'app-container cloudy';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'app-container rainy';
    if (condition.includes('snow')) return 'app-container snowy';
    if (condition.includes('storm')) return 'app-container stormy';
    if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) return 'app-container foggy';

    return 'app-container default';
  };

  return (
    <div className={getBackgroundClass()}>
      <div className="glass-panel">
        <div className="city">{weather ? weather.name : 'City'}</div>
        <div className="time">{getTime()}</div>
        {weather && (
          <>
            <div className="main-temp">{Math.round(weather.main.temp)}°</div>
            <div className="condition">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather-icon"
              />
              {weather.weather[0].main}
            </div>
            <div className="range">
              {Math.round(weather.main.temp_max)}°C / {Math.round(weather.main.temp_min)}°C
            </div>
            <div className="hourly">
              <div>Now<br />{Math.round(weather.main.temp)}°</div>
              <div>+1h<br />{Math.round(weather.main.temp + 1)}°</div>
              <div>+2h<br />{Math.round(weather.main.temp + 2)}°</div>
              <div>+3h<br />{Math.round(weather.main.temp - 1)}°</div>
              <div>+4h<br />{Math.round(weather.main.temp)}°</div>
            </div>
          </>
        )}
        <div className="search">
          <input
            type="text"
            placeholder="Search city..."
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather}>Go</button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default App;
