import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
// import { getSubareaForLatLng } from './utils/map.ts';
import { Subarea } from './utils/map.ts';
import joThomasLogo from './assets/jo-thomas-logo.png';

type CoordinateFormat = 'degree' | 'degree-minute' | 'degree-minute-second';

const COORDINATE_FORMAT_KEY = 'coordinate-format';

function isCoordinateFormat(value: string | null): value is CoordinateFormat {
  return value === 'degree' || value === 'degree-minute' || value === 'degree-minute-second';
}

function formatCoordinate(value: number, isLatitude: boolean, format: CoordinateFormat): string {
  const absoluteValue = Math.abs(value);
  const direction = isLatitude ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');

  if (format === 'degree') {
    return `${absoluteValue.toFixed(6)}° ${direction}`;
  }

  const degrees = Math.floor(absoluteValue);
  const rawMinutes = (absoluteValue - degrees) * 60;

  if (format === 'degree-minute') {
    return `${degrees}° ${rawMinutes.toFixed(4)}' ${direction}`;
  }

  const minutes = Math.floor(rawMinutes);
  const seconds = (rawMinutes - minutes) * 60;

  return `${degrees}° ${minutes}' ${seconds.toFixed(2)}" ${direction}`;
}



function App() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinateFormat, setCoordinateFormat] = useState<CoordinateFormat>(() => {
    const savedFormat = localStorage.getItem(COORDINATE_FORMAT_KEY);
    return isCoordinateFormat(savedFormat) ? savedFormat : 'degree-minute';
  });

  const [subarea, setSubarea] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(COORDINATE_FORMAT_KEY, coordinateFormat);
  }, [coordinateFormat]);

  const getLocation = () => {
    setError(null);
    setIsLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLat(lat);
        setLng(lng);

        const result = await Subarea(lat, lng);
        setSubarea(result);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h2>Canada Pacific Fishery Management Area</h2>
      </header>

      <main className="app-main">
        <fieldset className="coordinate-format-selector">
          <legend>Coordinate Unit</legend>
          <label>
            <input
              type="radio"
              name="coordinate-format"
              value="degree"
              checked={coordinateFormat === 'degree'}
              onChange={() => setCoordinateFormat('degree')}
            />
            Degree
          </label>
          <label>
            <input
              type="radio"
              name="coordinate-format"
              value="degree-minute"
              checked={coordinateFormat === 'degree-minute'}
              onChange={() => setCoordinateFormat('degree-minute')}
            />
            Deg Min
          </label>
          <label>
            <input
              type="radio"
              name="coordinate-format"
              value="degree-minute-second"
              checked={coordinateFormat === 'degree-minute-second'}
              onChange={() => setCoordinateFormat('degree-minute-second')}
            />
            Deg Min Sec
          </label>
        </fieldset>

        <button onClick={getLocation} className="get-location-btn" disabled={isLoading}>
          {isLoading ? '⏳ Locating…' : '📍 Get My Location'}
        </button>

        <div className="location-info" aria-live="polite">
          {error && (
            <div className="result-card error-card">
              <span className="error-icon">⚠️</span>
              <p className="error-text">{error}</p>
            </div>
          )}
          {lat !== null && lng !== null && (
            <div className="result-card">
              <div className="result-row">
                <span className="result-label">Latitude</span>
                <span className="result-value">{formatCoordinate(lat, true, coordinateFormat)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Longitude</span>
                <span className="result-value">{formatCoordinate(lng, false, coordinateFormat)}</span>
              </div>
              <div className="result-row result-row--subarea">
                <span className="result-label">PFMA Subarea</span>
                <span className="result-value result-value--subarea">
                  {subarea ?? 'Not in a PFMA'}
                </span>
              </div>
            </div>
          )}
          {!error && lat === null && (
            <p className="hint-text">Tap the button above to detect your location.</p>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <img src={joThomasLogo} alt="J.O. Thomas & Associates Ltd." className="footer-logo" />
        <p className="footer-copyright">© {new Date().getFullYear()} J.O. Thomas & Associates Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
//
export default App;
