import React from "react";
import { useUser } from "@clerk/nextjs";

function Provider({
     children 
    }: Readonly<{ 
        children: React.ReactNode;
     }>) {
        const {user} = useUser();
        const CreateAndGetUser = () => { 
        
        }
        return (
            <div>{children}</div>
        );
    }
export default Provider;