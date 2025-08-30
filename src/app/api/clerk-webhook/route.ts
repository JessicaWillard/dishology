import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ClerkUserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
  };
};

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = await headers();

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

    const evt = wh.verify(payload, {
      "svix-id": headersList.get("svix-id")!,
      "svix-timestamp": headersList.get("svix-timestamp")!,
      "svix-signature": headersList.get("svix-signature")!,
    }) as ClerkUserCreatedEvent;

    if (evt.type === "user.created") {
      const user = evt.data;
      await supabase.from("profiles").insert({
        id: user.id,
        email: user.email_addresses?.[0]?.email_address,
      });
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }
}
