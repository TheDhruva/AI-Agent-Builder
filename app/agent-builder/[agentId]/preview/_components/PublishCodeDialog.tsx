"use client"

import React, { useEffect, useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CodeBlock } from "@/components/ui/code-block"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Loader2, X, Copy, Check, ExternalLink, AlertCircle } from 'lucide-react';

type Props = {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
}

function PublishCodeDialog({ openDialog, setOpenDialog }: Props) {
    const { agentId } = useParams();
    const [baseUrl, setBaseUrl] = useState('');
    
    // 1. Fetching the agent - Ensure this matches your query name in Convex
    const agentDetail = useQuery(api.agents.GetAgentById, {
        agentId: agentId as string,
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(window.location.origin);
        }
        // DEBUG: Check what's actually coming from the DB
        if (openDialog) console.log("🔍 Dialog Data:", agentDetail);
    }, [openDialog, agentDetail]);

    const codeSnippets = useMemo(() => {
        // We only generate snippets if we have a valid config
        if (!agentDetail?.agentToolConfig || !baseUrl) return [];

        const config = agentDetail.agentToolConfig;
        const agentName = config.primaryAgentName || "MyAI";
        
        return [
            {
                language: 'html',
                filename: 'embed.html',
                title: 'Iframe Embed',
                code: `<iframe \n  src="${baseUrl}/agent-chat/${agentId}" \n  width="100%" \n  height="600px" \n  style="border-radius: 12px; border: 1px solid #e2e8f0;"\n></iframe>`
            },
            {
                language: 'tsx',
                filename: 'useAgent.ts',
                title: 'React Hook',
                code: `// ... (Your hook code from before)`
            }
        ];
    }, [agentDetail, baseUrl, agentId]);

    const isLoading = agentDetail === undefined;
    const noConfig = agentDetail && !agentDetail.agentToolConfig;

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                        Publish Your Agent
                    </DialogTitle>
                    <DialogDescription>
                        Deploy <span className="font-bold text-slate-900">{agentDetail?.agentName || 'your agent'}</span> to any platform.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="h-10 w-10 animate-spin mb-2" />
                            <p>Fetching deployment keys...</p>
                        </div>
                    ) : noConfig ? (
                        <div className="h-64 flex flex-col items-center justify-center p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
                            <h3 className="font-bold text-lg">Brain Not Generated</h3>
                            <p className="text-slate-500 text-sm max-w-xs mt-2">
                                You must click <strong>"Reboot Agent"</strong> in the preview panel to generate the AI configuration before you can get the code.
                            </p>
                        </div>
                    ) : (
                        <Tabs defaultValue="tab-0" className="h-full flex flex-col">
                            <TabsList className="m-4 justify-start bg-slate-100 p-1">
                                {codeSnippets.map((s, i) => (
                                    <TabsTrigger key={i} value={`tab-${i}`} className="text-xs">
                                        {s.title}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <ScrollArea className="flex-1 px-4 pb-4">
                                {codeSnippets.map((s, i) => (
                                    <TabsContent key={i} value={`tab-${i}`} className="mt-0">
                                        <CodeBlock
                                            code={s.code}
                                            language={s.language}
                                            filename={s.filename}
                                        />
                                    </TabsContent>
                                ))}
                            </ScrollArea>
                        </Tabs>
                    )}
                </div>

                <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={() => setOpenDialog(false)}>Finished</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default PublishCodeDialog;