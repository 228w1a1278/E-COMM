import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import Address from "@/models/Address";
import Order from "@/models/Order";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User"; 

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    console.log("Order creation request:", { userId, address, items });

    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" }); 
    }

    await connectDB();

    // Fetch the full address object
    const addressData = await Address.findById(address);
    if (!addressData) {
      return NextResponse.json({ success: false, message: "Address not found" });
    }

    console.log("Address data:", addressData.toObject());

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: `Product ${item.product} not found` });
      }
      amount += product.offerPrice * item.quantity;
    }

    console.log("Calculated amount:", amount);

    const orderData = {
      userId,
      address: addressData.toObject(),
      items,
      amount: amount + Math.floor(amount * 0.02),
      date: Date.now(),
    };

    console.log("Sending to Inngest:", orderData);

     // ✅ Save to database
     const savedOrder = await Order.create(orderData);  // <--- ADD THIS LINE


    await inngest.send({
      name: "order/created",
      data: orderData,
    });

    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    console.log("Order creation successful");

    return NextResponse.json({ success: true, message: "Order placed", order: savedOrder });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
