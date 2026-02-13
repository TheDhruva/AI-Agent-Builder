"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext, UserDetail } from "@/context/UserDetailContext";
import { WorkflowContext } from "@/context/WorkflowContext";
// Fix 1: Import ReactFlowProvider, Node, and Edge types
import { ReactFlowProvider, Node, Edge } from "@xyflow/react"; 

const initialNodes: Node[] = [
  {
    id: 'start-0',
    type: 'startNode',
    position: { x: 250, y: 100 },
    data: { label: 'Start' },
  },
];

function Provider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    
    // Fix 2: Standardized naming (selectedNode) and typed it
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    
    // Workflow State
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>([]);

    const userData = useQuery(api.users.GetUserByEmail, {
        email: user?.primaryEmailAddress?.emailAddress ?? ""
    });

    const createUser = useMutation(api.users.CreateNewUser);

    useEffect(() => {
        if (userData) {
            setUserDetail(userData as UserDetail);
        } else if (isLoaded && user && userData === null) {
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

    if (!isLoaded) return null;

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <ReactFlowProvider>
                {/* Fix 3: Added selectedNode/setSelectedNode to context value */}
                <WorkflowContext.Provider value={{ 
                    nodes, 
                    setNodes, 
                    edges, 
                    setEdges,
                    selectedNode,
                    setSelectedNode 
                }}>
                    {children}
                </WorkflowContext.Provider>
            </ReactFlowProvider>
        </UserDetailContext.Provider>
    );
}

export default Provider;