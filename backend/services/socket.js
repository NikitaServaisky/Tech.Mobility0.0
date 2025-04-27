const { Server } = require("socket.io");

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
    });

    socket.on("newRide", (rideData) => {
      io.emit("rideUpdate", rideData);
    });

    socket.on("rideAccepted", async (rideId, driverData) => {
      // Your ride acceptance logic here…
      io.emit("rideUpdate", { _id: rideId, status: "נלקח" });
    });

    socket.on("disconnect", () => {
      console.log("משתמש התנתק:", socket.id);
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
