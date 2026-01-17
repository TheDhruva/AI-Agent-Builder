import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";


function CreateAgentSection() {
  return (
    <div className='space-y-2 flex-col justify-center'>
        <h2 className='font-bold text-xl'>Create AI Agent</h2>
        <p className='text-lg'>Create a new AI agent by filling out the form below.</p>
        <Button size={"lg"}><Plus />Create</Button>
    </div>
  );
}
export default CreateAgentSection;