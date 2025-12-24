import { useEffect, useMemo, useState } from "react";

const CACHE_KEY = "worknest_weather_cache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.ts || !parsed?.data) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // ignore
  }
}

/**
 * Only recommend WFH for:
 *  - Heatwaves (very high temperature)
 *  - Heavy rain
 *  - Storm / Thunderstorm
 *
 * Everything else => Come to office
 */
function getWorkSuggestion(data, units) {
  if (!data) return null;

  const t = Number(data.temp);
  const icon = data.icon || "";
  const desc = (data.description || "").toLowerCase();

  // OpenWeather icon codes:
  // 11 = thunderstorm
  // 09 = shower/heavy rain
  // 10 = rain (can be light/moderate)
  const isStorm = icon.startsWith("11") || desc.includes("thunder");

  // "Heavy rain" detection: icon 09 OR description mentions heavy rain
  // (09 is usually showers; often used for heavier precipitation)
  const isHeavyRain =
    icon.startsWith("09") ||
    desc.includes("heavy rain") ||
    desc.includes("very heavy rain") ||
    desc.includes("extreme rain");

  // Heatwave thresholds:
  // metric (°C): >= 35
  // imperial (°F): >= 95
  const isHeatwave =
    Number.isFinite(t) && (units === "imperial" ? t >= 95 : t >= 35);

  if (isStorm) {
    return {
      decision: "Work from home",
      reason: "Stormy weather detected (thunderstorm).",
    };
  }

  if (isHeavyRain) {
    return {
      decision: "Work from home",
      reason: "Heavy rain detected—commuting may be unsafe or delayed.",
    };
  }

  if (isHeatwave) {
    return {
      decision: "Work from home",
      reason: "Heatwave conditions detected—avoid commuting in extreme heat.",
    };
  }

  return {
    decision: "Come to office",
    reason: "Weather looks fine for commuting today.",
  };
}

export default function WeatherWidget() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const city = import.meta.env.VITE_WEATHER_CITY || "Dhaka";
  const units = import.meta.env.VITE_WEATHER_UNITS || "metric";

  const [data, setData] = useState(() => loadCache());
  const [loading, setLoading] = useState(!loadCache());
  const [error, setError] = useState("");

  const url = useMemo(() => {
    const q = encodeURIComponent(city);
    return `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=${units}`;
  }, [apiKey, city, units]);

  useEffect(() => {
    if (!apiKey) {
      setError("Missing OpenWeather API key (VITE_OPENWEATHER_API_KEY).");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchWeather() {
      setError("");
      setLoading(true);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Weather request failed: ${res.status} ${text}`);
        }

        const json = await res.json();

        const trimmed = {
          name: json?.name,
          temp: json?.main?.temp,
          feelsLike: json?.main?.feels_like,
          humidity: json?.main?.humidity,
          wind: json?.wind?.speed,
          description: json?.weather?.[0]?.description,
          icon: json?.weather?.[0]?.icon,
          updatedAt: Date.now(),
        };

        if (!cancelled) {
          setData(trimmed);
          saveCache(trimmed);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load weather.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [apiKey, url]);

  const tempUnit = units === "imperial" ? "°F" : "°C";
  const windUnit = units === "imperial" ? "mph" : "m/s";

  const suggestion = getWorkSuggestion(data, units);

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Weather</h3>
          <p className="text-sm text-gray-500">
            {city}
            {data?.name && data.name.toLowerCase() !== city.toLowerCase()
              ? ` • ${data.name}`
              : ""}
          </p>
        </div>

        {data?.icon ? (
          <img
            alt={data.description || "weather icon"}
            className="h-12 w-12 shrink-0"
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          />
        ) : null}
      </div>

      {/* Body */}
      <div className="mt-4">
        {loading && !data ? (
          <p className="text-sm text-gray-600">Loading weather…</p>
        ) : error ? (
          <div className="text-sm text-red-600">
            <p>{error}</p>
            <div className="mt-2">
              <button
                onClick={() => {
                  localStorage.removeItem(CACHE_KEY);
                  window.location.reload();
                }}
                className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                Retry
              </button>
            </div>
          </div>
        ) : data ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            {/* Left: temp + details */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-4xl font-bold leading-none">
                  {Number.isFinite(Number(data.temp))
                    ? `${Math.round(Number(data.temp))}${tempUnit}`
                    : `—${tempUnit}`}
                </span>

                {typeof data.feelsLike === "number" && (
                  <span className="text-sm text-gray-600">
                    Feels like {Math.round(data.feelsLike)}
                    {tempUnit}
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm capitalize text-gray-700">
                {data.description || "—"}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                <div className="rounded-lg bg-gray-50 p-2">
                  Humidity:{" "}
                  <span className="font-medium">
                    {typeof data.humidity === "number"
                      ? `${data.humidity}%`
                      : "—"}
                  </span>
                </div>
                <div className="rounded-lg bg-gray-50 p-2">
                  Wind:{" "}
                  <span className="font-medium">
                    {typeof data.wind === "number"
                      ? `${Number(data.wind).toFixed(1)} ${windUnit}`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: recommendation */}
            {suggestion ? (
              <div
                className={[
                  "w-full rounded-lg border p-3 text-sm md:w-[260px]",
                  suggestion.decision === "Work from home"
                    ? "border-red-200 bg-red-50"
                    : "border-green-200 bg-green-50",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-gray-900">Recommendation</p>
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      suggestion.decision === "Work from home"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700",
                    ].join(" ")}
                  >
                    {suggestion.decision}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{suggestion.reason}</p>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No weather data.</p>
        )}

        {/* Footer */}
        {data?.updatedAt ? (
          <p className="mt-4 text-xs text-gray-500">
            Updated{" "}
            {(() => {
              const mins = Math.max(
                0,
                Math.round((Date.now() - data.updatedAt) / 60000)
              );
              return mins <= 1 ? "just now" : `${mins} min ago`;
            })()}
          </p>
        ) : null}
      </div>
    </div>
  );
}
