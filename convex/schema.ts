import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userTable: defineTable({
    name: v.string(),
    email: v.string(),
    subscription: v.optional(v.boolean()), 
    token: v.number(), 
    createdAt: v.number(), // Made mandatory for cleaner sorting
  }).index("by_email", ["email"]), 

  agentTable: defineTable({
    agentId: v.string(), 
    agentName: v.string(),
    userId: v.id('userTable'), 
    config: v.any(),
    nodes: v.optional(v.any()),
    edges: v.optional(v.any()),
    published: v.boolean(),
    createdAt: v.number(),
    agentToolConfig: v.optional(v.any()),
  })
  .index("by_user", ["userId"]) 
  .index("by_agentId", ["agentId"]), 

  conversationTable: defineTable({
    conversationId: v.string(), // The OpenAI Thread ID
    agentId: v.id('agentTable'), 
    userId: v.string(), // Supports "anonymous" or Clerk IDs
    createdAt: v.number(),
  })
  // Index 1: For the SDK to find a user's session with a specific agent
  .index("by_agent_and_user", ["agentId", "userId"])
  // Index 2: For retrieving the record based on the OpenAI ID
  .index("by_conversationId", ["conversationId"])
});