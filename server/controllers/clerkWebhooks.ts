import { Request, Response } from "express";
import User from "../models/User.js";
import { Webhook } from "svix";
import { isError } from "../types/guards.js";

interface ClerkWebhookRequest extends Request {
  headers: {
    "svix-id"?: string;
    "svix-timestamp"?: string;
    "svix-signature"?: string;
    [key: string]: any;
  };
  body: {
    data: {
      id: string;
      email_addresses: Array<{ email_address: string }>;
      first_name: string;
      last_name: string;
      image_url: string;
    };
    type: string;
  };
}

const clerkWebhooks = async (
  req: ClerkWebhookRequest,
  res: Response
): Promise<void> => {
  try {
    // Create a Svix instance with clerk webhook secret.
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verifying Headers
    await webhook.verify(JSON.stringify(req.body), headers as any);

    // Getting Data from request Body
    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    // Switch Cases for different Events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }

    res.json({ success: true, message: "Webhook Recieved" });
  } catch (error) {
    if (isError(error)) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  }
};

export default clerkWebhooks;
