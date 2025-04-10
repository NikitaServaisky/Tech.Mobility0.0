import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import io from "socket.io-client";
import List from "../../../assets/lists/list";
import Button from "../../buttonComponent/button";
import MapView from "../../mapComponent/mapView";
import { getCleanUserId } from "../../../utils/clearUser";

//creating socket
const socket = io(import.meta.env.VITE_APP_API_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

const DriverDashboard = () => {
  //getting and saves driverId
  const driverId = getCleanUserId();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRide, setCurrentRide] = useState(null);
  const [driverStats, setDriverStats] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
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

    const fetchStats = async () => {
      if (!driverId) {
        console.log("driver is not found by driverId");
        return;
      }
      try {
        const response = await axiosInstance.get(`/driver/stats/${driverId}`);
        console.log("Driver Stats:", response.data);
        setDriverStats(response.data);
      } catch (err) {
        console.error("Error fetching driver stats", err);
      }
    };

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

    fetchRides();
    fetchStats();

    socket.on("rideUpdate", handleRideUpdate);

    return () => {
      socket.off("rideUpdate", handleRideUpdate);
    };
  }, [driverId]);

  //sharing location on realtime
  useEffect(() => {
    if (!driverId || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        socket.emit("driverLocationUpdate", { driverId, coords });
      },
      (err) => {
        console.warn("שגיאה במעקב מיקום:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [driverId]);

  const handleAcceptRide = async (rideId) => {
    if (!driverId) {
      return console.error("Driver id Missing!");
    }

    try {
      console.log("Accepting ride with:", { rideId, driverId });
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

  const handleRejectRide = async (rideId) => {
    if (!driverId) {
      console.warn("Missing driverId — cannot reject ride");
      return;
    }
    try {
      // שליחת הבקשה לשרת
      await axiosInstance.put(`/rides/${rideId}/reject`, { driverId });

      // עדכון הרשימה ב-React
      setRides((prev) => prev.filter((r) => r._id !== rideId));

      // שליחת עדכון דרך סוקט
      socket.emit("rideRejected", rideId);
    } catch (err) {
      console.error("Error reject ride:", err);
      alert("שגיאה בסירוב לנסיעה");
    }
  };

  return  (
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
                  <Button
                    onClick={() => handleRejectRide(ride._id)}
                    label="סרב לנסיעה"
                  />
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

      <MapView
        pickup={currentRide?.pickupCoords}
        destination={currentRide?.destinationCoords}
      />

      {driverStats && (
        <div className="driver-stats">
          <h3>📊 הסטטיסטיקות שלך</h3>
          <p>✅ נסיעות שאושרו: {driverStats.acceptedRides}</p>
          <p>❌ נסיעות שסורבו: {driverStats.rejectedRides}</p>
          <p>💰 רווח כולל: ₪{driverStats.totalEarnings}</p>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
