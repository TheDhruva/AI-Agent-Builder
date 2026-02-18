import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label' // Corrected import
import React, { useState, useEffect } from 'react'

interface IfElseProps {
  selectedNode: any;
  updateFormData: (data: any) => void;
}

function IfElseSettings({ selectedNode, updateFormData }: IfElseProps) {
  const [condition, setCondition] = useState(selectedNode?.data?.condition || '');

  useEffect(() => {
    setCondition(selectedNode?.data?.condition || '');
  }, [selectedNode]);

  const handleSave = () => {
    updateFormData({ condition });
  };

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="font-bold">If/Else Node</h2>
        <p className='text-sm text-gray-500'>Configure conditional logic for branching.</p>
      </div>

      <div className='mt-2'>
        <Label htmlFor="condition" className="mb-2 block">If Condition</Label>
        <Input 
          id="condition"
          placeholder='e.g. data.score > 80' 
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className='mb-3' 
        />
      </div>

      <Button onClick={handleSave} className='w-full'>
        Save Condition
      </Button>
    </div>
  )
}

export default IfElseSettings;