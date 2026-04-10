import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

app.use(
  cors({
    origin: [
      "http://localhost:3002",
      "http://localhost:3003",
      // "http://localhost",
      // "http://127.0.0.1",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(clerkMiddleware());

app.get("/test", shouldBeUser, (req: Request, res: Response) => {
  return res.json({
    message: "Product Service Authenticated",
    userId: req.userId,
  });
});
app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/products", productRouter);
app.use("/categories", categoryRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

app.listen(8000, () => {
  console.log("Product Service is running on port 8000");
});
