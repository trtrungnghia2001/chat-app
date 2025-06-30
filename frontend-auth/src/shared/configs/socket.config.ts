import { io } from "socket.io-client";
import ENV_CONFIG from "./env.config";

export const chatSocket = io(ENV_CONFIG.URL_SOKET, {
  autoConnect: false,
});
