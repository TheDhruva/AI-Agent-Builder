import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Agent, tool, run } from '@openai/agents';
import { openai } from "@/config/OpenAi";

export async function POST(request: NextRequest) {
    try {
        const { input, tools = [], agents = [], agentName } = await request.json();

        // 1. Map Tools
        const generatedTools = tools.map((t: any) => {
            const shape: Record<string, any> = {};
            Object.entries(t.parameters || {}).forEach(([key, value]: [string, any]) => {
                if (value.type === "number") shape[key] = z.number();
                else shape[key] = z.string();
                if (value.description) shape[key] = shape[key].describe(value.description);
            });

            return tool({
                name: t.name,
                description: t.description,
                parameters: z.object(shape),
                execute: async (params: any) => {
                    let url = t.url;
                    for (const key in params) {
                        url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
                    }
                    if (t.includeApiKey && t.apiKey) {
                        url += (url.includes('?') ? '&' : '?') + `api_key=${t.apiKey}`;
                    }
                    const response = await fetch(url, {
                        method: t.method || "GET",
                        headers: { "Content-Type": "application/json" },
                        body: t.method !== "GET" ? JSON.stringify(params) : undefined
                    });
                    return await response.json();
                }
            });
        });

        // 2. Map Sub-Agents
        const createdAgents = agents.map((config: any) => {
            return new Agent({
                name: config.name,
                instructions: config.instruction,
                tools: generatedTools
            });
        });

        // 3. Create Master Agent
        const masterAgent = new Agent({
            name: agentName || "Supervisor",
            instructions: "Analyze the user query and hand off the task to the most appropriate agent. If no specific agent fits, answer yourself.",
            handoffs: createdAgents
        });

        // 4. Execute and Stream
        const result = await run(masterAgent, input, { stream: true });

        // CLEAN FIX: Convert string stream to Uint8Array stream for Next.js response
        const textStream = result.toTextStream();
        const byteStream = textStream.pipeThrough(new TextEncoderStream());

        return new Response(byteStream, {
            headers: {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: 'Agent Execution Failed', details: error.message }, 
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const conversation = await openai.conversations.create();
        return NextResponse.json({
            conversationId: conversation.id,
            status: "created"
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Conversation initialization failed", details: error.message },
            { status: 500 }
        );
    }
}