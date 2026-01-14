import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values"; // <--- You missed this

export default defineSchema({
    users: defineTable({ // <--- Renamed for convention
        name: v.string(),
        email: v.string(),
        subscription: v.optional(v.string()),
        token: v.number(), // Ensure this is a count/balance. If auth token, use v.string()
    }),
});