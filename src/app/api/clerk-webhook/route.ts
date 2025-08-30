import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client only when needed (not at module level)
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing required Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

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
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      return new NextResponse("Server configuration error", { status: 500 });
    }

    const wh = new Webhook(webhookSecret);

    const evt = wh.verify(payload, {
      "svix-id": headersList.get("svix-id")!,
      "svix-timestamp": headersList.get("svix-timestamp")!,
      "svix-signature": headersList.get("svix-signature")!,
    }) as ClerkUserCreatedEvent;

    if (evt.type === "user.created") {
      const user = evt.data;
      const supabase = getSupabaseClient();

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
