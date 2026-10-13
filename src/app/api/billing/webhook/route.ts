import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import { BILLING_PACKS } from "@/server/constants";
import { webhooks } from "@polar-sh/sdk/2026-10";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    let headers: Record<string, string> = {};
    req.headers.forEach((v, k) => {
      headers[k] = v;
    });
    const event = await webhooks.validateEvent(
      body,
      headers,
      env.POLAR_WEBHOOK_SECRET,
    );

    // Process the event
    console.log(
      `Event Received [${event.timestamp}] : ${event.type} - ${event.data.id}`,
    );

    if (event.type === "order.paid") {
      const data = event.data;
      const external_customer_id = data.customer.external_id;
      const product_id = data.product_id;
      const credits = BILLING_PACKS.find(
        (pack) => pack.id === product_id,
      )?.credits;
      if (!external_customer_id) {
        throw new Error(
          `Customer External id is not set in Polar :
          Polar Customer ID : ${data.customer_id},`,
        );
      }

      if (!credits) {
        throw new Error(
          `Couldn't find Credits for the provided product_id :${product_id}`,
        );
      }

      await prisma.credits.update({
        where: { userId: external_customer_id },
        data: { credits: { increment: credits } },
      });
    }

    return new NextResponse(null, { status: 202 });
  } catch (error) {
    console.error("Polar webhook error:", error);
    if (error instanceof webhooks.PolarWebhookError) {
      return new NextResponse(null, { status: 403 });
    }

    return new NextResponse(null, { status: 500 });
  }
}
