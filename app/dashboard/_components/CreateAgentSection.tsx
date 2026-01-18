"use client";

import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
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
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { useUserDetail } from "@/context/UserDetailContext"; // FIX: Use custom hook

function CreateAgentSection() {
  const router = useRouter();
  
  // FIX: Destructure directly from the safe custom hook
  const { userDetail } = useUserDetail();

  const CreateAgentMutation = useMutation(api.agents.CreateAgent);
  
  const [agentName, setAgentName] = useState<string>("");
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreateAgent = async () => {
    // 1. Validation
    if (!agentName.trim()) return;
    
    // Safety check - though the hook/provider handles most of this
    if (!userDetail?._id) {
        console.error("User ID not found.");
        return;
    }
    
    setLoader(true);
    try {
      const agentId = uuidv4();
      
      // 2. Execute Mutation
      await CreateAgentMutation({
        name: agentName,
        agentId: agentId,
        userId: userDetail._id as any, // FIX: Cast to any for Convex ID compatibility
      });

      // 3. Post-success logic
      setOpen(false);
      setAgentName("");
      router.push('/agent-builder/' + agentId);
      
    } catch (error) {
      console.error("Mutation failed! Error:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed rounded-xl bg-secondary/10">
      <div className="text-center space-y-1">
        <h2 className="font-bold text-2xl tracking-tight">Create AI Agent</h2>
        <p className="text-muted-foreground text-base">
          Start a new project by filling out the configuration below.
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 shadow-md">
            <Plus className="h-5 w-5" />
            <span>Create New Agent</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Agent Name</DialogTitle>
            <DialogDescription>
              Give your new AI agent a unique and descriptive name.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder="e.g. Customer Support Bot"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateAgent()}
            />
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={loader}>
              Cancel
            </Button>
            <Button 
                onClick={handleCreateAgent} 
                disabled={loader || !agentName.trim()}
            >
                {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateAgentSection;