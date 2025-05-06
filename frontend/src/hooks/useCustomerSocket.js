import { useEffect, useState } from "react";
import { createSocket } from "../utils/createSocket";
import { updateRidesState } from "../utils/rideHelpers";

const socket = createSocket();

export const useCustomerSocket = ({
  userId,
  rideId,
  setRides,
  setActiveRides,
  setRideHistory,
}) => {
  const [messages, setMessages] = useState([]);
  const [driverLocation, setDriverLocation] = useState({});

  useEffect(() => {
    socket.on("rideUpdate", (updatedRide) => {
      if (["Pending", "Accepted", "InProgress"].includes(updatedRide.status)) {
        setActiveRides((prev) => {
          const exists = prev.find((r) => r._id === updatedRide._id);
          return exists
            ? prev.map((r) => (r._id === updatedRide._id ? updatedRide : r))
            : [...prev, updatedRide];
        });
      } else {
        setRideHistory((prev) => {
          const exists = prev.find((r) => r._id === updatedRide._id);
          return exists
            ? prev.map((r) => (r._id === updatedRide._id ? updatedRide : r))
            : [...prev, updatedRide];
        });

        setActiveRides((prev) =>
          prev.filter((r) => r._id !== updatedRide._id)
        );
      }

      setRides((prev) => updateRidesState(prev, updatedRide));
    });

    socket.on("driverLocation", ({ driverId, coords }) => {
      setDriverLocation((prev) => ({
        ...prev,
        [driverId]: coords,
      }));
    });

    socket.on("privateMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    if (rideId) {
      socket.emit("joinRoom", { rideId, userId });
    }

    return () => {
      socket.off("rideUpdate");
      socket.off("driverLocation");
      socket.off("privateMessage");
    };
  }, [rideId, userId]);

  return { socket, messages, setMessages, driverLocation };
};
