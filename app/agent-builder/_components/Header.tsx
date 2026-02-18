"use client"
import { Button } from '@/components/ui/button'
import { ChevronLeft, Play, Rocket, Code, X, Loader2, CloudCheck, CloudUpload } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Agent } from '@/types/AgentType'


type Props = {
    agentDetail: Agent;
    previewHeader?: boolean;
    onSave?: () => Promise<void>;
    isAutoSaving?: boolean; // New prop for auto-save feedback
}

function Header({ agentDetail, previewHeader = false, onSave, isAutoSaving = false }: Props) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

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
    <div className='p-4 border-b flex items-center justify-between bg-background shadow-sm'>
        {/* Left Section: Navigation & Status */}
        <div className='flex gap-3 items-center'>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="rounded-full"
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight">
                        {agentDetail?.agentName || 'Agent Builder'}
                    </h2>
                    {previewHeader && (
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-orange-500 px-2 py-0.5 rounded">
                            Preview
                        </span>
                    )}
                </div>
                
                {/* Auto-save Status Indicator */}
                {!previewHeader && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                        {isAutoSaving ? (
                            <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span className="text-[10px]">Syncing changes...</span>
                            </>
                        ) : (
                            <>
                                <CloudCheck className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px]">All changes saved</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Right Section: Actions */}
        <div className='flex items-center gap-2'>
            {!previewHeader && (
                <>
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <Code className="h-4 w-4" />
                        JSON
                    </Button>
                    <Link href={`/agent-builder/${agentDetail?.agentId || agentDetail?.id}/preview`}>
                        <Button variant="secondary" size="sm" className="gap-2 text-xs">
                            <Play className="h-4 w-4 fill-current" />
                            Preview
                        </Button>
                    </Link>
                </>
            )}

            {previewHeader && (
                <Link href={`/agent-builder/${agentDetail?.agentId || agentDetail?.id}`}>
                    <Button variant="outline" size="sm" className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
                        <X className="h-4 w-4" />
                        Close Preview
                    </Button>
                </Link>
            )}

            {!previewHeader && (
                <Button
                    size="sm"
                    className="gap-2 bg-primary text-white hover:bg-primary/90 min-w-[100px]"
                    onClick={handlePublish}
                    disabled={isPublishing || !onSave}
                >
                    {isPublishing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Rocket className="h-4 w-4" />
                    )}
                    {isPublishing ? 'Publishing...' : 'Publish'}
                </Button>
            )}
        </div>
    </div>
  )
}

export default Header