import React from 'react';
import { Play } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';

function StartNode() {
  return (
    <div className="relative group flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-grab active:cursor-grabbing min-w-[150px]">
      
      {/* The Port (Handle) - Only Source for a Start Node */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 !bg-blue-500 border-2 border-white !-right-[7px] hover:!w-4 hover:!h-4 transition-all"
      />
      <div className="flex items-center justify-center bg-green-50 text-green-600 rounded-lg h-10 w-10 group-hover:bg-green-100 transition-colors">
        <Play size={18} fill="currentColor" />
      </div>

      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase tracking-tighter font-bold text-slate-400">Trigger</span>
        <h2 className="text-sm font-semibold text-slate-700">Workflow Start</h2>
      </div>
    </div>
  );
}

export default StartNode;