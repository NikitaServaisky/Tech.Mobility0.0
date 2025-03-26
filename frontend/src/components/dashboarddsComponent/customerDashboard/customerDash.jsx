import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import io from "socket.io-client";
import List from "../../../assets/lists/list";
import Button from "../../buttonComponent/button";
import MapView from "../../mapComponent/mapView";
import { geocodeAddress } from "../../../utils/geocode";
import "./customerDashStyle.css";

// Verify that the backend URL is correct
console.log("Backend URL:", import.meta.env.VITE_APP_API_URL);

// Create socket instance
const socket = io(import.meta.env.VITE_APP_API_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

const CustomerDashboard = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null); // hardcoded for now
  const [clickCount, setClickCount] = useState(0);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID is missing");
          setLoading(false);
          return;
        }
        const response = await axiosInstance.get("/rides", {
          params: { userId },
        });
        setRides(response.data);
      } catch (err) {
        console.error("Error fetching rides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();

    // Listen for rideUpdate events from the server
    socket.on("rideUpdate", (updatedRide) => {
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride._id === updatedRide._id ? updatedRide : ride
        )
      );
    });

    return () => {
      socket.off("rideUpdate");
    };
  }, []);

  const handleNewRide = async () => {
    console.log("pickup location", pickupAddress)
    try {
      const pickupCoords = await geocodeAddress(pickupAddress);
      const destinationCoords = await geocodeAddress(destinationAddress);
  
      if (!pickupCoords || !destinationCoords) {
        alert("נא להזין כתובות תקינות לאיסוף וליעד.");
        return;
      }
  
      setPickup(pickupCoords);
      setDestination(destinationCoords);
  
      const newRide = {
        from: pickupCoords,
        destination: destinationCoords,
        status: "waiting",
      };
  
      const response = await axiosInstance.post("/rides", newRide);
  
      socket.emit("newRide", response.data);
    } catch (err) {
      console.error("Error creating ride", err);
      alert("משהו השתבש בעת יצירת הנסיעה.");
    }
  };
  

  return (
    <div className="customer-dashboard">
      <h2>לוח עבודה של לקוח</h2>
      {loading ? (
        <p>טוען נתונים...</p>
      ) : rides.length > 0 ? (
        <List
          items={rides}
          renderItem={(ride) => (
            <div className="ride-item" key={ride._id}>
              <p>נקודת איסוף: {ride.from}</p>
              <p>🚗 יעד: {ride.destination}</p>
              <p>📌 סטאטוס: {ride.status}</p>
            </div>
          )}
        />
      ) : (
        <p>אין לך נסיעות כרגע.</p>
      )}
      <div className="address-form">
        <input
          type="text"
          placeholder="כתובת איסוף"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="כתובת יעד"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
        />
        <Button onClick={handleNewRide} label="הזמן נהג" />
      </div>
      <MapView
        pickup={pickup}
        destination={destination}
        onPickupSelect={(point) => {
          if (clickCount === 0) {
            setPickup(point);
            setClickCount(1);
          } else if (clickCount === 1) {
            setDestination(point);
            setClickCount(2);
          } else {
            setPickup(point);
            setDestination(null);
            setClickCount(1);
          }
        }}
      />
    </div>
  );
};

export default CustomerDashboard;
