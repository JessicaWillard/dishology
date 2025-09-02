import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import { getUserRestaurantId } from "@/utils/api/restaurant";
import type { UpdateSupplierRequest } from "@/types/supplier";

/**
 * GET /api/suppliers/[id]
 * Fetch a specific supplier by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Get user's restaurant ID
    const restaurantId = await getUserRestaurantId(userId);

    const supabase = await createServiceRoleClient();

    const { data: supplier, error } = await supabase
      .from("suppliers_simple")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Supplier not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching supplier:", error);
      return NextResponse.json(
        { error: "Failed to fetch supplier" },
        { status: 500 }
      );
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("GET /api/suppliers/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/suppliers/[id]
 * Update a specific supplier
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Get user's restaurant ID
    const restaurantId = await getUserRestaurantId(userId);

    const updateData: Partial<UpdateSupplierRequest> = {};

    // Only include fields that are provided
    if (body.name !== undefined) {
      if (!body.name?.trim()) {
        return NextResponse.json(
          { error: "Supplier name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = body.name.trim();
    }

    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    if (body.contact !== undefined) {
      updateData.contact = body.contact;
    }

    const supabase = await createServiceRoleClient();

    // Update the supplier (with user_id check for security)
    const { data: supplier, error } = await supabase
      .from("suppliers_simple")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Supplier not found or access denied" },
          { status: 404 }
        );
      }
      console.error("Error updating supplier:", error);
      return NextResponse.json(
        { error: "Failed to update supplier" },
        { status: 500 }
      );
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("PUT /api/suppliers/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/suppliers/[id]
 * Delete a specific supplier
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Get user's restaurant ID
    const restaurantId = await getUserRestaurantId(userId);

    const supabase = await createServiceRoleClient();

    // Delete the supplier (with user_id check for security)
    const { error } = await supabase
      .from("suppliers_simple")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting supplier:", error);
      return NextResponse.json(
        { error: "Failed to delete supplier" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/suppliers/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
