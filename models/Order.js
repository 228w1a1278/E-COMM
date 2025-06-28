import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" }, // this can stay as string (Clerk user id)
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, // ✅ FIXED
        required: true,
        ref: "Product", // ✅ Make sure 'Product' matches your model export name
      },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed" },
  date: { type: Number, required: true },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
