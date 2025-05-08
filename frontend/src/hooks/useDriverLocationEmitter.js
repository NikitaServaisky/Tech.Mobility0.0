import { useEffect } from "react";

export const useDriverLocationEmitter = ({driverId, socket}) => {
    useEffect(() => {
        if (!driverId || !navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };
                socket.emit("driverLocationUpdate", {driverId, coords});
            },
            (err) => {
                console.warn("שגיאה במעקב מיקום:", err);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 1000,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [driverId, socket]);
};