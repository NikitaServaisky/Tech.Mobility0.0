import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import List from "../../assets/lists/list";
import Button from "../buttonComponent/button";

const CustomerDashboard = () => {
    const [rides, setRides] = useState([]); // rides list
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchRides = async () => {
            try {
                const userId = localStorage.getItem("userId"); // geting userId from lacalstorge
                if (!userId) {
                    console.error("User ID is missing");
                    setLoading(false);
                    return;
                }

                const response = await axiosInstance.get("/rides", {
                    params: { userId }
                });

                setRides(response.data); // seting data
                console.log("Fetched rides:", response.data);
            } catch (err) {
                console.error("Error fetching rides:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, []);

    const handleNewRide = async () => {
        try {
            const newRide = {from: "", destination: "", status: ""};

            const response = await axiosInstance.post('/rides', newRide);

            WebSocket.emit("newRide", response.data);
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
                        <div className="ride-item">
                            <p>נקודת איסוף: {ride.from}</p>
                            <p>🚗 יעד: {ride.destination}</p>
                            <p>📌 סטאטוס: {ride.status}</p>
                            <Button onClick={handleNewRide} label={"הזמן נהג"} />
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
