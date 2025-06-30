import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      `http://localhost:5173`,
      `http://localhost:4200`,
      `http://127.0.0.1:5500`,
    ],
    credentials: true,
  })
);

app.use(cookieParser());

const customLogger = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl} `);
  console.log(`[Gateway] Authorization:`, req.headers.authorization);
  console.log(req.body);

  next();
});
app.get("/test-gateway", (req, res) => {
  console.log("[Gateway] /test-gateway hit!");
  res.status(200).json({ message: "Gateway is working!" });
});

// AUTH SERVICE
app.use(
  "/api/v1",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/api/v1": "" },
    logger: customLogger,
  })
);

// Start the Gateway
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway is running at http://localhost:${PORT}`);
});
