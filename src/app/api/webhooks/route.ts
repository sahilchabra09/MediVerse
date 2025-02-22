import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser } from "@/lib/actions/user.actions";
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    console.log("Webhook received - Starting processing");

    try {
      await db.$queryRaw`SELECT 1`
      console.log("Database connection successful")
    } catch (error) {
      console.error("Database connection failed:", error)
      return new Response("Database connection failed", { status: 500 })
    }
    
    const SIGNING_SECRET = process.env.SIGNING_SECRET;
    if (!SIGNING_SECRET) {
      console.error("Missing SIGNING_SECRET");
      throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local");
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET);

    // Get headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error: Missing Svix headers", {
        status: 400,
      });
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    // Verify payload with headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Error: Webhook verification failed", { status: 400 });
    }

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
      console.log("Processing user.created event", evt.data);
      const { id, first_name, last_name, email_addresses } = evt.data;
      console.log("Processing user.created event", { id, first_name, last_name, email_addresses });

      if (!id || !first_name || !last_name || !email_addresses[0]) {
        console.error("Missing required user data:", evt.data);
        return new Response("Error: Missing user data", { status: 400 });
      }

      const newUser = {
        clerkId: id,
        firstName: first_name,
        lastName: last_name,
        email: email_addresses[0].email_address,
        role: 'PATIENT' // Default role for new users
      };

      console.log("Attempting to create user:", newUser);
      const createdUser = await createUser(newUser);
      console.log("User created successfully:", createdUser);
    }

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log("Webhook payload:", body);

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}