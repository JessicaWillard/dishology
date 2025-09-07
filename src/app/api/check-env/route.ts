import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if required environment variables are present
    const requiredEnvVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      "CLERK_SECRET_KEY",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required environment variables",
          missing: missingVars,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "ok",
      message: "All required environment variables are present",
    });
  } catch (error) {
    console.error("Error checking environment variables:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check environment variables",
      },
      { status: 500 }
    );
  }
}
