"use client"
import React, { useCallback, useContext, useEffect } from 'react'
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from "convex/react"; // FIXED: Added useMutation
import { api } from "@/convex/_generated/api";
import { 
  ReactFlow, 
  addEdge, 
  Background, 
  Controls, 
  MiniMap, 
  Panel,
  applyNodeChanges, 
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  BackgroundVariant,
  Node, 
  Edge,
  OnSelectionChangeParams,
  useOnSelectionChange,
  ReactFlowProvider 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { WorkflowContext } from '@/context/WorkflowContext';
import Header from '../_components/Header';
import StartNodes from '../_customNodes/StartNodes';
import AgentNode from '../_customNodes/AgentNode';
import AgentToolsPanel from '../_components/AgentToolsPanel';
import EndNode from '../_customNodes/EndNode';
import IfElseNode from '../_customNodes/IfElseNode';
import WhileNode from '../_customNodes/WhileNode';
import UserApprovalNode from '../_customNodes/UserApprovalNode';
import ApiNode from '../_customNodes/ApiNode';
import SettingsPanel from '../_components/SettingsPanel';

const nodeTypes = {
  startNode: StartNodes, 
  agentNode: AgentNode,
  endNode: EndNode,
  ifElseNode: IfElseNode,
  whileNode: WhileNode,
  userApprovalNode: UserApprovalNode,
  apiNode: ApiNode,
};

function SelectionHandler() {
  const { setSelectedNode } = useContext(WorkflowContext);
  useOnSelectionChange({
    onChange: useCallback(({ nodes }: OnSelectionChangeParams) => {
      setSelectedNode(nodes[0] || null);
    }, [setSelectedNode]),
  });
  return null;
}

function AgentBuilderContent() {
  const params = useParams();
  const agentId = params?.agentId as string;

  const { nodes, setNodes, edges, setEdges } = useContext(WorkflowContext);
  
  // Data Fetching and Mutations
  const agentDetail = useQuery(api.agents.GetAgentById, { agentId });
  const updateAgent = useMutation(api.agents.UpdateAgentDetail); // FIXED: Initialize mutation

  useEffect(() => {
    if (agentDetail) {
      setNodes(agentDetail.nodes || []);
      setEdges(agentDetail.edges || []);
    }
  }, [agentDetail, setNodes, setEdges]);

  // FIXED: Corrected syntax and implemented mutation call
  const SaveNodesAndEdges = async () => {
    if (!agentDetail?._id) return;
    
    try {
      const result = await updateAgent({
        id: agentDetail._id,
        nodes: nodes,
        edges: edges,
      });
      console.log('Saved to DB:', result);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  );

  if (!agentDetail) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50">
      {/* Pass save function to Header for the Save Button */}
      <Header agentDetail={agentDetail} onSave={SaveNodesAndEdges} />
      
      <div className="grow w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <SelectionHandler />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          <MiniMap />
          
          <Panel position="top-left" className="h-[80%] mt-4">
             <AgentToolsPanel />
          </Panel>

          <Panel position="top-right" className="flex flex-col gap-2 mt-4 mr-4">
            <div className="h-full">
               <SettingsPanel />
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

function AgentBuilder() {
  return (
    <ReactFlowProvider>
      <AgentBuilderContent />
    </ReactFlowProvider>
  );
}

export default AgentBuilder;