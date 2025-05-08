import axiosInstance from "./axios";

// ============ Customer APIs ============

export const fetchRides = (userId) =>
  axiosInstance.get("/rides", { params: { userId } });

export const fetchActiveRides = (userId) =>
  axiosInstance.get("/rides/active", { params: { userId } });

export const fetchRideHistory = (userId) =>
  axiosInstance.get("/rides/history", { params: { userId } });

export const createRide = (rideData) =>
  axiosInstance.post("/rides/create-ride", rideData);

export const cancelRide = (rideId) =>
  axiosInstance.put(`/rides/${rideId}/cancel`);

// ============ Driver APIs ============

export const fetchAvailableRides = async () => {
  const response = await axiosInstance.get("/driver/available-rides");
  return response.data;
};

export const fetchDriverStats = async (driverId) => {
  const response = await axiosInstance.get(`/driver/stats/${driverId}`);
  return response.data;
};

export const acceptRide = (rideId, driverId) =>
  axiosInstance.put(`/rides/${rideId}/accept`, { driverId });

export const rejectRide = (rideId, driverId) =>
  axiosInstance.put(`/rides/${rideId}/reject`, { driverId });

export const completeRide = (rideId) =>
  axiosInstance.put(`/rides/${rideId}/complete`);
