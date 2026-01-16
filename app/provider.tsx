"use client"; // 1. Must be at the very top

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react"; // 2. Correct import for Convex
import { api } from "@/convex/_generated/api"; // 3. Ensure this path points to your API
import { User } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const createUser = useMutation(api.user.CreateNewUser);
    const [userDetail,setUserDetail] = useState;
    useEffect(() => {
        if (user) {
            checkUser();
        }
    }, [user]);

    const checkUser = async () => { // 4. Function must be async to use 'await'
        // 5. Fixed the syntax error (?? ||) and closed the string
        const result = await createUser({
            name: user?.fullName ?? user?.firstName ?? "No Name",
            email: user?.primaryEmailAddress?.emailAddress ?? "no-email@example.com",
        });
        
        console.log("User synced:", result);
    };

    return (
        <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    );
}

export default Provider;