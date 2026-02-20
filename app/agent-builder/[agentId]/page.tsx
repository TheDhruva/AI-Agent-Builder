"use client"
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from 'lucide-react';
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
import { usePublishDialog } from './usePublishDialog';
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
  const [isSaving, setIsSaving] = useState(false); // Feedback state

  const { nodes, setNodes, edges, setEdges } = useContext(WorkflowContext);
  
  const agentDetail = useQuery(api.agents.GetAgentById, { agentId });
  const updateAgent = useMutation(api.agents.UpdateAgentDetail);

  // 1. Initial Load: Only syncs once when data arrives
  useEffect(() => {
    if (agentDetail && !isLoaded) {
      if (agentDetail.nodes) setNodes(agentDetail.nodes);
      if (agentDetail.edges) setEdges(agentDetail.edges);
      setIsLoaded(true);
    }
  }, [agentDetail, isLoaded, setNodes, setEdges]);

  // 2. Optimized Auto-Save Logic
  useEffect(() => {
    if (!isLoaded || !agentDetail?._id) return;

    const delayDebounceFn = setTimeout(() => {
      SaveNodesAndEdges();
    }, 1500); // 1.5s is the sweet spot for workflow builders

    return () => clearTimeout(delayDebounceFn);
  }, [nodes, edges, isLoaded]);

  const SaveNodesAndEdges = async () => {
    if (!agentDetail?._id) return;
    setIsSaving(true);
    try {
      await updateAgent({
        id: agentDetail._id,
        nodes: nodes,
        edges: edges,
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      // Small delay for UI smoothness so the "Saved" icon doesn't flicker
      setTimeout(() => setIsSaving(false), 500);
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


  const { openDialog: openPublishDialog, dialog: publishDialog } = usePublishDialog();

  if (!agentDetail) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">Mounting Canvas...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50">
      <Header 
        agentDetail={agentDetail} 
        onSave={SaveNodesAndEdges} 
        isAutoSaving={isSaving}
        // Add a Publish button in builder mode
        rightExtra={
          <button
            className="ml-2 px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
            onClick={openPublishDialog}
          >
            Publish
          </button>
        }
      />
      {publishDialog}
      <div className="grow w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          // Snap to grid for cleaner UI
          snapToGrid={true}
          snapGrid={[20, 20]}
        >
          <SelectionHandler />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} />
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