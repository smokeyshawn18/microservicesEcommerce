import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const webhookRoute = new Hono();

webhookRoute.get("/", (c) => {
  return c.json({
    status: "ok webhook",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

webhookRoute.post("/stripe", async (c) => {
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature");

  if (!sig) {
    console.error("Missing stripe-signature header on webhook request");
    return c.json({ error: "Missing stripe-signature header" }, 400);
  }

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    return c.json({ error: "Server webhook secret is not configured" }, 500);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook verification failed", error);
    return c.json({ error: "Webhook verification failed!" }, 400);
  }

  console.log("Stripe webhook event received", {
    eventId: event.id,
    eventType: event.type,
  });

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
      );
      // TODO: CREATE ORDER
      console.log("checkout.session.completed", {
        sessionId: session.id,
        customer: session.customer,
        paymentStatus: session.payment_status,
        lineItemsCount: lineItems.data.length,
      });
      break;

    default:
      console.log("Unhandled Stripe webhook event type", event.type);
      break;
  }
  return c.json({ received: true });
});

export default webhookRoute;
