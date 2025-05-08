import { useState } from "react";
import { geocodeAddress } from "../utils/geocode";

export const useAddressPicker = () => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [clickCount, setClickCount] = useState(0);

  const handleMapClick = (point) => {
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
  };

  const resolveAddresses = async () => {
    const pickupCoords = await geocodeAddress(pickupAddress);
    const destinationCoords = await geocodeAddress(destinationAddress);

    return { pickupCoords, destinationCoords };
  };

  const reset = () => {
    setPickup(null);
    setDestination(null);
    setPickupAddress('');
    setDestinationAddress('');
    setClickCount(0);
  }

  return {
    pickup,
    destination,
    pickupAddress,
    destinationAddress,
    setPickupAddress,
    setDestinationAddress,
    setPickup,
    setDestination,
    handleMapClick,
    resolveAddresses,
    reset,
  };
};
