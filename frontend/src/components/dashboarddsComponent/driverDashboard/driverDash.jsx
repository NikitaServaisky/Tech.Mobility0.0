import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import List from "../../../assets/lists/list";
import Button from "../../buttonComponent/button";
import MapView from "../../mapComponent/mapView";
import { getCleanUserId } from "../../../utils/clearUser";
import { createSocket } from "../../../utils/createSocket";
import { updateRidesState } from "../../../utils/rideHelpers";
//creating socket
const socket = createSocket();

const DriverDashboard = () => {
  //getting and saves driverId
  const driverId = getCleanUserId();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRide, setCurrentRide] = useState(null);
  const [driverStats, setDriverStats] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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
      setRides((prev) => updateRidesState(prev, updatedRide));
    };

    fetchRides();
    fetchStats();

    socket.on("rideUpdate", handleRideUpdate);

    if (currentRide?._id) {
      socket.emit("joinRoom", currentRide?._id);
    }

    socket.on("privateMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("rideUpdate", handleRideUpdate);
      socket.off("privateMessage");
    };
  }, [driverId, currentRide]);

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

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("privateMessage", {
        rideId: currentRide?._id,
        senderId: driverId,
        message,
      });
      setMessage("");
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

      {currentRide && (
        <div className="chat-section">
          <h3>💬 צ'אט עם הלקוח</h3>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className="chat-message">
                <strong>{msg.senderId === driverId ? "אתה:" : "לקוח:"}</strong>{" "}
                {msg.message}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="כתוב הודעה ללקוח..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              onClick={() => {
                if (message.trim()) {
                  socket.emit("privateMessage", {
                    rideId: currentRide._id,
                    senderId: driverId,
                    message,
                  });
                  setMessage("");
                }
              }}
              label="שלח"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
