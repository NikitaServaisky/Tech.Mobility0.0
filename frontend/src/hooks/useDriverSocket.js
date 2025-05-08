import { useEffect, useState } from "react";
import { createSocket } from "../utils/createSocket";
import { updateRidesState } from "../utils/rideHelpers";

const socket = createSocket();

export const useDriverSocket = ({ driverId, currentRide, setRides }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleRideUpdate = (updatedRide) => {
      setRides((prev) => updateRidesState(prev, updatedRide));
    };

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

  return { socket, messages, setMessages };
};
