import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const CreateNewUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
    }, // <--- You were missing this comma
    handler: async (ctx, args) => {
        // 1. Check if user already exists
        const existingUser = await ctx.db
            .query("users") // Change to "UserTable" if you didn't rename it
            .filter((q) => q.eq(q.field("email"), args.email))
            .collect();

        // 2. If user exists, return them immediately
        if (existingUser.length > 0) {
            return existingUser[0];
        }

        // 3. If not, create the new user
        const newUserId = await ctx.db.insert("users", { // Change to "UserTable" if needed
            name: args.name,
            email: args.email,
            token: 5000, // Giving them free credits on signup
            // subscription: undefined // optional fields can be skipped
        });

        return newUserId;
    },
});