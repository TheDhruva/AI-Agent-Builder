import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Lowercase 'u'
  userTable: defineTable({
    name: v.string(),
    email: v.string(),
    subscription: v.optional(v.boolean()), 
    token: v.number(), 
    createdAt: v.optional(v.number()),
  }).index("by_email", ["email"]), 

  // CHANGED: Lowercase 'a' to match the userTable style
  agentTable: defineTable({
    agentId: v.string(), 
    agentName: v.string(),
    userId: v.id('userTable'), 
    config: v.any(),
    published: v.boolean(),
    createdAt: v.number(),
  })
  .index("by_user", ["userId"]) 
  .index("by_agentId", ["agentId"]), 
});