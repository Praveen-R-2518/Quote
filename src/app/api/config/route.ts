import { NextResponse } from "next/server";
import { getFullConfig } from "@/lib/config-service";

export async function GET() {
  try {
    const config = await getFullConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Config error:", error);
    return NextResponse.json({ error: "Failed to load config" }, { status: 500 });
  }
}
