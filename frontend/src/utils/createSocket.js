import io from "socket.io-client";

export const createSocket = () => io(import.meta.env.VITE_APP_API_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});
