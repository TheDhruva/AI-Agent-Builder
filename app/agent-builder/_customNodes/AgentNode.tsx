import React from 'react';
import { Bot } from 'lucide-react'; 
// Simplified imports (removed aliases for clarity)
import { Handle, Position, NodeProps } from '@xyflow/react';

function AgentNode({ data }: NodeProps) {
  return (
    <div className="relative group flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-grab active:cursor-grabbing min-w-[160px]">
      
      {/* Input Handle */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-2 h-2 !bg-slate-400 !border-white" 
      />

      {/* Icon Container - Uses data.bg if available, defaults to purple */}
      <div 
        className="flex items-center justify-center rounded-lg h-10 w-10 transition-colors text-purple-600"
        style={{ backgroundColor: data.bg || '#f3e8ff' }} 
      >
        <Bot size={18} />
      </div>

      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase tracking-tighter font-bold text-slate-400">Processor</span>
        {/* Uses data.label so the name matches what you dragged from the sidebar */}
        <h2 className="text-sm font-semibold text-slate-700">{data.label || 'AI Agent'}</h2>
      </div>

      {/* Output Handle - Fixed typo (was FHandle) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-2 h-2 !bg-blue-500 !border-white" 
      />
    </div>
  );
}

export default AgentNode;