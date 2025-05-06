import axiosInstance from "./axios";

export const fetchRides = (userId) =>
  axiosInstance.get("/rides", { params: { userId } });

export const fetchActiveRides = (userId) =>
  axiosInstance.get("/rides/actine", { params: { userId } });

export const fetchRideHistory = (userId) =>
    axiosInstance.get("/rides/history", {params: {userId}});

export const createRide = (rideData) => 
    axiosInstance.post("/rides/create-ride", rideData);

export const cancelRide = (rideId) =>
    axiosInstance.put(`/rides/$(rideId)/cancel`);