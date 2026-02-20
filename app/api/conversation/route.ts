import { NextResponse } from "next/server";

/**
 * Returns a new conversation ID for the chat preview.
 * Uses a client-style UUID so the preview loads without calling OpenAI.
 */
export async function GET() {
    const conversationId =
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `conv_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    return NextResponse.json({ conversationId });
}
