import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'

interface WhileProps {
  selectedNode: any;
  updateFormData: (data: any) => void;
}

function WhileSettings({ selectedNode, updateFormData }: WhileProps) {
  const [condition, setCondition] = useState(selectedNode?.data?.condition || '');
  const [maxIterations, setMaxIterations] = useState(selectedNode?.data?.maxIterations || '10');

  useEffect(() => {
    setCondition(selectedNode?.data?.condition || '');
    setMaxIterations(selectedNode?.data?.maxIterations || '10');
  }, [selectedNode]);

  const handleSave = () => {
    updateFormData({ 
        condition, 
        maxIterations: parseInt(maxIterations) || 10 
    });
  };

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="font-bold">While Loop Node</h2>
        <p className='text-sm text-gray-500'>Repeat steps until the condition is met.</p>
      </div>

      <div className='mt-2 space-y-4'>
        <div>
            <Label htmlFor="condition" className="mb-2 block">Loop Condition</Label>
            <Input 
              id="condition"
              placeholder='e.g. data.items.length > 0' 
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            />
        </div>

        <div>
            <Label htmlFor="iterations" className="mb-2 block">Max Iterations (Safety Cap)</Label>
            <Input 
              id="iterations"
              type="number"
              placeholder='10' 
              value={maxIterations}
              onChange={(e) => setMaxIterations(e.target.value)}
            />
            <p className='text-[10px] text-gray-400 mt-1'>Prevents infinite loops and engine crashes.</p>
        </div>
      </div>

      <Button onClick={handleSave} className='w-full'>
        Save Configuration
      </Button>
    </div>
  )
}

export default WhileSettings;