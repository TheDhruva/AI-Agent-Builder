import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateAgent = mutation({
  args: {
    name: v.string(),
    agentId: v.string(),
    userId: v.id('userTable'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agentTable", {
      agentId: args.agentId,
      agentName: args.name,
      userId: args.userId,
      published: false,
      createdAt: Date.now(),
      config: {
        template: "default",
        steps: []
      },
    });
  },
});

// FAST LOOKUP: Uses Index instead of Filter
export const GetAgentById = query({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('agentTable')
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .first(); // .first() is cleaner than .collect()[0]
    return result;
  }
});

export const UpdateAgentDetail = mutation({
  args: {
    id: v.id('agentTable'),
    nodes: v.any(),
    edges: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      nodes: args.nodes,
      edges: args.edges,
    });
    return { success: true };
  }
});