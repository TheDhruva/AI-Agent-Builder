import React from 'react';
import { Repeat } from 'lucide-react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Input } from '@/components/ui/input'; // Adjust path as needed

function WhileNode({ data }: NodeProps) {
  return (
    <div className="bg-white border rounded-md p-2 shadow-sm relative">
      
      {/* Header */}
      <div className="flex gap-2 items-center mb-2" style={{ backgroundColor: typeof data?.bg === 'string' ? data.bg : undefined }}>
        <Repeat className="w-4 h-4" />
        <h2 className="font-bold text-sm">While Loop</h2> {/* Fixed Label */}
      </div>
      
      {/* Body */}
      <div className="max-w-[140px] flex flex-col gap-3 pb-2">
        <Input placeholder="Condition" className="text-sm bg-white h-8" />
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />

      {/* Output: TRUE (Loop) */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ top: '40%' }} 
      />
      {/* Label for clarity (optional, can be removed) */}
      <span className="absolute -right-8 top-[35%] text-[10px] text-green-600 font-bold">Do</span>

      {/* Output: FALSE (Exit) */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ top: '80%' }}
      />
      <span className="absolute -right-9 top-[75%] text-[10px] text-red-600 font-bold">Exit</span>

    </div>
  );
}

export default WhileNode;