import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const MapView = ({ pickup, destination, onPickupSelect }) => {
  useEffect(() => {
    const map = L.map("map").setView([32.0853, 34.7818], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    if (pickup) {
      L.marker([pickup.lat, pickup.lon], { title: "Pickup" }).addTo(map);
    }

    if (destination) {
      L.marker([destination.lat, destination.lon], { title: "Destination" }).addTo(map);
    }

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

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (onPickupSelect) {
        onPickupSelect({ lat, lon: lng });
      }
    });

    return () => map.remove();
  }, [pickup, destination, onPickupSelect]);

  return <div id="map" style={{ height: "400px", width: "100%" }} />;
};

export default MapView;
