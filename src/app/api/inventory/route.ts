import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import type {
  CreateInventoryRequest,
  InventoryListResponse,
} from "@/utils/types/database";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceRoleClient();
    const { data: inventory, error } = await supabase
      .from("inventory")
      .select(
        `
        *,
        supplier:suppliers_simple(id, name, contact)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inventory:", error);
      return NextResponse.json(
        { error: "Failed to fetch inventory" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      inventory: inventory || [],
      total: inventory?.length || 0,
    } as InventoryListResponse);
  } catch (error) {
    console.error("GET /api/inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const inventoryData: CreateInventoryRequest = {
      name: body.name,
      type: body.type || "other",
      description: body.description || "",
      quantity: body.quantity || "0",
      size: body.size || "",
      unit: body.unit || "",
      price_per_unit: body.price_per_unit || "0",
      price_per_pack: body.price_per_pack || "",
      supplier_id: body.supplier_id || "",
      location: body.location || "",
      min_count: body.min_count || "",
      count_date: body.count_date || new Date().toISOString(),
      user_id: userId,
    };

    if (!inventoryData.name?.trim()) {
      return NextResponse.json(
        { error: "Inventory item name is required" },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();
    const { data: inventory, error: insertError } = await supabase
      .from("inventory")
      .insert({
        user_id: userId,
        name: inventoryData.name.trim(),
        type: inventoryData.type,
        description: inventoryData.description?.trim() || null,
        quantity: inventoryData.quantity,
        size: inventoryData.size?.trim() || null,
        unit: inventoryData.unit?.trim() || null,
        price_per_unit: inventoryData.price_per_unit,
        price_per_pack: inventoryData.price_per_pack?.trim() || null,
        supplier_id: inventoryData.supplier_id || null,
        location: inventoryData.location?.trim() || null,
        min_count: inventoryData.min_count?.trim() || null,
        count_date: inventoryData.count_date,
      })
      .select(
        `
        *,
        supplier:suppliers_simple(id, name, contact)
      `
      )
      .single();

    if (insertError) {
      console.error("Error creating inventory item:", insertError);
      return NextResponse.json(
        {
          error: "Failed to create inventory item",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(inventory, { status: 201 });
  } catch (error) {
    console.error("POST /api/inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
