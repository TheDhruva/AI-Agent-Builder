import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Retrieves an existing conversation thread for a specific user and agent
export const GetConversationById = query({
    args: {
        agentId: v.id('agentTable'),
        userId: v.string() 
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("conversationTable")
            .withIndex("by_agent_and_user", (q) => 
                q.eq("agentId", args.agentId).eq("userId", args.userId)
            )
            .first(); 
    }
});

// Saves a newly generated OpenAI conversation ID
export const CreateConversation = mutation({
    args: {
        agentId: v.id('agentTable'),
        userId: v.string(),
        conversationId: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("conversationTable", {
            agentId: args.agentId,
            userId: args.userId,
            conversationId: args.conversationId,
            createdAt: Date.now() // Added to match the refined schema
        });
    }
});