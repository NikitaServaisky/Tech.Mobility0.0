import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import List from "../../assets/lists/list";
import Button from "../buttonComponent/button";

const socket = io(`${process.env.REACT_APP_API_URL}`);

const DriverDashboard = () => {
  const [rides, setRides] = useState([]); //rides list.
  const [loading, setLoading] = useState(true); //loader.

  useEffect(() => {
    const fetchRides = async () => {
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

    //runtime listner from server
    socket.on('rideUpdate', (updateRide) => {
        setRides((prevRides) => 
            prevRides.map((ride) => (ride._id === updateRide._id ? updateRide : ride))
        );
    });

    return () => {
        socket.off("rideUpdate");
    };
}, []);

const handleAcceptRide = async (rideId) => {
    try {
        const driverId = localStorage.getItem("userId");
        if (!driverId) return console.error("Driver id Missing!");

        await axiosInstance.put(`/rides/${rideId}/accept`, {driverId});

        //send to customer and dirvers
        socket.emit("rideAccepted", rideId, driverId);
    } catch (err) {
        console.error("Error accepting ride:", err);
    }
};

  return (
    <div className="deriver-dashboard">
        <h2>נסיעות זמינות</h2>
        {loading ? (
                <p>טוען נתונים...</p>
            ) : rides.length > 0 ? (
                <List
                    items={rides}
                    renderItem={(ride) => (
                        <div className="ride-item">
                            <p>נקודת איסוף: {ride.from}</p>
                            <p>🚗 יעד: {ride.destination}</p>
                            <p>📌 סטאטוס: {ride.status}</p>
                            <Button onClick={() => handleAcceptRide(ride._id)} label={'אשר נסיעה'}/>
                            <Button label={'סרב לנסיעה'}/>
                        </div>
                    )}
                />
            ) : (
                <p>אין לך נסיעות כרגע.</p>
            )}
    </div>
  );
};

export default DriverDashboard;
