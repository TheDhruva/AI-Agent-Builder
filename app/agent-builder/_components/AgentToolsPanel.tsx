import React, { useContext } from 'react';
import { Bot, Square, GitBranch, Repeat, CheckCircle, Globe } from 'lucide-react';
import { WorkflowContext } from '@/context/WorkflowContext';
import { Node } from '@xyflow/react'; // Import Node type

const TOOLS = [
  { id: 'agent', name: 'Agent', type: 'agentNode', icon: Bot, color: 'text-purple-600', bg: 'bg-purple-50', hex: '#faf5ff' },
  { id: 'condition', name: 'If/Else', type: 'ifElseNode', icon: GitBranch, color: 'text-orange-600', bg: 'bg-orange-50', hex: '#fff7ed' },
  { id: 'loop', name: 'While Loop', type: 'whileNode', icon: Repeat, color: 'text-blue-600', bg: 'bg-blue-50', hex: '#eff6ff' },
  { id: 'approval', name: 'User Approval', type: 'userApprovalNode', icon: CheckCircle, color: 'text-amber-600', bg: 'bg-amber-50', hex: '#fffbeb' },
  { id: 'api', name: 'API Call', type: 'apiNode', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50', hex: '#ecfdf5' },
  { id: 'end', name: 'End', type: 'endNode', icon: Square, color: 'text-red-600', bg: 'bg-red-50', hex: '#fef2f2' },
];

// Helper type to infer the shape of a single tool
type ToolType = typeof TOOLS[number];

function AgentToolsPanel() {
  const { nodes, setNodes } = useContext(WorkflowContext);

  // Fix 1 & 2: Explicit types for event and nodeType
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Fix 3: Explicit type for 'tool'
  const onAgentToolClick = (tool: ToolType) => {
    const newNode: Node = { // Explicitly typing the new node
      id: `${tool.id}-${Date.now()}`,
      type: tool.type,
      position: { x: Math.random() * 50 + 100, y: 100 + (nodes.length * 20) }, 
      data: { 
        label: tool.name, 
        bg: tool.hex
      },
    };
    
    // Fix 4: Explicit type for 'prev' (inferred as Node[])
    setNodes((prev: Node[]) => [...prev, newNode]);
  };

  return (
    <div className="w-64 bg-white p-4 border-r border-slate-200 h-full flex flex-col gap-3">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Components</h3>
      
      {TOOLS.map((tool) => (
        <div
          key={tool.id}
          draggable
          onDragStart={(e) => onDragStart(e, tool.type)}
          onClick={() => onAgentToolClick(tool)}
          className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-blue-400 hover:shadow-sm transition-all cursor-grab active:cursor-grabbing group select-none"
        >
          <div className={`p-2 rounded-lg ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform`}>
            <tool.icon size={18} />
          </div>
          <span className="text-sm font-medium text-slate-600">{tool.name}</span>
        </div>
      ))}
    </div>
  );
}

export default AgentToolsPanel;