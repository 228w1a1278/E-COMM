import { Inngest } from "inngest";
import connectDB from "./db"; 
import User from "@/models/User.js"; 
import Order from "@/models/Order.js";

// Inngest client
export const inngest = new Inngest({ 
  id: "quickcart-next",
  signingKey: process.env.INNGEST_SIGNING_KEY
});

// Clerk: user.created
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);

// Clerk: user.updated
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      email: email_addresses[0]?.email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Clerk: user.deleted
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

//Inngest to create user's data in database

export const createUserOrder=inngest.createFunction(
  { id: "create-user-order" ,
    batchEvents:{
      maxSize:5,
      timeout:'5s'
    }
  },
 {event:'order/created'},
 async ({events}) =>{
  console.log("Inngest createUserOrder triggered with events:", events);
  
  try {
    const orders=events.map((event) =>{
      console.log("Processing event:", event);
      return {
        userId: event.data.userId,
        items:event.data.items,
        amount:event.data.amount,
        address:event.data.address,
        date:event.data.date
      }
   })

 console.log("Orders to be created:", orders);

 await connectDB()
 const result = await Order.insertMany(orders)

 console.log("Orders created successfully:", result);

   return {success:true,processed:orders.length}
  } catch (error) {
    console.error("Error in createUserOrder:", error);
    throw error;
  }
}
)