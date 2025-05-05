export const updateRidesState = (prev, updatedRide) => {
  const exists = prev.find((r) => r._id === updatedRide._id);
  return exists
    ? prev.map((r) => (r._id === updatedRide._id ? updatedRide : r))
    : [...prev, updatedRide];
};
