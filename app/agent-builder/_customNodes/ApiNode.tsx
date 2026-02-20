import React from 'react';
import { Globe } from 'lucide-react';
import { Handle, Position, NodeProps } from '@xyflow/react';

// FIX 1: Define the data shape so TS knows 'bg' exists
type ApiNodeData = {
  bg?: string;
};

function ApiNode({data}: any) {
  return (
    // FIX 2: Added 'relative' so handles stick to this specific box
    <div className="relative bg-white border rounded-md p-2 shadow-sm min-w-[150px]">
      
      <div className="flex gap-2 items-center mb-2">
        <div className="p-1 rounded-md" style={{ backgroundColor: typeof data?.bg === 'string' ? data.bg : undefined }}>
           <Globe className="w-4 h-4" />
        </div>
        <h2 className="font-bold text-sm">API Call</h2>
      </div>
      
      <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded text-xs text-slate-500">
        <span>https://api.example.com</span>
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-blue-500 border-2 border-white" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-green-500 border-2 border-white" 
      />
    </div>
  )
}

export default ApiNode;