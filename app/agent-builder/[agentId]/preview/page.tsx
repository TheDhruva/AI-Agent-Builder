"use client"
import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Header from '../../_components/Header';
import StartNodes from '../../_customNodes/StartNodes';
import AgentNode from '../../_customNodes/AgentNode';
import EndNode from '../../_customNodes/EndNode';
import IfElseNode from '../../_customNodes/IfElseNode';
import WhileNode from '../../_customNodes/WhileNode';
import UserApprovalNode from '../../_customNodes/UserApprovalNode';
import ApiNode from '../../_customNodes/ApiNode';

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
    const convex = useConvex();
    const { agentId } = useParams();

    const [agentDetail, setAgentDetail] = useState<any>(undefined);
    const [config, setConfig] = useState<any>(null);
    const [error, setError] = useState(false);

    // 📡 Fetch Data
    useEffect(() => {
        if (agentId) GetAgentDetail();
    }, [agentId]);

    const GetAgentDetail = async () => {
        try {
            const result = await convex.query(api.agents.GetAgentById, {
                agentId: agentId as string,
            });
            if (!result) setAgentDetail(null);
            else setAgentDetail(result);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(true);
        }
    };

    // ⚙️ Process Workflow Config
    useEffect(() => {
        if (agentDetail) {
            GenerateWorkflow();
        }
    }, [agentDetail]);

    const GenerateWorkflow = () => {
        const edgeMap = agentDetail?.edges?.reduce((acc: any, edge: any) => {
            if (!acc[edge.source]) acc[edge.source] = [];
            acc[edge.source].push(edge);
            return acc;
        }, {});

        const flow = agentDetail?.nodes?.map((node: any) => {
            const connectedEdges = edgeMap?.[node.id] || [];
            let next: any = null;

            switch (node.type) {
                case "ifElseNode": {
                    const ifEdge = connectedEdges.find((e: any) => e.sourceHandle === "if");
                    const elseEdge = connectedEdges.find((e: any) => e.sourceHandle === "else");
                    next = { if: ifEdge?.target || null, else: elseEdge?.target || null };
                    break;
                }
                default: {
                    if (connectedEdges.length === 1) next = connectedEdges[0].target;
                    else if (connectedEdges.length > 1) next = connectedEdges.map((e: any) => e.target);
                    break;
                }
            }

            return {
                id: node.id,
                type: node.type,
                settings: node.data || {},
                next,
            };
        });

        const startNode = agentDetail?.nodes?.find((n: any) => n.type === "startNode");
        setConfig({ startNode: startNode?.id || null, flow });
    };

    if (agentDetail === undefined) return (
        <div className="h-screen flex items-center justify-center animate-pulse text-slate-500">
            Initializing Preview...
        </div>
    );

    if (error || agentDetail === null) return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-bold text-red-500">Workflow Not Found</h2>
            <button onClick={() => window.location.reload()} className="text-sm underline">Retry</button>
        </div>
    );

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
            <Header previewHeader={true} agentDetail={agentDetail} />
            
            <main className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
                {/* Visual Flow Canvas */}
                <div className="col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
                    <ReactFlow
                        nodes={agentDetail?.nodes || []}
                        edges={agentDetail?.edges || []}
                        nodeTypes={nodeTypes}
                        fitView
                        nodesDraggable={false}
                        nodesConnectable={false}
                    >
                        <Background variant={BackgroundVariant.Dots} color="#cbd5e1" gap={25} />
                        <Controls showInteractive={false} />
                    </ReactFlow>
                </div>

                {/* Chat UI Sidebar */}
                <div className="col-span-4 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">Chat Preview</h3>
                        <p className="text-sm text-slate-500">Interact with your agent logic below.</p>
                        <hr className="my-4" />
                        {/* Chat Interface Component Goes Here */}
                        <div className="bg-slate-50 rounded-lg p-4 h-[70%] border border-dashed flex items-center justify-center text-slate-400">
                            Waiting for user input...
                        </div>
                    </div>
                    <div className="mt-4">
                        <input 
                            placeholder="Type a message..." 
                            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PreviewAgent;