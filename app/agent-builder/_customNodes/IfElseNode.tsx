import React from 'react';
import { Merge } from 'lucide-react'; 
import { Input } from '@/components/ui/input'; 
// Fix 1: correct import source
import { Handle, Position, NodeProps } from '@xyflow/react';

function IfElseNode({ data }: NodeProps) {
  return (
    <div className="bg-white border rounded-md p-2 shadow-sm relative"> 
      <div className="flex gap-2 items-center mb-2" style={{ backgroundColor: typeof data?.bg === 'string' ? data.bg : undefined }}>
        <Merge className="w-4 h-4" />
        <h2 className="font-bold text-sm">If/Else</h2>
      </div>
      
      <div className="max-w-35 flex flex-col gap-3 pb-2">
        <Input placeholder="If Condition" className="text-sm bg-white h-8" />
        <Input placeholder="Else Condition" className="text-sm bg-white h-8" />
      </div>

      {/* Target Handle (Input) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />

      {/* Source Handle: IF (Aligned with top input) */}
      <Handle
        type="source"
        position={Position.Right}
        id="if"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ top: '45px' }} // Manually adjusted to align with first input
      />

      {/* Source Handle: ELSE (Aligned with bottom input) */}
      <Handle
        type="source"
        position={Position.Right}
        id="else"
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ top: '90px' }} // Manually adjusted to align with second input
      />
    </div>
  );
}

export default IfElseNode;