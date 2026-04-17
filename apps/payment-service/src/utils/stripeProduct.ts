import { StripeProductType } from "@repo/types";
import stripe from "./stripe";

export const createStripeProduct = async (
  item: StripeProductType,
): Promise<unknown> => {
  try {
    const res = await stripe.products.create({
      id: item.id,
      name: item.name,
      default_price_data: {
        currency: "npr",
        unit_amount: item.price * 100,
      },
    });

    return res;
  } catch (error) {
    console.error("createStripeProduct error:", error);
    throw error;
  }
};

export const getStripeProductPrice = async (productId: number) => {
  try {
    const res = await stripe.prices.list({
      product: productId.toString(),
    });

    const unitAmount = res.data[0]?.unit_amount;
    if (typeof unitAmount !== "number" || unitAmount <= 0) {
      throw new Error(`No valid Stripe price found for product ${productId}`);
    }

    return unitAmount;
  } catch (error) {
    console.error("getStripeProductPrice error:", error);
    throw error;
  }
};

export const deleteStripeProduct = async (
  productId: number,
): Promise<unknown> => {
  try {
    const res = await stripe.products.del(productId.toString());
    return res;
  } catch (error) {
    console.error("deleteStripeProduct error:", error);
    throw error;
  }
};
