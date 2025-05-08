// 1. React
import React, { useEffect, useState } from "react";

// 2. Internal utils & API
import { getCleanUserId } from "../../utils/clearUser";
import { useDriverLocationEmitter } from "../../hooks/useDriverLocationEmitter";
import {
  fetchAvailableRides,
  fetchDriverStats,
  acceptRide,
  rejectRide,
  completeRide,
} from "../../api/rideApi";

// 3. Components
import List from "../../assets/lists/list";
import Button from "../../components/buttonComponent/button";
import MapView from "../../components/mapComponent/mapView";
import ChatBox from "../../components/chatComponents/ChatBox";

const DriverDashboard = () => {
  const driverId = getCleanUserId();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentRide, setCurrentRide] = useState(null);
  const [driverStats, setDriverStats] = useState(null);
  const [message, setMessage] = useState("");

  const { socket, messages, setMessages } = useDriverSocket({
    driverId,
    currentRide,
    setRides,
  });

  useDriverLocationEmitter({ driverId, socket });
  
  useEffect(() => {
    const fetchRides = async () => {
      if (!driverId) return;
      try {
        const data = await fetchAvailableRides();
        setRides(data);
      } catch (err) {
        console.error("Error fetching available rides", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      if (!driverId) return;
      try {
        const stats = await fetchDriverStats(driverId);
        setDriverStats(stats);
      } catch (err) {
        console.error("Error fetching driver stats", err);
      }
    };

    fetchRides();
    fetchStats();
  }, [driverId, currentRide]);

  useEffect(() => {
    socket.on("privateMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("privateMessage");
  }, []);

  const handleAcceptRide = async (rideId) => {
    if (!driverId) return;
    try {
      await acceptRide(rideId, driverId);
      socket.emit("rideAccepted", rideId, driverId);
      const accepted = rides.find((r) => r._id === rideId);
      if (accepted) setCurrentRide(accepted);
    } catch (err) {
      console.error("Error accepting ride:", err);
    }
  };

  const handleRejectRide = async (rideId) => {
    if (!driverId) return;
    try {
      await rejectRide(rideId, driverId);
      setRides((prev) => prev.filter((r) => r._id !== rideId));
      socket.emit("rideRejected", rideId);
    } catch (err) {
      console.error("Error rejecting ride:", err);
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

  const handleCompleteRide = async () => {
    try {
      await completeRide(currentRide._id);
      socket.emit("rideCompleted", {
        rideId: currentRide._id,
        message: "Ride completed successfully",
      });
      alert("The ride is complete!");
      setCurrentRide(null);
    } catch (err) {
      console.error("Error completing ride:", err);
      alert("Error completing ride");
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
        <ChatBox
          rideId={currentRide._id}
          userId={driverId}
          messages={messages}
          message={message}
          setMessage={setMessage}
          onSendMessage={sendMessage}
        />
      )}

      {currentRide && <Button onClick={handleCompleteRide} label="finish" />}
    </div>
  );
};

export default DriverDashboard;
