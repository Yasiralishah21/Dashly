"use client";
import { useEffect, useState } from "react";

const ICON_URL = "https://openweathermap.org/img/wn";

type WeatherData = {
  city: string;
  temp: number;
  condition: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
};

interface WeatherWidgetProps {
  /** City from Home flow; when null, API may use a default (e.g. London). */
  city?: string | null;
}

export default function WeatherWidget({ city }: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const url = city
          ? `/api/weather?city=${encodeURIComponent(city)}`
          : "/api/weather";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather");
        const json = await res.json();

        // Map API response to our WeatherData type
        setData({
          city: json.city,
          temp: json.temperature,
          condition: json.condition,
          icon: json.icon,
          humidity: json.humidity,
          windSpeed: json.windSpeed,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [city]);

  if (loading) return <div className="text-slate-500 border-2 border-slate-200 rounded-xl p-4 bg-white">Loading weather...</div>;
  if (error || !data) return <div>Error: {error || "Unable to fetch weather"}</div>;

  const iconSrc = `${ICON_URL}/${data.icon}@2x.png`;

  return (
    <div className="card-hover rounded-xl border border-slate-400 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Weather
      </h3>
      <div className="flex items-center gap-4">
        <img src={iconSrc} alt={data.condition} className="h-14 w-14" width={56} height={56} />
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{data.temp}°C</p>
          <p className="text-slate-600 dark:text-slate-300">{data.city}</p>
          <p className="text-sm capitalize text-slate-500 dark:text-slate-400">{data.condition}</p>
        </div>
      </div>
      {/* {(data.humidity != null || data.windSpeed != null) && (
        <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 dark:border-slate-700">
          {data.humidity != null && <span className="text-xs text-slate-500 dark:text-slate-400">Humidity: {data.humidity}%</span>}
          {data.windSpeed != null && <span className="text-xs text-slate-500 dark:text-slate-400">Wind: {data.windSpeed} m/s</span>}
        </div>
      )} */}
    </div>
  );
}
