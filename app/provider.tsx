"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext, UserDetail } from "@/context/UserDetailContext";

function Provider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();
    
    // 1. Immediate Query: Convex will fetch this much faster than a mutation
    const userData = useQuery(api.users.GetUserByEmail, {
        email: user?.primaryEmailAddress?.emailAddress ?? ""
    });

    const createUser = useMutation(api.users.CreateNewUser);
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

    // 2. Sync logic: Only runs if Clerk is ready but Convex doesn't have the user
    useEffect(() => {
        if (userData) {
            setUserDetail(userData as UserDetail);
        } else if (isLoaded && user && userData === null) {
            // User doesn't exist in DB, create them in the background
            const sync = async () => {
                const result = await createUser({
                    name: user.fullName ?? "User",
                    email: user.primaryEmailAddress?.emailAddress ?? "",
                });
                setUserDetail(result as UserDetail);
            };
            sync();
        }
    }, [isLoaded, user, userData, createUser]);

    // 3. ZERO GATE: The only gate is Clerk's initialization. 
    // The rest of the app renders immediately.
    if (!isLoaded) return null;

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            {children}
        </UserDetailContext.Provider>
    );
}

export default Provider;