import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServiceRoleClient } from "@/utils/supabase/server";
import type { CreateSupplierRequest } from "@/utils/types/database";

/**
 * GET /api/suppliers
 * Fetch all suppliers for the authenticated user's restaurant
 */
export async function GET() {
  try {
    console.log("GET /api/suppliers - Starting request");
    const { userId } = await auth();

    if (!userId) {
      console.log("GET /api/suppliers - No userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("GET /api/suppliers - User ID:", userId);

    const supabase = await createServiceRoleClient();

    // Get all suppliers for this user (using simplified table)
    const { data: suppliers, error: suppliersError } = await supabase
      .from("suppliers_simple")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (suppliersError) {
      console.error("Error fetching suppliers:", suppliersError);
      return NextResponse.json(
        { error: "Failed to fetch suppliers" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      suppliers: suppliers || [],
      total: suppliers?.length || 0,
    });
  } catch (error) {
    console.error("GET /api/suppliers error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/suppliers
 * Create a new supplier
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const supplierData: CreateSupplierRequest = {
      name: body.name,
      description: body.description || "",
      contact: body.contact || {},
      user_id: userId,
    };

    // Validate required fields
    if (!supplierData.name?.trim()) {
      return NextResponse.json(
        { error: "Supplier name is required" },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Insert the new supplier (using simplified table)
    const { data: supplier, error: insertError } = await supabase
      .from("suppliers_simple")
      .insert({
        user_id: userId,
        name: supplierData.name.trim(),
        description: supplierData.description?.trim() || null,
        contact: supplierData.contact,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating supplier:", insertError);
      return NextResponse.json(
        { error: "Failed to create supplier", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error("POST /api/suppliers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
