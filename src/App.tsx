import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
// import { getSubareaForLatLng } from './utils/map.ts';
import { Subarea } from './utils/map.ts';



function App() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [subarea, setSubarea] = useState<string | null>(null);

  const getLocation = () => {
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLat(lat);
        setLng(lng);

        // setLat(49.4012450);
        // setLng(-123.5035870);
        // const result = await getSubareaForLatLng(lat, lng);
        // const result = await Subarea(lat, lng);
        const result = await Subarea(48.638323, -123.335312);
        setSubarea(result);
      },
      (err) => {
        setError(err.message);
      }
    );
  };

  return (
    <div className="app-container">
      <h2>GPS Calculator App</h2>

      <button onClick={getLocation} className="get-location-btn">
        Get My Location
      </button>

      <div className="location-info">
        {lat && lng ? (
          <>
            <p><b>Latitude:</b> {lat}</p>
            <p><b>Longitude:</b> {lng}</p>
            <p><b>Subarea:</b> {subarea != null ? subarea : "Not in the PFMA area"}</p>
          </>
        ) : (
          <p>No location yet</p>
        )}

        {error && (
          <p className="error-text">
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
