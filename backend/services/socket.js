const { Server } = require("socket.io");
const Ride = Require("../models/rideSchema");

let io;
const drivers = new Set(); // אוסף מזהים של נהגים מחוברים
const clients = new Map(); // מיפוי של מזהי לקוחות לנסיעות שלהם

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("משתמש מחובר:", socket.id);

    socket.on("registerDriver", () => {
      drivers.add(socket.id);
      console.log("נהג מחובר:", socket.id);
    });

    socket.on("registerClient", (rideId) => {
      clients.set(socket.id, rideId);
      console.log("לקוח מחובר לנסיעה:", rideId);
    });

    socket.on("newRide", (rideData) => {
      io.to([...drivers]).emit("rideUpdate", rideData); // שולח רק לנהגים
    });

    socket.on("rideAccepted", async (rideId, driverData) => {
      try {
        const updatedRide = await Ride.findByIdAndUpdate(
          rideId,
          { status: "נלקח", driver: driverData.id },
          { new: true }
        );

        if (!updatedRide) {
          console.error("נסיעה לא נמצאה");
          return;
        }

        const rideClientSocket = [...clients.entries()].find(
          ([, id]) => id === rideId
        )?.[0];

        const driverDetails = {
          name: driverData.name,
          carNumber: driverData.carNumber,
          color: driverData.color,
          type: driverData.type,
          model: driverData.model,
        };

        io.to([...drivers]).emit("rideUpdate", updatedRide); // עדכון לכל הנהגים
        if (rideClientSocket) {
          io.to(rideClientSocket).emit("rideTaken", {
            rideId,
            driverDetails,
          });
        }
      } catch (err) {
        console.error("שגיאה בעדכון נסיעה:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("משתמש התנתק:", socket.id);
      drivers.delete(socket.id);
      clients.delete(socket.id);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
