import React from 'react';
import { ThumbsUp } from 'lucide-react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Button } from '@/components/ui/button'; // Adjust path based on your project

function UserApprovalNode({ data }: NodeProps) {
  return (
    <div className="bg-white border rounded-md p-2 shadow-sm relative max-w-[180px]">
      
      {/* Header */}
      <div className="flex gap-2 items-center mb-4" style={{ backgroundColor: data?.bg }}>
        <ThumbsUp className="w-4 h-4 text-amber-600" />
        <h2 className="font-bold text-sm">Approval</h2>
      </div>
      
      {/* Body: Buttons acting as visual anchors for the handles */}
      <div className="flex flex-col gap-2">
        <Button className="h-8 text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100 w-full justify-start">
          Approve
        </Button>
        <Button className="h-8 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100 w-full justify-start">
          Reject
        </Button>
      </div>

      {/* Input Handle (Entry point) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />

      {/* Output: APPROVED Path */}
      <Handle
        type="source"
        position={Position.Right}
        id="approved"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ top: '68px' }} // Align with Approve button
      />

      {/* Output: REJECTED Path */}
      <Handle
        type="source"
        position={Position.Right}
        id="rejected"
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ top: '108px' }} // Align with Reject button
      />
      
    </div>
  );
}

export default UserApprovalNode;