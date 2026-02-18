import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useState, useEffect } from 'react'

interface UserApprovalProps {
  selectedNode: any;
  updateFormData: (data: any) => void;
}

function UserApprovalSettings({ selectedNode, updateFormData }: UserApprovalProps) {
  const [prompt, setPrompt] = useState(selectedNode?.data?.prompt || '');
  const [timeout, setTimeout] = useState(selectedNode?.data?.timeout || '24');

  useEffect(() => {
    setPrompt(selectedNode?.data?.prompt || '');
    setTimeout(selectedNode?.data?.timeout || '24');
  }, [selectedNode]);

  const handleSave = () => {
    updateFormData({ 
        prompt, 
        timeout: parseInt(timeout) || 24 
    });
  };

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="font-bold">User Approval</h2>
        <p className='text-sm text-gray-500'>Pause the workflow for human verification.</p>
      </div>

      <div className='mt-2 space-y-4'>
        <div>
            <Label htmlFor="prompt" className="mb-2 block">Approval Prompt</Label>
            <Textarea 
              id="prompt"
              placeholder='e.g. Please verify the generated invoice total.' 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px]"
            />
        </div>

        <div>
            <Label htmlFor="timeout" className="mb-2 block">Expiration (Hours)</Label>
            <Input 
              id="timeout"
              type="number"
              placeholder='24' 
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
            />
            <p className='text-[10px] text-gray-400 mt-1'>Auto-reject after this time if no response.</p>
        </div>
      </div>

      <Button onClick={handleSave} className='w-full'>
        Save Approval Logic
      </Button>
    </div>
  )
}

export default UserApprovalSettings;