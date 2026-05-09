import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, CloudSnow } from 'lucide-react';

interface WeatherData {
  temp: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
}

function getConditionLabel(code: number): string {
  if (code === 0) return 'CLEAR SKY';
  if (code <= 3) return 'PARTLY CLOUDY';
  if (code <= 49) return 'FOGGY';
  if (code <= 67) return 'RAIN';
  if (code <= 77) return 'SNOW';
  if (code <= 82) return 'SHOWERS';
  return 'STORM';
}

function isRaining(code: number) { return code >= 51 && code <= 82; }
function isCold(tempF: number) { return tempF < 40; }
function isSunny(code: number) { return code <= 2; }

function WeatherIcon({ code, size = 32 }: { code: number; size?: number }) {
  const props = { size, style: { filter: 'drop-shadow(0 0 6px rgba(255,184,0,0.4))' } };
  if (code === 0) return <Sun {...props} color="#FFB800" style={{ ...props.style, animation: 'float 3s ease-in-out infinite' }} />;
  if (code <= 3) return <Cloud {...props} color="#A0A0A0" style={{ ...props.style, animation: 'float 3s ease-in-out infinite' }} />;
  if (code >= 51 && code <= 82) return <CloudRain {...props} color="#7B2FBE" style={{ ...props.style, animation: 'float 2s ease-in-out infinite' }} />;
  if (code >= 71 && code <= 77) return <CloudSnow {...props} color="#c0d0e0" style={{ ...props.style, animation: 'float 3s ease-in-out infinite' }} />;
  return <Cloud {...props} color="#A0A0A0" />;
}

function getVibe(code: number, tempF: number): string {
  if (isRaining(code)) return 'still throwing dimes';
  if (isCold(tempF)) return "Lamar doesn't feel that";
  if (isSunny(code)) return 'perfect day to embarrass a defense';
  return 'weather is irrelevant to him';
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=39.2904&longitude=-76.6122&current_weather=true&temperature_unit=fahrenheit&wind_speed_unit=mph'
    )
      .then(r => r.json())
      .then(d => {
        setWeather(d.current_weather);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="glass" style={{
      padding: '24px', maxWidth: '340px',
      borderColor: 'rgba(255,184,0,0.15)',
    }}>
      {/* Header */}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
        color: 'var(--gold)', letterSpacing: '0.2em', marginBottom: '16px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#00ff88', boxShadow: '0 0 8px #00ff88',
          animation: 'pulse-glow 2s infinite',
        }} />
        CURRENT CONDITIONS AT THE HOUSE
      </div>

      {loading && (
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--dim)' }}>
          {'> FETCHING BALTIMORE DATA...'}
        </div>
      )}

      {error && (
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--dim)' }}>
          {'> SIGNAL LOST — LAMAR STILL BALLING'}
        </div>
      )}

      {weather && !loading && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
            <WeatherIcon code={weather.weathercode} size={40} />
            <div>
              <div style={{
                fontFamily: 'Bebas Neue, cursive', fontSize: '2.5rem',
                color: 'var(--white)', lineHeight: 1,
              }}>
                {Math.round(weather.temp)}°F
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
                color: 'var(--dim)', letterSpacing: '0.1em',
              }}>
                {getConditionLabel(weather.weathercode)}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wind size={12} color="var(--dim)" />
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.72rem', color: 'var(--dim)',
              }}>
                {Math.round(weather.windspeed)} MPH
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Thermometer size={12} color="var(--dim)" />
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.72rem', color: 'var(--dim)',
              }}>
                BALTIMORE, MD
              </span>
            </div>
          </div>

          {/* Vibe */}
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem',
            color: 'var(--gold)', fontStyle: 'italic',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '12px',
          }}>
            {'> '}{getVibe(weather.weathercode, weather.temp)}
          </div>
        </>
      )}
    </div>
  );
}
