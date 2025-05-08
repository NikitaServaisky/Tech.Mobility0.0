import { useEffect, useState } from "react";

export const useDriverLocationListener = (socket) => {
  const [driverLocation, setDriverLocation] = useState({});

  useEffect(() => {
    const handleLocationUpdate = ({ driverId, coords }) => {
      setDriverLocation((prev) => ({
        ...prev,
        [driverId]: coords,
      }));
    };

    socket.on("driverLocation", handleLocationUpdate);

    return () => {
      socket.off("driverLocation", handleLocationUpdate);
    };
  }, [socket]);

  return driverLocation;
};
