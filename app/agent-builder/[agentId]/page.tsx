"use client"
import React, { useCallback, useContext, useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from "convex/react";
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

export const nodeTypes = {
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
  const [isLoaded, setIsLoaded] = useState(false);

  const { nodes, setNodes, edges, setEdges } = useContext(WorkflowContext);
  
  const agentDetail = useQuery(api.agents.GetAgentById, { agentId });
  const updateAgent = useMutation(api.agents.UpdateAgentDetail);

  // 1. Initial Load from DB
  useEffect(() => {
    if (agentDetail && !isLoaded) {
      setNodes(agentDetail.nodes || []);
      setEdges(agentDetail.edges || []);
      setIsLoaded(true);
    }
  }, [agentDetail, isLoaded, setNodes, setEdges]);

  // 2. AUTO-SAVE LOGIC: Syncs to DB whenever nodes or edges change
  useEffect(() => {
    if (!isLoaded || !agentDetail?._id) return;

    // Debounce: Wait 1 second after the last change before saving
    const delayDebounceFn = setTimeout(() => {
      SaveNodesAndEdges();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [nodes, edges, isLoaded]);

  const SaveNodesAndEdges = async () => {
    if (!agentDetail?._id) return;
    try {
      await updateAgent({
        id: agentDetail._id,
        nodes: nodes,
        edges: edges,
      });
      console.log('Auto-saved to database');
    } catch (error) {
      console.error('Auto-save failed:', error);
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

  if (!agentDetail) return <div className="h-screen flex items-center justify-center">Loading Workflow...</div>;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50">
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

          <Panel position="top-right" className="mt-4 mr-4">
               <SettingsPanel />
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