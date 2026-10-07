import { env } from "@/env";
import { prisma } from "@/lib/prisma";
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
    console.log(event);

    return new NextResponse(null, { status: 202 });
  } catch (error) {
    console.error("Polar webhook error:", error);
    if (error instanceof webhooks.PolarWebhookError) {
      return new NextResponse(null, { status: 403 });
    }

    return new NextResponse(null, { status: 500 });
  }
}
