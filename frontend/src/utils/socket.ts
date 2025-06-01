import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const socket = io(BASE_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

export default socket;
