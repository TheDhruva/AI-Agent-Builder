import React from 'react';
// Changed import to React Flow (adjust if you use @xyflow/react)
import { Handle, Position } from '@xyflow/react';
import { Square } from 'lucide-react';

// Added basic type safety for props
interface EndNodeProps {
  data: {
    bg?: string;
  };
}

function EndNode({ data }: EndNodeProps) {
  return (
    <div className="relative"> {/* Added generic container class if needed */}
      <div className="flex items-center gap-2"> {/* Added layout for icon/text */}
        
        {/* Fix 1: className instead of ClassName */}
        <Square className="bg-white rounded-2xl p-2 px-2 border" />
        
        <h2>End</h2>
        
        {/* Fix 2, 3 & 4: Correct Handle import, Position, and Style syntax */}
        <Handle
          type="target"
          position={Position.Left} // or just "left"
          className="-left-3 bg-red-500 w-3 h-3 border-2 border-white hover:!w-4 hover:!h-4 transition-all"
          style={{ backgroundColor: data?.bg }} 
        />
      </div>
    </div>
  );
}

export default EndNode;