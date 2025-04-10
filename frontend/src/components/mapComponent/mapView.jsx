import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const MapView = ({ pickup, destination, onPickupSelect, driverLocations = {} }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  // שלב 1: שליפת מיקום נוכחי
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
          setUserLocation(coords);

          // אם המפה כבר קיימת - תמרכז אליה
          if (mapRef.current) {
            mapRef.current.setView([coords.lat, coords.lon], 14);
          }
        },
        (err) => {
          console.warn("⚠️ שגיאה בשליפת מיקום:", err.message);
        }
      );
    } else {
      console.warn("⚠️ הדפדפן לא תומך ב-Geolocation");
    }
  }, []);

  // שלב 2: יצירת מפה
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      const map = L.map(mapContainerRef.current).setView([32.0853, 34.7818], 13);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© המפה באדיבות OpenStreetMap",
      }).addTo(map);

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        if (onPickupSelect) {
          onPickupSelect({ lat, lon: lng });
        }
      });
    }
  }, []);

  // שלב 3: הצגת נקודות ומסלול + נהגים
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // ניקוי שכבות ישנות
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // הצגת מיקום נוכחי
    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lon], {
        title: "המיקום שלך",
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          iconSize: [25, 25],
        }),
      }).addTo(map);
    }

    // הצגת נקודת איסוף
    if (pickup) {
      L.marker([pickup.lat, pickup.lon], {
        title: "Pickup",
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          iconSize: [30, 30],
        }),
      }).addTo(map);
    }

    // הצגת יעד
    if (destination) {
      L.marker([destination.lat, destination.lon], {
        title: "Destination",
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854866.png",
          iconSize: [30, 30],
        }),
      }).addTo(map);
    }

    // מסלול בין pickup ל-destination
    if (pickup && destination) {
      const API_KEY = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
      const url = `https://graphhopper.com/api/1/route?point=${pickup.lat},${pickup.lon}&point=${destination.lat},${destination.lon}&profile=car&locale=he&points_encoded=false&key=${API_KEY}`;

      axios.get(url)
        .then(res => {
          const path = res.data.paths[0].points.coordinates.map(([lon, lat]) => [lat, lon]);
          const routeLine = L.polyline(path, { color: "blue", weight: 5 }).addTo(map);
          map.fitBounds(routeLine.getBounds());
        })
        .catch(err => console.error("Route error:", err));
    }

    // ✅ הצגת נהגים בזמן אמת
    Object.entries(driverLocations).forEach(([driverId, coords]) => {
      L.marker([coords.lat, coords.lon], {
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", // אייקון נהג
          iconSize: [30, 30],
        }),
        title: `נהג: ${driverId}`,
      }).addTo(map);
    });

  }, [pickup, destination, userLocation, driverLocations]);

  return <div ref={mapContainerRef} style={{ height: "400px", width: "100%" }} />;
};

export default MapView;
