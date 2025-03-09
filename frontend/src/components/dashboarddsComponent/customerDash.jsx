import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import io from "socket.io-client";
import List from "../../assets/lists/list";
import Button from "../buttonComponent/button";

// Verify that the backend URL is correct
console.log("Backend URL:", import.meta.env.VITE_APP_API_URL);

// Create socket instance
const socket = io(import.meta.env.VITE_APP_API_URL);

const CustomerDashboard = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID is missing");
          setLoading(false);
          return;
        }
        const response = await axiosInstance.get("/rides", { params: { userId } });
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
        prevRides.map((ride) => (ride._id === updatedRide._id ? updatedRide : ride))
      );
    });

    return () => {
      socket.off("rideUpdate");
    };
  }, []);

  const handleNewRide = async () => {
    try {
      const newRide = { from: "", destination: "", status: "" };
      const response = await axiosInstance.post("/rides", newRide);
      // Use socket instance to emit the event
      socket.emit("newRide", response.data);
    } catch (err) {
      console.error("Error creating ride", err);
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
              <Button onClick={handleNewRide} label="הזמן נהג" />
            </div>
          )}
        />
      ) : (
        <p>אין לך נסיעות כרגע.</p>
      )}
    </div>
  );
};

export default CustomerDashboard;
