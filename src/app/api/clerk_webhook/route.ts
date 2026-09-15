import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    console.log(
      `Received webhook with ID ${evt.data.id} and event type of ${evt.type}`,
    );
    console.log("Webhook payload:", evt.data);

    if (evt.type === "user.created") {
      const user = await prisma.user.create({
        data: {
          emailAddress: evt.data.email_addresses[0].email_address,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          imageUrl: evt.data.image_url,
          credits: {
            create: {},
          },
        },
      });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
