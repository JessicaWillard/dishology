import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import type { UpdateInventoryRequest } from "@/utils/types/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createServiceRoleClient();

    const { data: inventory, error } = await supabase
      .from("inventory")
      .select(
        `
        *,
        supplier:suppliers_simple(id, name, contact)
      `
      )
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Inventory item not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching inventory item:", error);
      return NextResponse.json(
        { error: "Failed to fetch inventory item" },
        { status: 500 }
      );
    }

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("GET /api/inventory/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: Partial<UpdateInventoryRequest> = {};

    if (body.name !== undefined) {
      if (!body.name?.trim()) {
        return NextResponse.json(
          { error: "Inventory item name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.type !== undefined) {
      updateData.type = body.type;
    }

    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    if (body.quantity !== undefined) {
      updateData.quantity = body.quantity;
    }

    if (body.size !== undefined) {
      updateData.size = body.size?.trim() || null;
    }

    if (body.unit !== undefined) {
      updateData.unit = body.unit?.trim() || null;
    }

    if (body.price_per_unit !== undefined) {
      updateData.price_per_unit = body.price_per_unit;
    }

    if (body.price_per_pack !== undefined) {
      updateData.price_per_pack = body.price_per_pack?.trim() || null;
    }

    if (body.supplier_id !== undefined) {
      updateData.supplier_id = body.supplier_id || null;
    }

    if (body.location !== undefined) {
      updateData.location = body.location?.trim() || null;
    }

    if (body.min_count !== undefined) {
      updateData.min_count = body.min_count?.trim() || null;
    }

    if (body.count_date !== undefined) {
      updateData.count_date = body.count_date;
    }

    const supabase = await createServiceRoleClient();
    const { data: inventory, error } = await supabase
      .from("inventory")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select(
        `
        *,
        supplier:suppliers_simple(id, name, contact)
      `
      )
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Inventory item not found or access denied" },
          { status: 404 }
        );
      }
      console.error("Error updating inventory item:", error);
      return NextResponse.json(
        { error: "Failed to update inventory item" },
        { status: 500 }
      );
    }

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("PUT /api/inventory/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createServiceRoleClient();

    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting inventory item:", error);
      return NextResponse.json(
        { error: "Failed to delete inventory item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/inventory/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
