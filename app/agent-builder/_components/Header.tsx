import { Button } from '@/components/ui/button'
import { ChevronLeft, Play, Rocket, Code } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'

type Props={
    agentDetail: Agent
}


function Header({ agentDetail }: Props) {
  const router = useRouter();

  return (
    <div className='p-4 border-b flex items-center justify-between bg-background'>
        {/* Left Section: Navigation */}
        <div className='flex gap-3 items-center'>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="rounded-full"
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-bold tracking-tight">{agentDetail?.agentName || 'Agent Builder'}</h2>
        </div>

        {/* Right Section: Actions */}
        <div className='flex items-center gap-2'>
            <Button variant="outline" size="sm" className="gap-2">
                <Code className="h-4 w-4" />
                Code
            </Button>
            <Button variant="secondary" size="sm" className="gap-2">
                <Play className="h-4 w-4 fill-current" />
                Preview
            </Button>
            <Button size="sm" className="gap-2 bg-primary">
                <Rocket className="h-4 w-4" />
                Publish
            </Button>
        </div>
    </div>
  )
}

export default Header