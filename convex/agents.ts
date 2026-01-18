import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateAgent = mutation({
  args: {
    name: v.string(),
    agentId: v.string(),
    userId: v.id('userTable'), // Ensure this is lowercase 'u'
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("agentTable", {
      agentId: args.agentId,
      agentName: args.name,
      userId: args.userId, // This will now match the type
      published: false,
      createdAt: Date.now(),
      config: {
        template: "default",
        steps: []
      }, 
    });
    return result;
  },
});

export const GetUserAgents = query({
  args: {
    userId: v.id('userTable'), // Ensure this is lowercase 'u'
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('agentTable')
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order('desc')
      .collect();
    return result;
  }
});