import { NextRequest, NextResponse } from "next/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { openai } from "@/config/OpenAi"; 
import { api } from "@/convex/_generated/api";
import { Agent, run, tool } from "@openai/agents"; 
import { z } from "zod";

export async function POST(request: NextRequest) {
    try {
        const { agentId, userId, command } = await request.json();

        if (!agentId || !command) {
            return NextResponse.json({ error: "Missing agentId or command" }, { status: 400 });
        }

        // 1. Fetch Agent Config from Convex
        const agentDetail = await fetchQuery(api.agents.GetAgentById, { 
            agentId: agentId 
        });
        
        if (!agentDetail) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        // 2. Resolve or Create Conversation
        let conversationId = null;
        const conversationRecord = await fetchQuery(api.conversation.GetConversationById, {
            agentId: agentDetail._id,
            userId: userId || "anonymous" 
        });

        if (conversationRecord?.conversationId) {
            conversationId = conversationRecord.conversationId;
        } else {
            const newConversation = await (openai as any).conversations.create({});
            conversationId = newConversation.id;

            await fetchMutation(api.conversation.CreateConversation, {
                agentId: agentDetail._id,
                userId: userId || "anonymous",
                conversationId: conversationId
            });
        }

        // 3. Map Tools (Crucial: Agents need their tools to function)
        const config = agentDetail.agentToolConfig || {};
        const toolsConfig = config.tools || [];
        
        const generatedTools = toolsConfig.map((t: any) => {
            const shape: Record<string, any> = {};
            Object.entries(t.parameters || {}).forEach(([key, value]: [string, any]) => {
                shape[key] = value.type === "number" ? z.number() : z.string();
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
                    const response = await fetch(url, {
                        method: t.method || "GET",
                        headers: { "Content-Type": "application/json" },
                        body: t.method !== "GET" ? JSON.stringify(params) : undefined
                    });
                    return await response.json();
                }
            });
        });

        // 4. Build Agent
        const agent = new Agent({
            name: config.primaryAgentName || "Agent",
            instructions: config.systemPrompt || "You are a helpful assistant.",
            tools: generatedTools 
        });

        // 5. Execute Agent
        const result = await run(agent, command, {
            conversationId: conversationId
        });

        // FIXED: Accessing 'text' instead of 'content' to resolve Type Error
        return NextResponse.json({ 
            success: true,
            conversationId: conversationId,
            output: (result as any).text || (result as any).output || "No response generated."
        }, { status: 200 });

    } catch (error: any) {
        console.error("SDK Execution Error:", error);
        return NextResponse.json({ 
            error: "Agent execution failed", 
            details: error.message 
        }, { status: 500 });
    }
}