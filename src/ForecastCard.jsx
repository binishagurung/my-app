import React from "react";

export default function ForecastCard({ forecast }) {
  const daily = [];

  forecast.list.forEach((item) => {
    if (item.dt_txt.includes("12:00:00")) {
      daily.push(item);
    }
  });

  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {daily.map((day, index) => (
          <div className="forecast-day" key={index}>
            <p>{new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}</p>
            <p>{Math.round(day.main.temp)}°C</p>
            <p>{day.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
