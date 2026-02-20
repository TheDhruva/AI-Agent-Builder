"use client"
import { Button } from '@/components/ui/button'
import { ChevronLeft, Play, Rocket, Code, X, Loader2, CloudCheck } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Agent } from '@/types/AgentType'

type Props = {
    agentDetail: any; // Using any to accommodate Convex _id or agentId
    previewHeader?: boolean;
    onSave?: () => Promise<void>;
    isAutoSaving?: boolean;
}

function Header({ agentDetail, previewHeader = false, onSave, isAutoSaving = false }: Props) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  // Extract the ID safely for routing
  const activeId = agentDetail?.agentId || agentDetail?._id || agentDetail?.id;

  const handlePublish = async () => {
    if (!onSave) return;
    setIsPublishing(true);
    try {
        await onSave();
    } catch (error) {
        console.error("Publish failed:", error);
    } finally {
        setIsPublishing(false);
    }
  };

  return (
    <div className='p-4 border-b flex items-center justify-between bg-white shadow-sm sticky top-0 z-50'>
        {/* Left Section: Navigation & Status */}
        <div className='flex gap-3 items-center'>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="rounded-full h-8 w-8"
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <h2 className="text-md font-bold tracking-tight text-slate-800">
                        {agentDetail?.agentName || 'Agent Builder'}
                    </h2>
                    {previewHeader && (
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest bg-orange-500 px-1.5 py-0.5 rounded">
                            Preview Mode
                        </span>
                    )}
                </div>
                
                {!previewHeader && (
                    <div className="flex items-center gap-1 text-slate-500">
                        {isAutoSaving ? (
                            <>
                                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                <span className="text-[10px]">Syncing to cloud...</span>
                            </>
                        ) : (
                            <>
                                <CloudCheck className="h-2.5 w-2.5 text-emerald-500" />
                                <span className="text-[10px]">Saved to Convex</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Right Section: Actions */}
        <div className='flex items-center gap-2'>
            {!previewHeader ? (
                <>
                    <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
                        <Code className="h-3.5 w-3.5" />
                        JSON
                    </Button>
                    <Link href={`/agent-builder/${activeId}/preview`}>
                        <Button variant="secondary" size="sm" className="gap-2 text-xs h-8">
                            <Play className="h-3.5 w-3.5 fill-current" />
                            Run Preview
                        </Button>
                    </Link>
                    <Button
                        size="sm"
                        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 h-8 min-w-[90px] text-xs"
                        onClick={handlePublish}
                        disabled={isPublishing || !onSave}
                    >
                        {isPublishing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Rocket className="h-3.5 w-3.5" />
                        )}
                        {isPublishing ? 'Publishing' : 'Publish'}
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        size="sm"
                        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 h-8 min-w-[90px] text-xs"
                        onClick={handlePublish}
                        disabled={isPublishing || !onSave}
                    >
                        {isPublishing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Rocket className="h-3.5 w-3.5" />
                        )}
                        {isPublishing ? 'Publishing' : 'Publish'}
                    </Button>
                    <Link href={`/agent-builder/${activeId}`}>
                        <Button variant="outline" size="sm" className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 h-8 text-xs">
                            <X className="h-3.5 w-3.5" />
                            Exit Preview
                        </Button>
                    </Link>
                </>
            )}
        </div>
    </div>
  )
}

export default Header;