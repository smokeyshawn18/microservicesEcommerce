import { Order } from "@repo/order-db";
import { FastifyInstance } from "fastify";
import { shouldBeUser, shouldBeAdmin } from "../middleware/authMiddleware";

export const orderRoute = async (fastify: FastifyInstance) => {
  fastify.get(
    "/user-orders",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      const orders = await Order.find({ userId: request.userId });
      return reply.send(orders);
    },
  );
  fastify.get(
    "/orders",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const { limit } = request.query as { limit: number };
      const orders = await Order.find().limit(limit).sort({ createdAt: -1 });
      return reply.send(orders);
    },
  );
};
