import React, { useState, useEffect } from "react";
import WeatherCard from "./WeatherCard";
import ForecastCard from "./ForecastCard";
import "./index.css";

const API_KEY = "b56f8326891ca080382d9e9267773e89"; // Replace with your API key

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backgroundClass, setBackgroundClass] = useState("default-bg");

  const getBackgroundClass = (weatherMain) => {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return "clear-bg";
      case "clouds":
        return "clouds-bg";
      case "rain":
      case "drizzle":
        return "rain-bg";
      case "snow":
        return "snow-bg";
      case "thunderstorm":
        return "thunder-bg";
      default:
        return "default-bg";
    }
  };

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
      ]);

      if (!weatherRes.ok || !forecastRes.ok) throw new Error("City not found");

      const weather = await weatherRes.json();
      const forecast = await forecastRes.json();

      setWeatherData(weather);
      setForecastData(forecast);
      setBackgroundClass(getBackgroundClass(weather.weather[0].main));
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
      setBackgroundClass("default-bg");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }
    fetchWeather();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const items = document.querySelectorAll(".forecast-day");

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          if (!item.classList.contains("bounce")) {
            item.classList.add("bounce");
            setTimeout(() => item.classList.remove("bounce"), 500);
          }
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={`app ${backgroundClass}`}>
      <div className="overlay">
        <h1>🌤 My Weather App</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p className="info">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {weatherData && <WeatherCard data={weatherData} />}
        {forecastData && <ForecastCard forecast={forecastData} />}
      </div>
    </div>
  );
}
