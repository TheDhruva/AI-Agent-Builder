"use client"
import React, { useState, useCallback } from 'react'
import Header from '../_components/Header'
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  Background,
  MiniMap,
  Controls // FIX: Use Controls, not Controller
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 5 }, data: { label: 'Start: User Trigger' } },
  { id: '2', position: { x: 250, y: 100 }, data: { label: 'AI Processing' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true }
];

function AgentBuilder() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header />
      
      {/* FIX: Use Tailwind h-[90vh] or flex-grow */}
      <div className="flex-grow w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          {/* FIX: These must be children of ReactFlow */}
          <MiniMap />
          <Controls /> 
          <Background variant={'dots' as any} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default AgentBuilder;