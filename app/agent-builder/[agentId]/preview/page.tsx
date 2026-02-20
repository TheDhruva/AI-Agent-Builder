"use client"
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import axios from 'axios';
import { RefreshCcw, Loader2 } from 'lucide-react';
import '@xyflow/react/dist/style.css';

import Header from '../../_components/Header';
import StartNodes from '../../_customNodes/StartNodes';
import AgentNode from '../../_customNodes/AgentNode';
import EndNode from '../../_customNodes/EndNode';
import IfElseNode from '../../_customNodes/IfElseNode';
import WhileNode from '../../_customNodes/WhileNode';
import UserApprovalNode from '../../_customNodes/UserApprovalNode';
import ApiNode from '../../_customNodes/ApiNode';
import { Button } from '@/components/ui/button';
import ChatUi from './_components/ChatUi';
import PublishCodeDialog from './_components/PublishCodeDialog'; 

const nodeTypes = {
    startNode: StartNodes,
    agentNode: AgentNode,
    endNode: EndNode,
    ifElseNode: IfElseNode,
    whileNode: WhileNode,
    userApprovalNode: UserApprovalNode,
    apiNode: ApiNode,
};

function PreviewAgent() {
    const { agentId } = useParams();
    
    // 1. LIVE DATA: Auto-syncs with Convex DB
    const agentDetail = useQuery(api.agents.GetAgentById, {
        agentId: agentId as string,
    });

    const updateToolConfig = useMutation(api.agents.UpdateAgentToolConfig);

    const [conversationId, setConversationId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [openPublishDialog, setOpenPublishDialog] = useState(false);

    // 2. Initialize Conversation Thread
    const InitializeConversation = useCallback(async () => {
        try {
            const res = await axios.get('/api/conversation');
            setConversationId(res.data.conversationId);
        } catch (err) {
            console.error("Conversation Init Error:", err);
        }
    }, []);

    useEffect(() => {
        InitializeConversation();
    }, [InitializeConversation]);

    // 3. Transform Flow Graph to Agent JSON
    const flowConfig = useMemo(() => {
        if (!agentDetail?.nodes) return null;

        const edgeMap = agentDetail.edges?.reduce((acc: any, edge: any) => {
            if (!acc[edge.source]) acc[edge.source] = [];
            acc[edge.source].push(edge);
            return acc;
        }, {});

        const flow = agentDetail.nodes.map((node: any) => {
            const connectedEdges = edgeMap?.[node.id] || [];
            let next: any = null;

            if (node.type === "ifElseNode") {
                const ifEdge = connectedEdges.find((e: any) => e.sourceHandle === "if");
                const elseEdge = connectedEdges.find((e: any) => e.sourceHandle === "else");
                next = { if: ifEdge?.target || null, else: elseEdge?.target || null };
            } else {
                if (connectedEdges.length === 1) next = connectedEdges[0].target;
                else if (connectedEdges.length > 1) next = connectedEdges.map((e: any) => e.target);
            }
            return { id: node.id, type: node.type, settings: node.data || {}, next };
        });

        const startNode = agentDetail.nodes.find((n: any) => n.type === "startNode");
        return { startNode: startNode?.id || null, flow };
    }, [agentDetail]);

    // 4. Brain Generation Handler
    const GenerateAgentToolConfig = async () => {
        if (!agentDetail?._id || !flowConfig) return;
        setLoading(true);
        setGenerationError(null);
        try {
            const result = await axios.post('/api/generate-agent-tool-config', {
                jsonConfig: flowConfig
            });

            await updateToolConfig({
                id: agentDetail._id,
                agentToolConfig: result.data
            });
        } catch (err: any) {
            setGenerationError(err.response?.data?.details || err.message || "Failed to generate brain.");
        } finally {
            setLoading(false);
        }
    }

    const OnPublish = async () => {
        setOpenPublishDialog(true);
    };

    if (agentDetail === undefined) return <div className="h-screen flex items-center justify-center animate-pulse text-slate-400">Syncing with Convex...</div>;
    if (agentDetail === null) return <div className="h-screen flex items-center justify-center text-slate-600">Agent record not found.</div>;

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
            <Header previewHeader={true} agentDetail={agentDetail} onSave={OnPublish} />
            
            <main className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
                <div className="col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                    <ReactFlow
                        nodes={agentDetail?.nodes || []}
                        edges={agentDetail?.edges || []}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Background variant={BackgroundVariant.Dots} color="#cbd5e1" gap={25} />
                        <Controls showInteractive={false} />
                    </ReactFlow>
                </div>

                <div className="col-span-4 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
                    <h3 className="font-bold text-lg mb-1 text-slate-800">Chat Preview</h3>
                    <p className="text-xs text-slate-500 mb-6">Validate logic pathways and AI responses.</p>
                    
                    <div className='flex-1 flex flex-col min-h-0'>
                        {!agentDetail?.agentToolConfig ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                {generationError && <p className="text-[11px] text-red-500 text-center bg-red-50 p-2 rounded border border-red-100">{generationError}</p>}
                                <Button onClick={GenerateAgentToolConfig} disabled={loading} className="gap-2">
                                    {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <RefreshCcw className="h-4 w-4" />}
                                    Generate Agent Brain
                                </Button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 gap-4">
                                <div className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold border border-emerald-100 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    BRAIN ACTIVE
                                </div>
                                <div className="flex-1 min-h-0 border rounded-xl overflow-hidden shadow-sm bg-slate-50">
                                    <ChatUi 
                                      agentToolConfig={agentDetail.agentToolConfig} 
                                      GenerateAgentToolConfig={GenerateAgentToolConfig} 
                                      loading={loading}
                                      conversationId={conversationId}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <PublishCodeDialog openDialog={openPublishDialog} setOpenDialog={setOpenPublishDialog} />
            </main>
        </div>
    );
}

export default PreviewAgent;