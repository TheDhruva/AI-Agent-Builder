"use client"
import { WorkflowContext } from '@/context/WorkflowContext';
import React, { useContext } from 'react'
import AgentSettings from '../_nodeSettings/AgentSettings';
import EndSettings from '../_nodeSettings/EndSettings';
import IfElseSettings from '../_nodeSettings/IfElseSettings';
import WhileSettings from '../_nodeSettings/WhileSettings';
import UserApprovalSettings from '../_nodeSettings/UserApprovalSettings';
import ApiSettings from '../_nodeSettings/ApiSettings';

function SettingsPanel() {
  const { selectedNode, setNodes } = useContext(WorkflowContext);

  const onUpdateNodeData = (formData: any) => {
    if (!selectedNode) return;

    setNodes((prevNodes: any[]) =>
      prevNodes.map((node: any) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...formData,
              // Syncs internal 'name' field to the visual label on the canvas
              label: formData.name ? formData.name : node.data.label, 
            }
          };
        }
        return node;
      })
    );
  };

  // Prevent rendering if no node is selected
  if (!selectedNode) return null;

  // Registry of nodes that have a corresponding settings component
  const supportedTypes = [
    'agentNode', 
    'endNode', 
    'ifElseNode', 
    'whileNode', 
    'userApprovalNode', 
    'apiNode'
  ];

  return (
    <div className='fixed right-5 top-20 z-50 p-5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 h-fit max-h-[85vh] overflow-y-auto'>
         
         <div className="mb-4 pb-2 border-b border-slate-100">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">Node Settings</p>
         </div>

         {/* Settings Component Registry */}
         {selectedNode.type === 'agentNode' && (
           <AgentSettings selectedNode={selectedNode} updateFormData={onUpdateNodeData} />
         )}

         {selectedNode.type === 'endNode' && (
            <EndSettings selectedNode={selectedNode} updateFormData={onUpdateNodeData} />
         )}

         {selectedNode.type === 'ifElseNode' && (
            <IfElseSettings selectedNode={selectedNode} updateFormData={onUpdateNodeData} />
         )}

         {selectedNode.type === 'whileNode' && (
            <WhileSettings selectedNode={selectedNode} updateFormData={onUpdateNodeData} />
         )}

         {selectedNode.type === 'userApprovalNode' && (
            <UserApprovalSettings selectedNode={selectedNode} updateFormData={onUpdateNodeData} />
         )}

         {selectedNode.type === 'apiNode' && (
            <ApiSettings selectedNode={selectedNode} updateFormData={onUpdateNodeData} />
         )}

         {/* Fallback for unsupported/new node types */}
         {!supportedTypes.includes(selectedNode.type) && (
            <div className="py-10 text-center">
                <p className="text-sm text-slate-400 italic">Settings for "{selectedNode.type}" are coming soon.</p>
            </div>
         )}
    </div>
  );
}

export default SettingsPanel;