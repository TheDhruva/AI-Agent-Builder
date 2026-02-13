"use client"
import { WorkflowContext } from '@/context/WorkflowContext';
import React, { useContext } from 'react'
import AgentSettings from '../_nodeSettings/AgentSettings';

function SettingsPanel() {
  // Destructure setNodes and selectedNode from context
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
              label: formData.name || node.data.label, // Syncs name to canvas label
              ...formData // Spreads all settings (model, instruction, etc.) into data
            }
          };
        }
        return node;
      })
    );
  };

  if (!selectedNode) return null;

  return (
    <div className='p-5 w-80 bg-white rounded-lg shadow-sm border border-slate-200 h-fit max-h-[90vh] overflow-y-auto'>
         {/* Use strict equality and pass the correctly named prop */}
         {selectedNode?.type === 'agentNode' && (
           <AgentSettings 
             selectedNode={selectedNode} 
             onSaveSettings={(formData: any) => onUpdateNodeData(formData)} 
           />
         )}
    </div>
  );
}

export default SettingsPanel;