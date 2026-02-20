import { NextRequest, NextResponse } from "next/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { openai } from "@/config/OpenAi"; 
import { api } from "@/convex/_generated/api";
import { Agent, run } from "@openai/agents"; // Added for execution

export async function POST(request: NextRequest) {
    try {
        // 1. Parse Request
        const { agentId, userId, command } = await request.json();

        if (!agentId || !command) {
            return NextResponse.json({ error: "Missing agentId or command" }, { status: 400 });
        }

        // 2. Fetch Agent Config
        const agentDetail = await fetchQuery(api.agents.GetAgentById, { 
            agentId: agentId 
        });
        
        if (!agentDetail) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        // 3. Resolve or Create Conversation
        let conversationId = null;
        
        // Ensure you pass userId from the client to track who is talking
        const conversationRecord = await fetchQuery(api.conversations.GetConversation, {
            agentId: agentDetail._id,
            userId: userId || "anonymous" 
        });

        if (conversationRecord?.conversationId) {
            conversationId = conversationRecord.conversationId;
        } else {
            // Create fresh thread
            const newConversation = await openai.conversations.create({});
            conversationId = newConversation.id;

            // CRITICAL: Save it back to Convex
            await fetchMutation(api.conversations.CreateConversation, {
                agentId: agentDetail._id,
                userId: userId || "anonymous",
                conversationId: conversationId
            });
        }

        // 4. Rebuild and Execute Agent
        // (Assuming you map tools properly here as done in previous steps)
        const agent = new Agent({
            name: agentDetail.agentToolConfig?.primaryAgentName || "Agent",
            instructions: agentDetail.agentToolConfig?.systemPrompt || "You are a helpful assistant.",
            tools: [] // Insert your mapped tools here
        });

        // Run the agent with the persisted conversation ID
        const result = await run(agent, command, {
            conversationId: conversationId
        });

        // 5. Return Output
        return NextResponse.json({ 
            success: true,
            conversationId: conversationId,
            output: result.content 
        }, { status: 200 });

    } catch (error: any) {
        console.error("SDK Execution Error:", error);
        return NextResponse.json({ 
            error: "Agent execution failed", 
            details: error.message 
        }, { status: 500 });
    }
}