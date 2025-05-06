import React, { useState, useEffect } from "react";
import List from "../../assets/lists/list";
import Button from "../../components/buttonComponent/button";
import MapView from "../../components/mapComponent/mapView";
import ChatBox from "../../components/chatComponents/ChatBox";
import RideList from "../../components/rideComponents/RideList";
import { geocodeAddress } from "../../utils/geocode";
import { getCleanUserId } from "../../utils/clearUser";
import { useCustomerSocket } from "../../hooks/useCustomerSocket";
import {
  fetchActiveRides,
  fetchRides,
  fetchRideHistory,
  createRide,
  cancelRide,
} from "../../api/rideApi";
import "./customerDashStyle.css";

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
  const [message, setMessage] = useState("");

  const userId = getCleanUserId();
  const rideId = activeRides[0]?._id;

  const { socket, messages, setMessages, driverLocation } = useCustomerSocket({
    userId,
    rideId,
    setRides,
    setActiveRides,
    setRideHistory,
  });

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [allRides, active, history] = await Promise.all([
          fetchRides(userId),
          fetchActiveRides(userId),
          fetchRideHistory(userId),
        ]);
        setRides(allRides);
        setActiveRides(active);
        setRideHistory(history);
      } catch (err) {
        console.error("Error loading rides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

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

  const handleNewRide = async () => {
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
        userId,
        from: pickupAddress,
        destination: destinationAddress,
        pickupCoords,
        destinationCoords,
        status: "Pending",
      };

      const response = await createRide(newRide);
      socket.emit("newRide", response.data);
    } catch (err) {
      console.error("Error creating ride", err);
      alert("משהו השתבש בעת יצירת הנסיעה.");
    }
  };

  const handleCancelRide = async (rideId) => {
    try {
      await cancelRide(rideId);
      alert("הנסיעה בוטלה בהצלחה");
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
        <ChatBox
          rideId={rideId}
          userId={userId}
          messages={messages}
          message={message}
          setMessage={setMessage}
          onSendMessage={sendMessage}
        />
      )}

      <RideList
        title="נסיעות פעילות"
        rides={activeRides}
        onCancel={handleCancelRide}
      />

      <RideList title="היסטוריית נסיעות" rides={rideHistory} />
    </div>
  );
};

export default CustomerDashboard;
