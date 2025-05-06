const { Server } = require("socket.io");
const { sanitizeMessage } = require("../utils/sanitize");
const Ride = require("../models/rideSchema");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://tech-mobility0-0.vercel.app"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("משתמש מחובר:", socket.id);

    socket.on("registerDriver", () => {
      console.log("נהג מחובר:", socket.id);
    });

    socket.on("registerClient", (rideId) => {
      console.log("לקוח מחובר לנסיעה:", rideId);
      socket.join(rideId);
    });

    socket.on("newRide", (rideData) => {
      io.emit("rideUpdate", rideData);
    });

    socket.on("rideAccepted", async (rideId, driverData) => {
      console.log(`✅ נסיעה ${rideId} התקבלה ע"י נהג:`, driverData);
      io.emit("rideUpdate", { _id: rideId, status: "נלקח" });
    });

    socket.on("rideRejected", (rideId) => {
      console.log(`❌ נסיעה ${rideId} נדחתה`);
      io.emit("rideUpdate", { _id: rideId, status: "Rejected" });
    });

    socket.on("driverLocationUpdate", ({ driverId, coords }) => {
      console.log(`📍 מיקום נהג ${driverId}:`, coords);
      io.emit("driverLocation", { driverId, coords });
    });

    socket.on("joinRoom", ({ rideId, userId }) => {
      socket.join(rideId);
      (socket.userId = userId),
        (socket.rideId = rideId),
        console.log(`📦 משתמש ${socket.id} הצטרף לחדר: ${rideId}`);
    });

    socket.on("privateMessage", ({ rideId, senderId, message }) => {
      io.to(rideId).emit("privateMessage", {
        senderId,
        message,
        timestamp: Date.now(),
      });
    });

    socket.on("chatMessage", async ({ rideId, senderId, message }) => {
      // checking fields
      if (!rideId || !senderId || !message) return;

      // finded ride screen
      try {
        const ride = await Ride.findById(rideId);
        if (!ride) return;

        const participants = [
          ride.customerId.toString(),
          ride.driverId.toString(),
        ];
        if (!participants.includes(senderId)) {
          return socket.emit("chatError", {
            message: "Chat only available during active rides",
          });
        }

        // sanitize messages before sending
        const cleanMessage = sanitizeMessage(message);

        io.to(rideId).emit("chatMessage", {
          senderId,
          message: cleanMessage,
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error("Chat auth error:", err);
        socket.emit("chatError", {
          message: "Internal error while verfying chat sender",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("❎ משתמש התנתק:", socket.id);
    });

    socket.on("error", (err) => {
      console.error("❗ שגיאה בסוקט:", err);
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
