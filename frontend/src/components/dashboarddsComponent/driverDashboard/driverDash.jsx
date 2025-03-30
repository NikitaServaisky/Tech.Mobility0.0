import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import io from "socket.io-client";
import List from "../../../assets/lists/list";
import Button from "../../buttonComponent/button";
import MapView from "../../mapComponent/mapView";

const socket = io(import.meta.env.VITE_APP_API_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});
const DriverDashboard = () => {
  const [rides, setRides] = useState([]); // rides list
  const [loading, setLoading] = useState(true); // loader
  const [currentRide, setCurrentRide] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      const driverId = localStorage.getItem("userId");

      if (!driverId) {
        console.warn("No driverId yet, skipping fetch");
        return;
      }
      try {
        const response = await axiosInstance.get("/driver/available-rides");
        setRides(response.data);
      } catch (err) {
        console.error("Error fetching available rides", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();

    const handleRideUpdate = (updatedRide) => {
      setRides((prev) => {
        // אם הנסיעה כבר לא זמינה (כבר נלקחה או בוטלה)
        if (updatedRide.status !== "Pending") {
          return prev.filter((r) => r._id !== updatedRide._id);
        }

        // אם הנסיעה עדיין זמינה
        const exists = prev.find((r) => r._id === updatedRide._id);
        return exists
          ? prev.map((r) => (r._id === updatedRide._id ? updatedRide : r))
          : [...prev, updatedRide];
      });
    };

    socket.on("rideUpdate", handleRideUpdate);

    return () => {
      socket.off("rideUpdate", handleRideUpdate);
    };
  }, []);

  const handleAcceptRide = async (rideId) => {
    const driverId = localStorage.getItem("userId");
  
    if (!driverId) {
      return console.error("Driver id Missing!");
    }
  
    try {
      await axiosInstance.put(`/rides/${rideId}/accept`, { driverId });
      console.log("✅ Ride accepted! driverId length:", driverId.length);
  
      socket.emit("rideAccepted", rideId, driverId);
  
      const accepted = rides.find((r) => r._id === rideId);
      if (accepted) {
        setCurrentRide(accepted);
      }
    } catch (err) {
      console.error("Error accepting ride:", err);
    }
  };
  

  return (
    <div className="driver-dashboard">
      {!currentRide ? (
        <>
          <h2>נסיעות זמינות</h2>
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
                  <Button
                    onClick={() => handleAcceptRide(ride._id)}
                    label="אשר נסיעה"
                  />
                  <Button label="סרב לנסיעה" />
                </div>
              )}
            />
          ) : (
            <p>אין לך נסיעות כרגע.</p>
          )}
        </>
      ) : (
        <h2>אתה בדרך לנסיעה</h2>
      )}
  
      {/* ✅ Map always visible */}
      <MapView
        pickup={currentRide?.pickupCoords}
        destination={currentRide?.destinationCoords}
      />
    </div>
  );
  
};

export default DriverDashboard;
