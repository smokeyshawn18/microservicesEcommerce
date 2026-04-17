"use client";

import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CartItemsType, ShippingFormInputs } from "@repo/types";

import useCartStore from "@/stores/cartStore";
import CheckoutForm from "./CheckoutForm";

const stripe = loadStripe(
  "pk_test_51TLfG2Lrde3GyVW8H35ni0zI9lA1PKbWpsjy4eaIAw9z7yJDobDhWlgmmggVCpTLsokwSIeKbdV1ZwExDJ9ZuolB00QVBcon4D",
);

const fetchClientSecret = async (cart: CartItemsType, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/session/create-checkout-session`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        cart,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const responseText = await response.text();
  let json: { checkoutSessionClientSecret?: string; error?: unknown } = {};

  if (responseText) {
    try {
      json = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Invalid response from payment service (${response.status}): ${responseText.slice(0, 200)}`,
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      `Payment service request failed (${response.status}): ${JSON.stringify(json)}`,
    );
  }

  if (!json.checkoutSessionClientSecret) {
    throw new Error(
      `Payment service did not return checkoutSessionClientSecret: ${JSON.stringify(json)}`,
    );
  }

  return json.checkoutSessionClientSecret;
};

const StripePaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const { cart } = useCartStore();
  const [token, setToken] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => setToken(token));
  }, [getToken]);

  if (!token) {
    return <div className="">Loading...</div>;
  }

  return (
    <CheckoutProvider
      stripe={stripe}
      options={{ fetchClientSecret: () => fetchClientSecret(cart, token) }}
    >
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  );
};

export default StripePaymentForm;
