import { InferSchemaType, model, Schema } from "mongoose";

export const orderStatus = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "success",
  "cancelled",
] as const;

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: orderStatus, default: "pending" },
    products: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
        },
      ],
      required: true,
    },
  },
  { timestamps: true },
);

export type OrderSchemaType = InferSchemaType<typeof OrderSchema>;

export const Order = model<OrderSchemaType>("Order", OrderSchema);
