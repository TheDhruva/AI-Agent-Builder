import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAi";

const SYSTEM_PROMPT = `
You are a workflow-to-agent converter. 
Convert the provided JSON flow into a structured agent configuration.
Return ONLY raw JSON in this format:
{
  "systemPrompt": "...",
  "primaryAgentName": "...",
  "agents": [
    {
      "id": "...",
      "tools": [
        { "name": "...", "description": "...", "parameters": {} }
      ],
      "instruction": "..."
    }
  ]
}
`;

/** Minimal config so preview and chat still work when OpenAI fails (e.g. 502). */
function getFallbackConfig(): Record<string, unknown> {
    return {
        systemPrompt: "You are a helpful assistant.",
        primaryAgentName: "Preview Agent",
        agents: [
            {
                id: "fallback-agent",
                name: "Preview Agent",
                instruction: "You are a helpful assistant. Reply briefly.",
                tools: [],
            },
        ],
        tools: [],
        _fallback: true,
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const { jsonConfig } = body;

        if (jsonConfig === undefined || jsonConfig === null) {
            return NextResponse.json(
                { error: 'Missing jsonConfig in request body' },
                { status: 400 }
            );
        }

        const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
        if (!apiKey?.trim()) {
            console.error("OPENROUTER_API_KEY / OPENAI_API_KEY is not set");
            return NextResponse.json(getFallbackConfig());
        }

        const response = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: JSON.stringify(jsonConfig) }
            ],
            response_format: { type: "json_object" }
        });

        const outputText = response.choices[0].message.content;

        if (!outputText) {
            return NextResponse.json(
                { error: 'Empty response from AI' },
                { status: 500 }
            );
        }

        let parsedJSON: unknown;
        try {
            parsedJSON = JSON.parse(outputText);
        } catch {
            return NextResponse.json(
                { error: 'Invalid JSON in AI response', raw: outputText.slice(0, 200) },
                { status: 500 }
            );
        }

        return NextResponse.json(parsedJSON);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error("API Error:", error);

        // Return fallback config so preview/chat still load; client can show a warning
        const fallback = getFallbackConfig();
        return NextResponse.json(fallback);
    }
}