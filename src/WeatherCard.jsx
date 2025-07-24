import React from "react";

export default function WeatherCard({ data }) {
  return (
    <div className="weather-card">
      <h2>{data.name}</h2>
      <div className="temp">{Math.round(data.main.temp)}°C</div>
      <div className="description">{data.weather[0].description}</div>
    </div>
  );
}
