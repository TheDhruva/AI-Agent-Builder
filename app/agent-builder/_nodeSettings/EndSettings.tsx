import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea' // Ensure this path is correct
import React, { useState, useEffect } from 'react'

interface EndSettingsProps {
  selectedNode: any; 
  updateFormData: (data: any) => void;
}

function EndSettings({ selectedNode, updateFormData }: EndSettingsProps) {
    // 1. Initialize state from the selected node's existing data
    const [outputJson, setOutputJson] = useState(selectedNode?.data?.output || '');

    // 2. Sync local state if the user clicks a different node while this is open
    useEffect(() => {
        if (selectedNode?.data) {
            setOutputJson(selectedNode.data.output || '');
        }
    }, [selectedNode]);

    const handleSave = () => {
        // 3. Pass the data back up to the parent (SettingsPanel)
        updateFormData({ 
            output: outputJson 
        });
    };

    return (
        <div className='grid gap-4'>
            <div>
                <h2 className="font-bold">End Node</h2>
                <p className='text-sm text-gray-500'>Configure workflow termination</p>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Output JSON Schema
                </label>
                <Textarea 
                    placeholder='{ "result": "string" }' 
                    className='block w-full min-h-[100px]'
                    value={outputJson}
                    onChange={(e) => setOutputJson(e.target.value)}
                />
            </div>

            <Button onClick={handleSave} className='w-full'>
                Save Settings
            </Button>
        </div>
    )
}

export default EndSettings