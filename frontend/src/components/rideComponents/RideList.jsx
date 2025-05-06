import React from "react";
import Button from "../buttonComponent/button";

const RideList = ({ title, rides, onCancel }) => {
  return (
    <div className="ride-list-section">
      <h3>{title}</h3>
      {rides.length > 0 ? (
        rides.map((ride) => (
          <div key={ride._id} className="ride-item">
            <p>מאיפה: {ride.from}</p>
            <p>לאן: {ride.destination}</p>
            <p>סטטוס: {ride.status}</p>
            {onCancel && ["Pending", "Accepted"].includes(ride.status) && (
              <Button onClick={() => onCancel(ride._id)} label="בטל נסיעה" />
            )}
          </div>
        ))
      ) : (
        <p>אין נסיעות להצגה.</p>
      )}
    </div>
  );
};

export default RideList;
