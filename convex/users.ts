import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper Query to find user (needed for your Provider)
export const GetUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userTable")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const CreateNewUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Check if user already exists using the INDEX (High Performance)
        const existingUser = await ctx.db
            .query("userTable")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        // 2. If user exists, return the full document (including _id)
        if (existingUser) {
            return existingUser;
        }

        // 3. If not, create the new user
        const newUserId = await ctx.db.insert("userTable", {
            name: args.name,
            email: args.email,
            token: 5000, 
            subscription: false,
            createdAt: Date.now(),
        });

        // 4. Return the newly created document
        return await ctx.db.get(newUserId);
    },
});