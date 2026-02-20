"use client";

import React, { useState } from "react";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { useUserDetail } from "@/context/UserDetailContext";

function CreateAgentSection() {
  const router = useRouter();
  const { userDetail } = useUserDetail();
  const createAgentMutation = useMutation(api.agents.CreateAgent);
  
  const [agentName, setAgentName] = useState<string>("");
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Constants for your business logic
  const FREE_CREDIT_LIMIT = 100;
  const AGENT_CREATION_COST = 10; 

  const handleCreateAgent = async () => {
    setError(null);
    if (!agentName.trim()) return;
    
    // 1. RUTHLESS CREDIT CHECK
    const currentTokens = userDetail?.token ?? 0;
    if (currentTokens < AGENT_CREATION_COST) {
        setError("Insufficient credits. You need at least 10 credits to build an agent.");
        return;
    }

    if (!userDetail?._id) return;
    
    setLoader(true);
    try {
      const agentId = uuidv4();
      
      // 2. Execute Mutation (Assuming your backend also deducts tokens)
      await createAgentMutation({
        agentName: agentName, // Match your schema
        agentId: agentId,
        userId: userDetail._id,
        published: false,
        createdAt: Date.now(),
      });

      setOpen(false);
      setAgentName("");
      router.push('/agent-builder/' + agentId);
      
    } catch (err) {
      console.error("Creation failed:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed rounded-xl bg-slate-50/50 border-slate-200">
      <div className="text-center space-y-1">
        <h2 className="font-bold text-2xl tracking-tight text-slate-900">Create AI Agent</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Build a custom workflow. Each new agent consumes {AGENT_CREATION_COST} credits.
        </p>
      </div>

      <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) setError(null); }}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 shadow-lg bg-blue-600 hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            <span>New Project</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agent Configuration</DialogTitle>
            <DialogDescription>
              Identify your agent with a name. You currently have <strong>{userDetail?.token ?? 0}</strong> credits.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <Input
              placeholder="e.g. Lead Generation Specialist"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateAgent()}
              className={error ? "border-red-500" : ""}
            />
            {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs font-medium bg-red-50 p-2 rounded border border-red-100">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loader}>
              Cancel
            </Button>
            <Button 
                onClick={handleCreateAgent} 
                disabled={loader || !agentName.trim() || (userDetail?.token ?? 0) < AGENT_CREATION_COST}
                className="bg-slate-900"
            >
                {loader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateAgentSection;