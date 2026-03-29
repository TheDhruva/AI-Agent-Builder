import { Button } from "@/components/ui/button";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Bot, Database, Code2 } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#0A0A0A] text-[#F2F0E9] overflow-hidden px-6">
      {/* Subtle Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-10">
        
        {/* Status Pill */}
        <div className="inline-flex items-center rounded-full border border-[#222222] bg-[#111111]/50 px-4 py-1.5 text-sm font-medium text-neutral-400 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-neutral-300 mr-2 animate-pulse"></span>
          AI-Agent-Builder Framework
        </div>

        {/* Hero Copy */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter lg:leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-[#F2F0E9] to-neutral-600">
            Construct & Orchestrate <br className="hidden md:block" />
            <span className="text-[#F2F0E9] bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">Autonomous AI</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
            A comprehensive platform to define agent behaviors, manage real-time conversational states, and execute advanced reasoning workflows.
          </p>
        </div>

        {/* Core Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-4xl mx-auto text-left">
          <div className="p-5 rounded-2xl border border-[#222222] bg-[#111111]/40 backdrop-blur-sm transition-colors hover:bg-[#111111]/80">
            <Bot className="w-6 h-6 text-neutral-300 mb-4" />
            <h3 className="font-semibold text-[#F2F0E9] text-lg">Deep AI Integration</h3>
            <p className="text-sm text-neutral-500 mt-2 leading-relaxed">Execute complex workflows with native support for advanced reasoning models.</p>
          </div>
          <div className="p-5 rounded-2xl border border-[#222222] bg-[#111111]/40 backdrop-blur-sm transition-colors hover:bg-[#111111]/80">
            <Database className="w-6 h-6 text-neutral-300 mb-4" />
            <h3 className="font-semibold text-[#F2F0E9] text-lg">Real-Time State</h3>
            <p className="text-sm text-neutral-500 mt-2 leading-relaxed">Persist chat histories and manage complex data layers instantly.</p>
          </div>
          <div className="p-5 rounded-2xl border border-[#222222] bg-[#111111]/40 backdrop-blur-sm transition-colors hover:bg-[#111111]/80">
            <Code2 className="w-6 h-6 text-neutral-300 mb-4" />
            <h3 className="font-semibold text-[#F2F0E9] text-lg">Modern Architecture</h3>
            <p className="text-sm text-neutral-500 mt-2 leading-relaxed">Built for speed using Next.js App Router, Tailwind CSS, and strict TypeScript safety.</p>
          </div>
        </div>

        {/* Call to Action Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold bg-[#F2F0E9] hover:bg-white text-[#0A0A0A] h-14 px-8 rounded-full transition-all shadow-[0_0_30px_-10px_rgba(242,240,233,0.25)]">
                Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4 bg-[#111111]/80 p-2 pl-4 rounded-full border border-[#222222] backdrop-blur-xl">
              <span className="text-sm font-medium text-neutral-400 hidden sm:block">Welcome back.</span>
              <Link href="/dashboard">
                <Button variant="default" className="rounded-full bg-[#F2F0E9] hover:bg-white text-[#0A0A0A] font-semibold shadow-md transition-colors">
                  Enter Dashboard
                </Button>
              </Link>
              <div className="pr-2 flex items-center border-l border-[#333333] pl-4">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 border border-[#333333]" } }} />
              </div>
            </div>
          </SignedIn>
        </div>

      </div>
    </main>
  );
}