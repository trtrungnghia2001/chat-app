import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import ENV_CONFIG from "./env.config.js";

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      `http://localhost:5173`,
      `http://localhost:4200`,
      `http://127.0.0.1:5500`,
      ENV_CONFIG.URL_CLIENT,
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
  },
});

export { io, httpServer };
