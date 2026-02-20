import { isSpoofedBot } from "@arcjet/inspect";
import { NextResponse } from "next/server";
import { aj } from "@/config/Arcjet";
import { auth } from "@clerk/nextjs/server"; // Recommended for userId

export async function GET(req: Request) {
  // 1. Get the User ID (e.g., from Clerk) or fallback to IP
  const { userId } = await auth();
  
  // 2. Execute Arcjet Protection with the required userId
  const decision = await aj.protect(req, { 
    requested: 5, 
    userId: userId || "anonymous" // FIX: Added required userId
  });

  console.log("Arcjet decision", decision);

  // 3. Handle Denials
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 },
      );
    } else if (decision.reason.isBot()) {
      return NextResponse.json(
        { error: "No bots allowed", reason: decision.reason },
        { status: 403 },
      );
    } else {
      return NextResponse.json(
        { error: "Forbidden", reason: decision.reason },
        { status: 403 },
      );
    }
  }

  // 4. IP Analysis
  if (decision.ip.isHosting()) {
    return NextResponse.json(
      { error: "Forbidden", reason: "Hosting IPs blocked" },
      { status: 403 },
    );
  }

  // 5. Bot Verification
  if (decision.results.some(isSpoofedBot)) {
    return NextResponse.json(
      { error: "Forbidden", reason: "Spoofed bot detected" },
      { status: 403 },
    );
  }

  return NextResponse.json({ message: "Hello world" });
}