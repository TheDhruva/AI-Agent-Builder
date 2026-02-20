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

// FIXED: Removed 'export' keyword to prevent Next.js build failure
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { nodes, setNodes, edges, setEdges } = useContext(WorkflowContext);
  
  const agentDetail = useQuery(api.agents.GetAgentById, { agentId });
  const updateAgent = useMutation(api.agents.UpdateAgentDetail);

  // 1. Initial Load: Strict "Run Once" logic
  useEffect(() => {
    if (agentDetail && !isLoaded) {
      if (agentDetail.nodes) setNodes(agentDetail.nodes);
      if (agentDetail.edges) setEdges(agentDetail.edges);
      setIsLoaded(true);
    }
  }, [agentDetail, isLoaded, setNodes, setEdges]);

  // 2. Debounced Auto-Save
  useEffect(() => {
    if (!isLoaded || !agentDetail?._id) return;

    const delayDebounceFn = setTimeout(() => {
      SaveNodesAndEdges();
    }, 1500); 

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
        <p className="text-slate-500 font-medium text-sm">Mounting Workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50">
      <Header 
        agentDetail={agentDetail} 
        onSave={SaveNodesAndEdges} 
        isAutoSaving={isSaving}
        rightExtra={
          <button
            className="ml-2 px-4 py-1.5 rounded-md bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm"
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
          snapToGrid={true}
          snapGrid={[20, 20]}
        >
          <SelectionHandler />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          
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

// Final Default Export
export default function AgentBuilder() {
  return (
    <ReactFlowProvider>
      <AgentBuilderContent />
    </ReactFlowProvider>
  );
}