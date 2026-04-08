import { clerkPlugin } from "@clerk/fastify";
import fastify from "fastify";

import { shouldBeUser } from "./middleware/authMiddleware.js";

const fastifyInstance = fastify();

fastifyInstance.register(clerkPlugin);

fastifyInstance.get(
  "/test",
  { preHandler: shouldBeUser },
  async (request, reply) => {
    return reply.send({
      message: "Order Service Authenticated",
      userId: request.userId,
    });
  },
);

fastifyInstance.get("/health", (request, reply) => {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

const start = async () => {
  try {
    await fastifyInstance.listen({ port: 8001 });
    console.log("Order Service is running on port 8001");
  } catch (err) {
    fastifyInstance.log.error(err);
    process.exit(1);
  }
};

start();
