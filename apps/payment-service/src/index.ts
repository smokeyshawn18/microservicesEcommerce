import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { shouldBeUser } from "./middleware/authMiddleware.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
  }),
);

app.use("*", clerkMiddleware());

// Format uptime in a readable format

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/test", shouldBeUser, (c) => {
  return c.json({
    message: "Payment Service Authenticated",
    userId: c.get("userId"),
  });
});

const start = async () => {
  try {
    await serve({
      fetch: app.fetch,
      port: 8002,
    });
    console.log("Payment Service is running on port 8002");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
