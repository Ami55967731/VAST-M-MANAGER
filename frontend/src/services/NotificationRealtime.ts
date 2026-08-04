import type { Notification } from "../types/Notification";
import { io, type Socket } from "socket.io-client";

const socketUrl = "http://localhost:3000";
let socket: Socket | null = null;
const listeners = new Set<(notification: Notification) => void>();

function connect() {
  if (socket || typeof window === "undefined") return;

  socket = io(socketUrl, {
    transports: ["polling", "websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
  });

  socket.on("notification", (notification: Notification) => {
    listeners.forEach((listener) => listener(notification));
  });

  socket.on("connect_error", (error) => {
    console.error("Notification socket connection failed", error);
  });
}

export function subscribeToNotifications(
  listener: (notification: Notification) => void,
) {
  listeners.add(listener);
  connect();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      socket?.disconnect();
      socket = null;
    }
  };
}