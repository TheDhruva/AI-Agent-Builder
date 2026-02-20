"use client"
import { Button } from '@/components/ui/button'
import { ChevronLeft, Play, Rocket, Code, X, Loader2, CloudCheck } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Props = {
    agentDetail: any; 
    previewHeader?: boolean;
    onSave?: () => Promise<void>;
    isAutoSaving?: boolean;
    rightExtra?: React.ReactNode; // Keep this for your builder page
}

function Header({ agentDetail, previewHeader = false, onSave, isAutoSaving = false, rightExtra }: Props) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

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

  // 1. REUSABLE PUBLISH BUTTON
  const PublishButton = (
    <Button
        size="sm"
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 h-8 min-w-[90px] text-xs transition-all active:scale-95"
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
  );

  return (
    <div className='p-4 border-b flex items-center justify-between bg-white shadow-sm sticky top-0 z-50'>
        <div className='flex gap-3 items-center'>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="rounded-full h-8 w-8 hover:bg-slate-100"
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <h2 className="text-md font-bold tracking-tight text-slate-800">
                        {agentDetail?.agentName || 'Agent Builder'}
                    </h2>
                    {previewHeader && (
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest bg-orange-500 px-1.5 py-0.5 rounded shadow-sm">
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

        <div className='flex items-center gap-2'>
            {/* 2. DYNAMIC ACTIONS BASED ON MODE */}
            {!previewHeader ? (
                <>
                    <Button variant="outline" size="sm" className="gap-2 text-xs h-8 border-slate-200">
                        <Code className="h-3.5 w-3.5" />
                        JSON
                    </Button>
                    <Link href={`/agent-builder/${activeId}/preview`}>
                        <Button variant="secondary" size="sm" className="gap-2 text-xs h-8">
                            <Play className="h-3.5 w-3.5 fill-current" />
                            Run Preview
                        </Button>
                    </Link>
                    {rightExtra}
                    {PublishButton}
                </>
            ) : (
                <>
                    {PublishButton}
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