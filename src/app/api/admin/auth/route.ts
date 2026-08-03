import { NextRequest, NextResponse } from "next/server";
import { verifyPin, createAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    if (!pin || !(await verifyPin(String(pin)))) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }
    await createAdminSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
