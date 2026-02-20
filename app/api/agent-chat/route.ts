import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Agent, tool, run } from '@openai/agents';
import { openai } from "@/config/OpenAi";

export async function POST(request: NextRequest) {
    try {
        const { input, tools, agents, conversationId, agentName } = await request.json();

        // 1. Map Tools correctly using the factory
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
                    // Replace path params {id}
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
                tools: generatedTools // Worker agents get the tools
            });
        });

        // 3. Create Master Router Agent
        const masterAgent = new Agent({
            name: agentName || "Supervisor",
            instructions: "Analyze the user query and hand off the task to the most appropriate agent. If no specific agent fits, answer yourself.",
            handoffs: createdAgents // This enables the routing logic
        });

        // 4. Run with Streaming
        const result = await run(masterAgent, input, {
            // conversationId: conversationId, // Enable if using persistent storage
            stream: true
        });

        // Convert the execution result into a readable text stream

        const stream = result.toTextStream();
        const utf8Stream = stream.pipeThrough(new TextEncoderStream());
        return new Response(utf8Stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: 'Agent Execution Failed', details: error.message }, 
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // 1. Create the conversation using the OpenAI SDK
        const conversation = await openai.conversations.create();

        // 2. Return the full conversation object or just the ID
        return NextResponse.json({
            conversationId: conversation.id,
            status: "created"
        });

    } catch (error: any) {
        console.error("Failed to create conversation:", error);
        return NextResponse.json(
            { error: "Conversation initialization failed", details: error.message },
            { status: 500 }
        );
    }
}