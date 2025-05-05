import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import io from "socket.io-client";
import List from "../../../assets/lists/list";
import Button from "../../buttonComponent/button";
import MapView from "../../mapComponent/mapView";
import { geocodeAddress } from "../../../utils/geocode";
import { getCleanUserId } from "../../../utils/clearUser";
import { createSocket } from "../../../utils/createSocket";
import { updateRidesState } from "../../../utils/rideHelpers";
import "./customerDashStyle.css";

// Create socket instance
const socket = createSocket()

const CustomerDashboard = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [activeRides, setActiveRides] = useState([]);
  const [rideHistory, setRideHistory] = useState([]);
  const [driverLocation, setDriverLocation] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const userId = getCleanUserId();
  const rideId = activeRides[0]?._id;

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing");
      setLoading(false);
      return;
    }

    const fetchRides = async () => {
      try {
        const response = await axiosInstance.get("/rides", {
          params: { userId },
        });
        setRides(response.data);
      } catch (err) {
        console.error("Error fetching rides:", err);
      }
    };

    const fetchActive = async () => {
      try {
        const response = await axiosInstance.get("/rides/active", {
          params: { userId },
        });
        setActiveRides(response.data);
      } catch (err) {
        console.error("Error fetching active rides:", err);
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get("/rides/history", {
          params: { userId },
        });
        setRideHistory(response.data);
      } catch (err) {
        console.error("Error fetching ride history:", err);
      }
    };

    // קריאה ראשונית לנתונים
    const fetchAllRides = async () => {
      setLoading(true);
      await Promise.all([fetchRides(), fetchActive(), fetchHistory()]);
      setLoading(false);
    };

    fetchAllRides();

    // האזנה לשינויים בזמן אמת
    socket.on("rideUpdate", (updatedRide) => {
      console.log("rideUpdate received:", updatedRide);

      if (["Pending", "Accepted", "InProgress"].includes(updatedRide.status)) {
        setActiveRides((prev) => {
          const exists = prev.find((r) => r._id === updatedRide._id);
          return exists
            ? prev.map((r) => (r._id === updatedRide._id ? updatedRide : r))
            : [...prev, updatedRide];
        });
      } else if (["Completed", "Cancelled"].includes(updatedRide.status)) {
        setRideHistory((prev) => {
          const exists = prev.find((r) => r._id === updatedRide._id);
          return exists
            ? prev.map((r) => (r._id === updatedRide._id ? updatedRide : r))
            : [...prev, updatedRide];
        });

        setActiveRides((prev) => prev.filter((r) => r._id !== updatedRide._id));
      }

        setRides((prev) => updateRidesState(prev, updatedRide));
    });

    socket.on("driverLocation", ({ driverId, coords }) => {
      setDriverLocation((prev) => ({
        ...prev,
        [driverId]: coords,
      }));
    });

    // socket for chat room customer
    if (rideId) {
      socket.emit("joinRoom", { rideId, userId });
    }

    socket.on("privateMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("rideUpdate");
      socket.off("driverLocation");
      socket.off("privateMessage");
    };
  }, [rideId, userId]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("privateMessage", {
        rideId,
        senderId: userId,
        message,
      });
      setMessage("");
    }
  };

  // Creating new ride customer
  const handleNewRide = async () => {
    const userId = getCleanUserId();
    console.log("pickup location", pickupAddress);
    console.log("🚀 userId to send:", userId, typeof userId);

    try {
      const pickupCoords = await geocodeAddress(pickupAddress);
      const destinationCoords = await geocodeAddress(destinationAddress);

      if (!pickupCoords || !destinationCoords || !userId) {
        alert("נא להזין כתובות תקינות לאיסוף וליעד.");
        return;
      }

      setPickup(pickupCoords);
      setDestination(destinationCoords);

      const newRide = {
        userId,
        from: pickupAddress,
        destination: destinationAddress,
        pickupCoords,
        destinationCoords,
        status: "Pending",
      };

      console.log("📦 rideData:", newRide);

      const response = await axiosInstance.post("/rides/create-ride", newRide);
      socket.emit("newRide", response.data);
    } catch (err) {
      console.error("Error creating ride", err);
      alert("משהו השתבש בעת יצירת הנסיעה.");
    }
  };

  const handleCancelRide = async (rideId) => {
    try {
      const response = await axiosInstance.put(`/rides/${rideId}/cancel`);
      alert("הנסיעה בוטלה בהצלחה");
      console.log("cancel response", response.data);
    } catch (err) {
      console.error("Error cancelling ride:", err);
      alert("שגיאה בביטול הנסיעה");
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
        driverLocation={driverLocation}
      />
      {rideId && (
        <div className="chat-box">
          <h3>צ'אט עם הנהג</h3>
          <div className="messages">
            {messages.map((msg, idx) => (
              <p key={idx}>
                <strong>{msg.senderId === userId ? "אתה" : "נהג"}:</strong>{" "}
                {msg.message}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="כתוב הודעה לנהג..."
          />
          <Button onClick={sendMessage} label="שלח הודעה" />
        </div>
      )}

      <h3>נסיעות פעילות</h3>
      {activeRides.length > 0 ? (
        activeRides.map((ride) => (
          <div key={ride._id} className="ride-item">
            <p>מאיפה: {ride.from}</p>
            <p>לאן: {ride.destination}</p>
            <p>סטטוס: {ride.status}</p>
            {["Pending", "Accepted"].includes(ride.status) && (
              <Button
                onClick={() => handleCancelRide(ride._id)} // ← חובה כך
                label="בטל נסיעה"
              />
            )}
          </div>
        ))
      ) : (
        <p>אין נסיעות פעילות כרגע.</p>
      )}

      <h3>היסטוריית נסיעות</h3>
      {rideHistory.length > 0 ? (
        rideHistory.map((ride) => (
          <div key={ride._id} className="ride-item">
            <p>מאיפה: {ride.from}</p>
            <p>לאן: {ride.destination}</p>
            <p>סטטוס: {ride.status}</p>
          </div>
        ))
      ) : (
        <p>אין היסטוריית נסיעות עדיין.</p>
      )}
    </div>
  );
};

export default CustomerDashboard;
