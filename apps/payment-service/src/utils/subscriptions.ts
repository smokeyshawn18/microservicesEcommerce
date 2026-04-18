import { consumer } from "./kafka";
import { createStripeProduct, deleteStripeProduct } from "./stripeProduct";

export const runKafkaSubscriptions = async () => {
  consumer.subscribe("product.created", async (message) => {
    const product = message.value;
    console.log("Received message on product.created:", product);
    // Handle the message, e.g., update local cache, trigger other actions, etc.

    await createStripeProduct(product);
  });

  consumer.subscribe("product.deleted", async (message) => {
    const productId = message.value;
    console.log("Received message on product.deleted:", productId);
    // Handle the message, e.g., update local cache, trigger other actions, etc.

    await deleteStripeProduct(productId);
  });
};
