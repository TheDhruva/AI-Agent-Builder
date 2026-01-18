import { createContext, Dispatch, SetStateAction, useContext } from "react";

// 1. Define the User Interface
export interface UserDetail {
    _id: string;
    _creationTime: number;
    name: string;
    email: string;
    token: number;
    subscription: boolean;
}

// 2. Define the Shape of the Context
interface UserDetailContextType {
    userDetail: UserDetail | null;
    setUserDetail: Dispatch<SetStateAction<UserDetail | null>>;
}

// 3. Create the Context
export const UserDetailContext = createContext<UserDetailContextType | null>(null);

// 4. The Custom Hook (The "No-BS" way to access user data)
export const useUserDetail = () => {
    const context = useContext(UserDetailContext);
    
    // This error helps you catch bugs immediately if the Provider is missing
    if (context === undefined || context === null) {
        throw new Error("useUserDetail must be used within a UserDetailContext Provider");
    }
    
    return context;
};