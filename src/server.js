require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { verifyMailConnection } = require("./config/mail");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const { notFoundHandler, globalErrorHandler } = require("./middlewares/error.middleware");
const logger = require("./utils/logger");

const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please slow down.", code: "RATE_LIMIT_EXCEEDED" },
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined", { stream: { write: (msg) => logger.http(msg.trim()) } }));
}

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok", timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || "development" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

const PORT = parseInt(process.env.PORT, 10) || 3000;

const bootstrap = async () => {
  try {
    await connectDB();
    await verifyMailConnection();

    const server = app.listen(PORT, () => {
      logger.info(` Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => { logger.info("HTTP server closed."); process.exit(0); });
      setTimeout(() => { logger.error("Forcing shutdown after timeout."); process.exit(1); }, 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("unhandledRejection", (reason) => { logger.error("Unhandled Rejection:", reason); shutdown("unhandledRejection"); });
    process.on("uncaughtException", (err) => { logger.error("Uncaught Exception:", err); shutdown("uncaughtException"); });

  } catch (err) {
    logger.error("Failed to bootstrap application:", err);
    process.exit(1);
  }
};

bootstrap();

module.exports = app;
