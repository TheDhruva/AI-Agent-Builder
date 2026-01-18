import { Button } from "@/components/ui/button";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <h2 className="text-4xl font-black tracking-tighter">BATMAN</h2>
      
      {/* 1. Show 'Get Started' if logged out, 'Dashboard' if logged in */}
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="default" size="lg">Get Started</Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </div>
  );
}