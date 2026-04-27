// ─────────────────────────────────────────────────────────────
// NestJS Bootstrap — Main entry point
// Configures CORS, validation, Helmet, and starts HTTP server.
// ─────────────────────────────────────────────────────────────

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), "../../.env") });

import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import helmet from "helmet";
import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Setup Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,  // Required for Razorpay webhook signature verification
    logger:
      process.env["NODE_ENV"] === "production"
        ? ["error", "warn"]
        : ["log", "debug", "error", "warn", "verbose"],
  });

  // Enable graceful shutdown hooks 
  app.enableShutdownHooks();

  // ── Security Headers via Helmet ──────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://checkout.razorpay.com", "https://cdn.jsdelivr.net"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.razorpay.com", "https://api.kite.trade", "wss:"],
          frameSrc: ["https://api.razorpay.com"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
      xFrameOptions: { action: "deny" },
    })
  );

  // ── CORS ─────────────────────────────────────────────────────
  const allowedOrigins = (
    process.env["ALLOWED_ORIGINS"] ?? "http://localhost:3000"
  )
    .split(",")
    .map((o) => o.trim());

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow requests with no origin (mobile apps, curl, etc.) only in dev
      if (!origin && process.env["NODE_ENV"] !== "production") {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // ── Global Validation Pipe ───────────────────────────────────
  // Validates all incoming DTOs using class-validator decorators.
  // whitelist: strips unknown properties; forbidNonWhitelisted: rejects them.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: process.env["NODE_ENV"] === "production",
    })
  );

  // ── Global Exception Filter ──────────────────────────────────
  // Never exposes stack traces or internals in production.
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── Global Prefix ────────────────────────────────────────────
  app.setGlobalPrefix("api/v1");

  const port = parseInt(process.env["PORT"] ?? "4000", 10);
  await app.listen(port);

  console.log(
    `🚀 ThirdLeaf API running on http://localhost:${port}/api/v1 [${process.env["NODE_ENV"] ?? "development"}]`
  );
}

bootstrap().catch((err: unknown) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});
