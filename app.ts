import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const httpsEnabled = process.env.HTTPS_ENABLED === "true";

const defaultProxyHops = isProduction ? 1 : 0;
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS ?? defaultProxyHops);

if (Number.isInteger(trustProxyHops) && trustProxyHops >= 0) {
  app.set("trust proxy", trustProxyHops);
}
if (httpsEnabled) {
  app.use(helmet());
} else {
  app.use(
    helmet({
      strictTransportSecurity: false,
      contentSecurityPolicy: {
        directives: {
          "upgrade-insecure-requests": null,
        },
      },
    }),
  );
}

app.use(express.json({ limit: "20kb" }));

const localDevelopmentOrigins = new Set([
  "http://localhost:5500",
  "http://127.0.0.1:5500",
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin) {
    next();
    return;
  }

  const host = req.get("host");

  const requestOrigin = host ? `${req.protocol}://${host}` : undefined;

  const isSameOrigin = origin === requestOrigin;

  const isLocalDevelopment =
    !isProduction && localDevelopmentOrigins.has(origin);

  cors({
    origin: isSameOrigin || isLocalDevelopment,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
    maxAge: 600,
  })(req, res, next);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const taskRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    error: "Too many requests. Please try again later.",
  },
});

app.use("/tasks", taskRateLimiter, taskRoutes);

app.use(express.static(path.resolve(process.cwd(), "front-end")));

app.use(errorHandler);

export default app;
